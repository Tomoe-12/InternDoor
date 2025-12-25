# Verification Code & Token Management

## Overview
This system manages email verification codes with automatic expiry and cleanup functionality.

## Features Implemented

### 1. **Verification Code with Expiry**
- Codes expire after **1 hour**
- 43-character secure token (URL-safe base64)
- Stored in `verification_codes` table with `expires_at` timestamp

### 2. **Resend Verification Code**
Endpoint to resend verification email if user didn't receive it or code expired.

**Endpoint:**
```
POST /api/users/resend-verification-code
```

**Request Body:**
```json
{
  "email": "user@example.com"
}
```

**Response:**
```json
{
  "message": "Verification code sent successfully"
}
```

**When to use:**
- User registers but doesn't receive the email
- Original verification code expires (1 hour)
- User needs to verify their email before login

**Frontend Implementation:**
You can add a button on the registration/verification page:
```javascript
const handleResendCode = async (email) => {
  try {
    const response = await httpClient.post('/api/users/resend-verification-code', {
      email
    });
    toast.success(response.data.message);
  } catch (error) {
    toast.error('Failed to resend verification code');
  }
};
```

### 3. **Automated Cleanup Job**

#### Run Manually:
```bash
php artisan tokens:cleanup
```

This deletes all expired verification codes and password reset tokens.

#### Automated Scheduling:
The cleanup runs automatically every hour via Laravel's task scheduler.

To enable automatic scheduling, you need to add this cron job to your server:

**For Development (Local):**
```bash
# In one terminal, run the scheduler
php artisan schedule:work
```

**For Production:**
Add to your crontab:
```bash
* * * * * cd /path/to/project && php artisan schedule:run >> /dev/null 2>&1
```

This runs the scheduler every minute, which then executes scheduled tasks (cleanup every hour in this case).

## Database Queries (Manual Cleanup)

If you want to manually delete expired tokens:

```sql
-- Delete expired verification codes
DELETE FROM verification_codes WHERE expires_at < NOW();

-- Delete expired password reset tokens
DELETE FROM password_reset_tokens WHERE expires_at < NOW();
```

## Security Benefits

1. ✅ **Time-Limited Tokens** - Reduces risk if token is leaked
2. ✅ **Brute Force Protection** - Limited time window for attacks
3. ✅ **Database Optimization** - Automatic cleanup prevents table bloat
4. ✅ **User Prompt Action** - Email reminder about expiry encourages quick verification

## Verification Flow

```
User Registration
    ↓
Generate verification code (expires in 1 hour)
    ↓
Send email with verification link
    ↓
User clicks link within 1 hour
    ↓
Email verified, code deleted
    ↓
User can now login

OR

Code expires after 1 hour
    ↓
User clicks "Resend Code"
    ↓
New code generated (another 1 hour)
    ↓
Process repeats
```
