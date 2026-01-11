# Quick Start: Supabase Auth

## ⚡ 1. Start Your App

```bash
npm run dev
```

Visit `http://localhost:3000`

---

## 🔐 2. Test Login

### Admin Account
- Email: `admin@example.com`
- Password: `Password123`

Click "Sign In" → You'll be redirected to `/admin/dashboard`

---

## 📝 3. Test Signup

### As a Student
1. Click "Sign Up" on login page
2. Select "Student Registration"
3. Fill in email, password, full name
4. Click "Register"
5. You're automatically logged in

### As a Company
1. Click "Sign Up" on login page
2. Select "Company Registration"
3. Fill in email, password, company name
4. Click "Register"
5. You're automatically logged in

---

## 🛑 4. Logout

Click user menu → "Sign Out"  
You'll be redirected to `/auth/login?logout=success`

---

## 📱 5. Components Using New Auth

All components automatically use the new Supabase Auth:

```typescript
// Works exactly as before - no changes needed
import { useAuthGuard } from "@/lib/auth/use-auth";

export default function Page() {
  const { user, logout } = useAuthGuard({
    middleware: "auth", // Only authenticated users
  });

  return (
    <div>
      <h1>Welcome, {user?.fullName}</h1>
      <button onClick={logout}>Sign Out</button>
    </div>
  );
}
```

Or use the new hook directly:

```typescript
// Recommended for new components
import { useSupabaseAuth } from "@/lib/auth/supabase-auth";

export default function Page() {
  const { user, logout } = useSupabaseAuth({
    middleware: "auth",
  });

  return (
    <div>
      <h1>Welcome, {user?.fullName}</h1>
      <button onClick={logout}>Sign Out</button>
    </div>
  );
}
```

---

## ✅ What Works Now

- ✅ Login with email/password
- ✅ Signup (student/company)
- ✅ Logout
- ✅ Session persistence (refresh page)
- ✅ Protected pages (redirect to /auth/login)
- ✅ Role-based redirects (ADMIN → /admin, COMPANY → /company, etc.)

---

## 📚 Next Steps

### Password Reset
```typescript
const { resetPassword } = useSupabaseAuth();

const handleReset = async () => {
  await resetPassword("user@example.com");
  // Supabase sends password reset email
};
```

### Update Password
```typescript
const { updatePassword } = useSupabaseAuth();

const handleUpdate = async () => {
  await updatePassword("newPassword123");
};
```

### Add OAuth (Google, GitHub, etc.)
See `SUPABASE_AUTH_MIGRATION.md` → "Future Enhancements"

---

## 🐛 Troubleshooting

### "Login fails with 401"
- Check Supabase URL and anon key in `.env.local`
- Verify Email/Password provider enabled in Supabase console

### "Session doesn't persist"
- Check browser localStorage for `sb-*` keys
- Check browser console for errors

### "Email verification not working"
- Enable Email provider in Supabase Settings
- Configure email templates (optional)

See `SUPABASE_AUTH_MIGRATION.md` for full troubleshooting guide.

---

## 📖 Full Documentation

- **Migration Details**: `SUPABASE_AUTH_CHANGES.md`
- **Complete Guide**: `SUPABASE_AUTH_MIGRATION.md`
- **Original Docs**: `README.md`

---

## 🎉 You're All Set!

Your app now uses **Supabase Auth** for authentication.  
Everything is client-only, secure, and scalable.

**Happy coding!** 🚀
