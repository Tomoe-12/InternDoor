<!doctype html>
<html>
<body>
  <h2>Password Reset</h2>
  <p>Hello {{ $user->full_name ?? $user->email }},</p>
  <p>Use the link below to reset your password:</p>
  <p><a href="{{ $link }}">Reset Password</a></p>
</body>
</html>
