<?php

namespace App\Http\Controllers;

use App\Models\Notification;
use App\Models\PushNotificationSubscription;
use Illuminate\Http\Request;
use Minishlink\WebPush\WebPush;
use Minishlink\WebPush\Subscription as WebPushSubscription;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;

class NotificationsController extends Controller
{
    public function subscribe(Request $request)
    {
        $validated = $request->validate([
            'endpoint' => ['required','string'],
            'p256dh' => ['required','string'],
            'auth' => ['required','string'],
        ]);
        PushNotificationSubscription::firstOrCreate([
            'endpoint' => $validated['endpoint']
        ], [
            'p256dh_key' => $validated['p256dh'],
            'auth_key' => $validated['auth']
        ]);
        return response()->noContent();
    }

    public function denied(Request $request)
    {
        // Record denial event as needed; for now just accept
        return response()->noContent();
    }

    public function notify(Request $request)
    {
        $validated = $request->validate([
            'title' => ['required','string'],
            'message' => ['required','string'],
            'url' => ['nullable','string']
        ]);

        $notification = Notification::create([
            'title' => $validated['title'],
            'message' => $validated['message'],
            'url' => $validated['url'] ?? null,
            'delivered' => false,
        ]);

        $webPush = new WebPush([
            'VAPID' => [
                'subject' => env('VAPID_SUBJECT'),
                'publicKey' => env('VAPID_PUBLIC_KEY'),
                'privateKey' => env('VAPID_PRIVATE_KEY'),
            ],
        ]);

        foreach (PushNotificationSubscription::all() as $sub) {
            try {
                $subscription = WebPushSubscription::create([
                    'endpoint' => $sub->endpoint,
                    'publicKey' => $sub->p256dh_key,
                    'authToken' => $sub->auth_key,
                ]);
                $payload = json_encode([
                    'title' => $notification->title,
                    'message' => $notification->message,
                    'url' => $notification->url,
                    'id' => $notification->id,
                ]);
                $webPush->sendOneNotification($subscription, $payload);
            } catch (\Throwable $e) {
                Log::error('WebPush send failed: '.$e->getMessage());
            }
        }
        return response()->noContent();
    }

    public function delivery($id)
    {
        $n = Notification::findOrFail($id);
        $n->delivered = true; $n->save();
        return response()->noContent();
    }

    public function deliveryStats(Request $request)
    {
        $from = $request->query('from') ? date('Y-m-d H:i:s', strtotime($request->query('from'))) : now()->subDays(7);
        $to = $request->query('to') ? date('Y-m-d H:i:s', strtotime($request->query('to'))) : now();

        $rows = DB::table('notifications')
            ->selectRaw("strftime('%Y-%m-%d', created_at) as date, count(*) as count")
            ->whereBetween('created_at', [$from, $to])
            ->groupBy('date')
            ->orderBy('date')
            ->get();
        return response()->json($rows);
    }

    public function subscriptionStats(Request $request)
    {
        $from = $request->query('from') ? date('Y-m-d H:i:s', strtotime($request->query('from'))) : now()->subDays(7);
        $to = $request->query('to') ? date('Y-m-d H:i:s', strtotime($request->query('to'))) : now();

        $rows = DB::table('push_notification_subscriptions')
            ->selectRaw("strftime('%Y-%m-%d', created_at) as date, count(*) as count")
            ->whereBetween('created_at', [$from, $to])
            ->groupBy('date')
            ->orderBy('date')
            ->get();
        return response()->json($rows);
    }
}
