<?php

namespace App\Http\Controllers;

use App\Http\Resources\UserResource;
use App\Models\PasswordResetToken;
use App\Models\UploadedFile;
use App\Models\User;
use App\Models\VerificationCode;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

class UsersController extends Controller
{
    public function register(Request $request)
    {
        $validated = $request->validate([
            'email' => ['required','email','unique:users,email'],
            'password' => ['required','min:8','regex:/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).*$/'],
            'passwordConfirmation' => ['same:password'],
            'fullName' => ['nullable','string'],
            // Backward compatibility: accept optional first/last if sent
            'firstName' => ['nullable','string'],
            'lastName' => ['nullable','string'],
        ]);
        $fullName = isset($validated['fullName'])
            ? (trim($validated['fullName']) ?: null)
            : (trim(($validated['firstName'] ?? '').' '.($validated['lastName'] ?? '')) ?: null);
        $user = User::create([
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'full_name' => $fullName,
            'role' => 'USER',
            'verified' => false,
        ]);

        $code = VerificationCode::create([
            'user_id' => $user->id,
            'code' => (string) random_int(100000, 999999),
            'email_sent' => false,
        ]);

        // Send welcome email (via Mailpit in local)
        Mail::send('emails.welcome-email', [
            'user' => $user,
            'verificationLink' => config('app.url').'/api/users/verify-email?token='.$code->code,
            'applicationName' => config('app.name'),
        ], function($m) use ($user) {
            $m->to($user->email)->subject('Welcome to our platform');
        });

        $code->email_sent = true; $code->save();

        return response()->json(new UserResource($user));
    }

    public function verifyEmail(Request $request)
    {
        $token = $request->query('token');
        $code = VerificationCode::where('code', $token)->first();
        if (!$code) {
            return response()->json(['message' => 'Invalid token'], 400);
        }
        if ($code->user) {
            $user = $code->user;
            $user->verified = true; $user->save();
        } elseif ($code->company) {
            $company = $code->company;
            $company->verified = true; $company->save();
        }

        $code->delete();
        return redirect()->to(env('LOGIN_PAGE_URL', config('app.url').'/auth/login'));
    }

    public function forgotPassword(Request $request)
    {
        $validated = $request->validate([
            'email' => ['required','email']
        ]);
        $user = User::where('email', $validated['email'])->first();
        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }

        $token = PasswordResetToken::create([
            'user_id' => $user->id,
            'token' => (string) random_int(100000, 999999),
            'email_sent' => false,
        ]);

        Mail::send('emails.password-reset', [
            'user' => $user,
            'link' => env('APP_URL', config('app.url')).'/auth/reset-password?token='.$token->token,
        ], function($m) use ($user) {
            $m->to($user->email)->subject('Password reset requested');
        });
        $token->email_sent = true; $token->expires_at = now()->addMinutes(10); $token->save();

        return response()->noContent();
    }

    public function resetPassword(Request $request)
    {
        $validated = $request->validate([
            'password' => ['required','min:8','regex:/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).*$/'],
            'confirmPassword' => ['same:password'],
            'passwordResetToken' => ['required']
        ]);
        $token = PasswordResetToken::where('token', $validated['passwordResetToken'])->first();
        if (!$token) return response()->json(['message' => 'Password reset token not found'], 404);
        if ($token->isExpired()) return response()->json(['message' => 'Password reset token is expired'], 400);

        $user = $token->user;
        $user->password = Hash::make($validated['password']);
        $user->save();
        return response()->noContent();
    }

    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'fullName' => ['required','string']
        ]);
        $user = Auth::user();
        if ((string)$user->id !== (string)$id) {
            return response()->json(['message' => 'Forbidden'], 403);
        }
        $user->full_name = $validated['fullName'];
        $user->save();
        return response()->json(new UserResource($user));
    }

    public function updatePassword(Request $request)
    {
        $validated = $request->validate([
            'oldPassword' => ['nullable','string'],
            'password' => ['required','min:8','regex:/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).*$/'],
            'confirmPassword' => ['same:password']
        ]);
        $user = Auth::user();
        if ($user->password && (!Hash::check($validated['oldPassword'] ?? '', $user->password))) {
            return response()->json(['message' => 'Wrong password'], 400);
        }
        $user->password = Hash::make($validated['password']);
        $user->save();
        return response()->json(new UserResource($user));
    }

    public function updateProfilePicture(Request $request, $id)
    {
        $request->validate([
            'file' => ['required','file']
        ]);
        $user = Auth::user();
        if ((string)$user->id !== (string)$id) {
            return response()->json(['message' => 'Forbidden'], 403);
        }
        $file = $request->file('file');

        $ext = $file->getClientOriginalExtension();
        $path = 'user:'.$user->id.'/profile-picture/'.Str::uuid().'.'.$ext;

        // If AWS configured, upload to S3; else store locally
        if (config('filesystems.disks.s3.key')) {
            Storage::disk('s3')->put($path, file_get_contents($file->getRealPath()), 'public');
            $url = Storage::disk('s3')->url($path);
        } else {
            Storage::disk('public')->put($path, file_get_contents($file->getRealPath()));
            $url = Storage::disk('public')->url($path);
        }

        $user->profile_image_url = $url; $user->save();
        UploadedFile::create([
            'user_id' => $user->id,
            'url' => $url,
            'size' => $file->getSize(),
            'original_file_name' => $file->getClientOriginalName(),
            'extension' => $ext,
            'uploaded_at' => now(),
        ]);
        return response()->json(new UserResource($user));
    }
}
