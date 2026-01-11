# Migration to Supabase Auth (Client-Only)

This project has been migrated from custom JWT authentication to **Supabase Auth** for cleaner, more scalable authentication.

## What Changed

### Before (Custom JWT)
- User credentials: stored locally in database with bcrypt hash
- Login flow: `POST /api/auth/login` → returns JWT → stored in localStorage
- Session check: `GET /api/auth/me` with `Authorization: Bearer <token>` header
- Signup: Create user in students/companies table, hash password locally

### After (Supabase Auth)
- User credentials: managed by Supabase Auth service (separate from domain data)
- Login flow: `supabase.auth.signInWithPassword()` (client-side) → returns session
- Session check: `supabase.auth.getSession()` (client-side) → query domain tables
- Signup: Create Supabase auth user + corresponding domain row in one transaction

## Key Files

### Authentication Hook
- **`lib/auth/supabase-auth.ts`** ✨ NEW
  - `useSupabaseAuth()` hook for login, signup, logout, password reset
  - Automatically syncs Supabase auth session with domain tables (students/companies)
  - Returns user with both auth ID and domain data

- **`lib/auth/use-auth.ts`** (Deprecated)
  - Now just re-exports `useSupabaseAuth` for backward compatibility
  - Old components using `useAuthGuard()` still work without changes

### Signup
- **`server/services/supabase-auth.service.ts`** ✨ NEW
  - `SupabaseAuthService.registerStudent()`
  - `SupabaseAuthService.registerCompany()`
  - Creates both Supabase auth user AND domain row atomically
  - Handles rollback if domain row creation fails

- **`server/actions/auth.actions.ts`** (Updated)
  - `registerStudentAction()` now uses `SupabaseAuthService`
  - `registerCompanyAction()` now uses `SupabaseAuthService`

### API Routes (Optional, Can Keep or Remove)
- **`app/api/auth/login/route.ts`** - No longer needed (use `supabase.auth.signInWithPassword()`)
- **`app/api/auth/logout/route.ts`** - No longer needed (use `supabase.auth.signOut()`)
- **`app/api/auth/me/route.ts`** - No longer needed (query Supabase directly)

You can delete these routes once you've verified all components use the new `useSupabaseAuth` hook.

## Migration Steps (Already Done)

1. ✅ Created `lib/auth/supabase-auth.ts` with Supabase Auth integration
2. ✅ Created `server/services/supabase-auth.service.ts` for signup flow
3. ✅ Updated `server/actions/auth.actions.ts` to use new service
4. ✅ Updated `lib/auth/use-auth.ts` for backward compatibility

## How to Use

### Login
```typescript
import { useSupabaseAuth } from "@/lib/auth/supabase-auth";

export default function LoginPage() {
  const { login } = useSupabaseAuth();

  const handleLogin = async (email: string, password: string) => {
    try {
      const user = await login({
        props: { email, password },
        onError: (err) => console.error(err),
      });
      console.log("Logged in:", user);
    } catch (err) {
      console.error("Login failed:", err);
    }
  };

  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      handleLogin("user@example.com", "password123");
    }}>
      {/* form UI */}
    </form>
  );
}
```

### Signup
```typescript
import { useSupabaseAuth } from "@/lib/auth/supabase-auth";

export default function SignupPage() {
  const { signup } = useSupabaseAuth();

  const handleSignup = async () => {
    try {
      const result = await signup(
        "newuser@example.com",
        "password123"
      );
      console.log("Signup successful:", result);
    } catch (err) {
      console.error("Signup failed:", err);
    }
  };

  return <button onClick={handleSignup}>Sign Up</button>;
}
```

### Check Logged-In User
```typescript
import { useSupabaseAuth } from "@/lib/auth/supabase-auth";

export default function Dashboard() {
  const { user, isLoading } = useSupabaseAuth({
    middleware: "auth", // Redirects to /auth/login if not logged in
  });

  if (isLoading) return <div>Loading...</div>;

  return <h1>Welcome, {user?.fullName}!</h1>;
}
```

### Logout
```typescript
const { logout } = useSupabaseAuth();

const handleLogout = async () => {
  await logout();
  // Redirects to /auth/login?logout=success
};
```

## Environment Variables

Ensure `.env.local` has these Supabase variables:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

## Data Flow

### Login
1. User submits email/password
2. `useSupabaseAuth().login()` calls `supabase.auth.signInWithPassword()`
3. Supabase Auth validates and returns session
4. Hook queries `students` or `companies` table by email
5. Returns combined user object (auth + domain data)

### Session Persistence
1. Supabase Auth session persists in localStorage automatically
2. On page reload, `useSupabaseAuth()` calls `supabase.auth.getSession()`
3. If session exists, queries domain tables and populates user
4. If session expired, returns null and shows login page

## Security Notes

- **Anon key usage**: `NEXT_PUBLIC_SUPABASE_ANON_KEY` is safe for client-side (authenticated requests only)
- **RLS (Row-Level Security)**: Ensure students/companies tables have RLS policies:
  - Users can only read/write their own rows
  - Admins can read all rows
- **Email verification**: Supabase Auth handles confirmations; link tokens to `verification_token` if needed
- **Password reset**: Use `supabase.auth.resetPasswordForEmail()` for self-service password reset

## Future Enhancements

- Add OAuth providers (Google, GitHub, etc.) via `supabase.auth.signInWithOAuth()`
- Set up email templates in Supabase for password reset, signup confirmations
- Add MFA (multi-factor authentication) via Supabase Auth
- Use Supabase Realtime for live user status, notifications, etc.
- Query other Supabase tables client-side using `supabase.from('table').select()`

## Troubleshooting

### "Email not found in students or companies"
- Ensure signup created the domain row correctly
- Check `students` and `companies` tables in Supabase console
- Verify `email` and `companyEmail` fields match the login email

### "Session not persisted after reload"
- Check browser localStorage for `sb-*` keys (Supabase session)
- Verify `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are correct
- Check browser console for errors

### "Password reset not working"
- Enable Email provider in Supabase console (Settings → Auth → Providers)
- Configure email template in Supabase
- Test with a valid email address

## Deprecation Notice

The following custom JWT auth files are now **deprecated** but kept for reference:
- `app/api/auth/login/route.ts`
- `app/api/auth/logout/route.ts`
- `app/api/auth/me/route.ts`
- `server/services/auth.service.ts` (old login logic)

These can be deleted once all components migrate to `useSupabaseAuth`.
