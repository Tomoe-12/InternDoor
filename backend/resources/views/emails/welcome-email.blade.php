<!doctype html>
<html>
<body>
  <h2>Welcome to {{ $applicationName }}</h2>
  <p>Hello {{ $user->full_name ?? $user->email }},</p>
  <p>Please verify your email by clicking the link below:</p>
  <p><a href="{{ $verificationLink }}">Verify Email</a></p>
</body>
</html>
