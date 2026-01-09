# Testing Guide

## Quick Start

### 1. Start the Development Server
```bash
npm run dev
```

### 2. Test API Endpoints

#### Using the Test Script
```bash
npx tsx scripts/test-api.ts
```

#### Manual Testing with curl

##### Create a Student
```bash
curl -X POST http://localhost:3000/api/students \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "TestPassword123!",
    "passwordConfirmation": "TestPassword123!",
    "firstName": "Test",
    "lastName": "User"
  }'
```

##### Get Students
```bash
curl http://localhost:3000/api/students?page=1&size=10
```

##### Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "TestPassword123!"
  }'
```

##### Get Current User (requires token)
```bash
# First, get token from login response, then:
curl http://localhost:3000/api/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

##### Create Company
```bash
curl -X POST http://localhost:3000/api/companies \
  -H "Content-Type: application/json" \
  -d '{
    "companyName": "Test Company",
    "companyEmail": "company@example.com",
    "password": "CompanyPassword123!"
  }'
```

##### Request Password Reset
```bash
curl -X POST http://localhost:3000/api/password-reset \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com"
  }'
```

##### Request Verification Code
```bash
curl -X POST http://localhost:3000/api/verification-codes \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "studentId": 1
  }'
```

## Testing with Next Safe Actions

### In React Components

```tsx
"use client";
import { useAction } from "next-safe-action/hooks";
import { loginAction } from "@/server/actions/auth.actions";

export function LoginForm() {
  const { execute, result, status } = useAction(loginAction);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    execute({
      email: formData.get("email") as string,
      password: formData.get("password") as string,
    });
  };

  if (status === "executing") {
    return <div>Loading...</div>;
  }

  if (result?.serverError) {
    return <div>Error: {result.serverError}</div>;
  }

  if (result?.data) {
    return <div>Logged in! Token: {result.data.token}</div>;
  }

  return (
    <form onSubmit={handleSubmit}>
      <input name="email" type="email" required />
      <input name="password" type="password" required />
      <button type="submit">Login</button>
    </form>
  );
}
```

## Environment Variables

Make sure you have these in your `.env.local`:

```env
# JWT
JWT_SECRET=your-secret-key-change-in-production
JWT_EXPIRES_IN=7d

# Logging
LOG_LEVEL=info
NODE_ENV=development

# Database
SUPABASE_DB_URL=your-database-url

# Email
RESEND_API_KEY=your-resend-api-key
RESEND_FROM_EMAIL=noreply@yourdomain.com
```

## Checking Logs

With structured logging, you'll see formatted logs in development:

```bash
npm run dev
```

Logs will appear in the console with:
- Timestamps
- Log levels (info, warn, error)
- Structured data (user IDs, emails, etc.)

Example log output:
```
[2024-01-01 10:00:00] INFO: Attempting login { email: "test@example.com" }
[2024-01-01 10:00:01] INFO: Login successful { email: "test@example.com", userId: 1 }
```

## Common Issues

### 1. "Invalid email or password"
- Check that the user exists in the database
- Verify password is hashed correctly
- Check password comparison logic

### 2. "No token provided"
- Make sure you're including the Authorization header
- Format: `Authorization: Bearer YOUR_TOKEN`

### 3. "Invalid or expired token"
- Token may have expired (default: 7 days)
- Check JWT_SECRET matches
- Regenerate token by logging in again

### 4. Database Connection Errors
- Verify SUPABASE_DB_URL is correct
- Check database is accessible
- Ensure SSL settings are correct

## Automated Testing

For more comprehensive testing, consider:

1. **Unit Tests**: Test services in isolation
2. **Integration Tests**: Test API routes end-to-end
3. **E2E Tests**: Test with Playwright or Cypress

Example test setup (using Jest):
```bash
npm install -D jest @testing-library/react @testing-library/jest-dom
```
