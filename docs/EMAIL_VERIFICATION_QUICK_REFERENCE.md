# 📋 Email Verification - Quick Reference

## **Your Requirements** ✅

| Aspect | Details |
|--------|---------|
| **Token Expiry** | 1 hour |
| **For Roles** | Students & Companies |
| **If token expired on login** | AUTO-RESEND + "Email resent!" |
| **If token valid on login** | REMIND + "Please verify email" |

---

## **Three Login States**

### **STATE 1: ✅ Email Already Verified**
```
User can login normally
Full platform access
```

### **STATE 2: ⏳ Token Still Valid (within 1 hour)**
```
User tries to login
❌ Blocked from login
ℹ️ Message: "Please verify your email. Link expires in X minutes."
📧 Don't resend (they already have it)
```

### **STATE 3: ✉️ Token Expired (after 1 hour)**
```
User tries to login
❌ Blocked from login
✅ AUTO-RESEND verification email
ℹ️ Message: "Email resent! Check your inbox and verify."
⏰ New token = 1 hour from now
```

---

## **Data Flow**

```
REGISTRATION
  ├─ Create users table (emailVerified=false)
  ├─ Create profiles table
  ├─ Create students/companies table
  ├─ Generate token (expires in 1 hour)
  └─ Send verification email

BEFORE EMAIL VERIFICATION
  ├─ ❌ Cannot login
  ├─ ✅ Account exists in DB (3 tables)
  └─ ⏳ Token countdown (1 hour)

IF LOGIN ATTEMPTED BEFORE VERIFICATION
  ├─ STATE 2 (token valid): Show "verify email" message
  └─ STATE 3 (token expired): Auto-resend + show "resent" message

AFTER EMAIL VERIFICATION
  ├─ emailVerified = true
  ├─ ✅ Can login
  └─ 🎉 Full platform access
```

---

## **API Response Format**

### **Success (Email Verified)**
```json
{
  "success": true,
  "token": "eyJhbGc...",
  "user": { "id": 1, "email": "john@example.com" },
  "requiresEmailVerification": false
}
```

### **STATE 2 (Token Valid - Remind)**
```json
{
  "success": false,
  "requiresEmailVerification": true,
  "verificationStatus": "pending",
  "verificationMessage": "Please verify your email. Your verification link expires in 45 minutes.",
  "message": "Please verify your email before logging in."
}
```

### **STATE 3 (Token Expired - Auto-Resent)**
```json
{
  "success": false,
  "requiresEmailVerification": true,
  "verificationStatus": "expired",
  "verificationMessage": "Your verification link expired. We've resent it to your email. Please check your inbox.",
  "expiresAt": "2026-01-09T14:00:00Z",
  "message": "Please verify your email. New verification email has been sent."
}
```

---

## **Frontend Toast Messages**

### **STATE 2: Token Valid**
```
🔔 Type: Warning
📝 Title: "⏳ Please Verify Your Email"
📖 Body: "Your verification link expires in 45 minutes. Check your inbox."
```

### **STATE 3: Token Expired (Auto-Resent)**
```
🔔 Type: Info
📝 Title: "✉️ Email Resent!"
📖 Body: "Your verification link expired. We've resent it to your email. Check your inbox."
```

---

## **Implementation Checklist**

- [x] Created `EmailVerificationService`
- [x] Created `loginWithVerificationService`
- [x] Updated API endpoint `/api/auth/login`
- [x] Created frontend component example
- [x] Set token expiry to 1 hour
- [x] Implemented STATE 2 (remind)
- [x] Implemented STATE 3 (auto-resend)
- [ ] Update your existing login form to use new response
- [ ] Test all 3 scenarios
- [ ] Deploy

---

## **Testing the Three States**

### **Test STATE 1 (Email Verified)**
```
1. Register user
2. Manually verify email in DB: UPDATE users SET emailVerified=true
3. Try to login
4. Should succeed ✅
```

### **Test STATE 2 (Token Valid)**
```
1. Register user (token valid)
2. Try to login WITHOUT clicking email
3. Within 1 hour: Should see "verify email" message ⏳
4. Should NOT auto-resend
```

### **Test STATE 3 (Token Expired)**
```
1. Register user
2. Wait 1 hour (or manually set expiry to past date)
3. Try to login
4. Should see "email resent" message ✉️
5. Check email: Should have NEW verification email
6. Token should be different than original
```

---

## **Key Files**

| File | Purpose |
|------|---------|
| `server/services/email-verification.service.ts` | Core verification logic |
| `app/api/auth/login/route.ts` | Login endpoint with verification check |
| `app/(landing)/auth/login/components/login-form-with-verification.tsx` | Frontend example |
| `docs/EMAIL_VERIFICATION_FLOW.md` | Full detailed guide |

---

## **Common Questions**

**Q: Does data get deleted if token expires?**
A: No! Account stays in database. Only token needs renewal.

**Q: What if user loses access to email?**
A: They can request new email manually using "Resend" button (or automatic on login if expired).

**Q: Can I change 1 hour to 24 hours?**
A: Yes! Change `VERIFICATION_TOKEN_EXPIRY_MINUTES = 60` to `1440` (24 hours).

**Q: Does this apply to students AND companies?**
A: Yes! Both get the same verification flow.

**Q: What if company email is company@business.com but they use personal gmail?**
A: They use whatever email they registered with. Email verification only checks the registration email.

---

## **Summary**

✅ **Your approach is correct and better than standard implementations**

✅ **Three clear states implemented**

✅ **Auto-resend removes friction**

✅ **Ready to use in your project**

🚀 **Just update your login form to handle the new response structure!**
