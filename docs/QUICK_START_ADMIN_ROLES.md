# Two-Tier Admin System - Quick Start Guide

## 🎯 You Asked:
1. ✅ **"I have only built for the super admin"** - That's fine! You can now extend it.
2. ✅ **"Do I need separate routes for each role?"** - NO! Keep your current structure.

---

## ✅ Your Current Route Structure is GOOD!

```
app/
├── (admin)/admin/          ← Keep this for BOTH admin types
├── (company)/company/      ← Keep this for companies
├── student/                ← Keep this for students  
└── (landing)/              ← Keep this for public pages
```

**DON'T create** `/uni-admin/` routes - that's duplication!

---

## 🚀 How to Implement University Admin Support

### Step 1: Database Migration
Run this to add the new fields:

```bash
npm run db:push
```

This applies the migration in `drizzle/0004_add_university_admin_role.sql`

### Step 2: Update Components to Use Role Utils

**Before (only super admin):**
```tsx
{user?.role === "ADMIN" && (
  <Button>Add University</Button>
)}
```

**After (both admin types with proper filtering):**
```tsx
import { isSuperAdmin, isUniversityAdmin } from "@/lib/auth/role-utils";

// Show button only for super admin
{isSuperAdmin(user) && (
  <Button>Add University</Button>
)}

// Filter data based on role
const visibleUniversities = useMemo(() => {
  if (isSuperAdmin(user)) {
    return allUniversities; // Super admin sees all
  }
  
  if (isUniversityAdmin(user) && user?.universityId) {
    return allUniversities.filter(u => u.id === user.universityId); // Uni admin sees only theirs
  }
  
  return [];
}, [user]);
```

### Step 3: Update Services to Filter Data

See the example in `server/services/examples/student.service.role-scoped.ts`

**Key pattern:**
```typescript
static async getStudents(user: UserResponse) {
  let query = db.select().from(students);
  
  // Filter for university admin
  if (user.role === Role.UNIVERSITY_ADMIN && user.universityId) {
    query = query.where(eq(students.universityId, user.universityId));
  }
  
  // Super admin gets no filter - sees everything
  
  return await query;
}
```

### Step 4: Update Existing Student Service

Apply the same pattern to your actual `StudentService`:

```typescript
// server/services/student.service.ts
import { UserResponse, Role } from "@/models/user/UserResponse";

export class StudentService {
  static async getStudents(
    user: UserResponse, // Add user parameter
    params: GetStudentsInput
  ): Promise<PaginatedResponse<typeof students.$inferSelect>> {
    const { page = 1, size = DEFAULT_PAGE_SIZE } = params;
    const offset = (page - 1) * size;

    let query = db.select().from(students);
    
    // Add role-based filtering
    if (user.role === Role.UNIVERSITY_ADMIN && user.universityId) {
      query = query.where(eq(students.universityId, user.universityId));
    }

    const [data, totalResult] = await Promise.all([
      query.limit(size).offset(offset),
      db.select({ count: count() }).from(students),
    ]);

    return {
      data,
      total: totalResult[0].count,
      page,
      size,
    };
  }
}
```

---

## 📋 Quick Implementation Checklist

### Already Done ✅
- [x] Added `UNIVERSITY_ADMIN` role to enum
- [x] Added `universityId` fields to schemas
- [x] Created migration file
- [x] Updated auth service
- [x] Updated login routing
- [x] Updated admin layout guards
- [x] Created role utility functions

### You Need to Do 📝

1. **Run Database Migration**
   ```bash
   npm run db:push
   ```

2. **Update AllUniversity Component** (Already done!)
   - Uses `isSuperAdmin()` and `isUniversityAdmin()`
   - Filters universities based on role

3. **Update Student Service**
   - Add `user: UserResponse` parameter to methods
   - Add filtering logic like the example

4. **Update API Routes**
   - Get current user from session
   - Pass user to service methods
   - Services will auto-filter based on role

5. **Update Other Components**
   - Student lists
   - Company lists (super admin only?)
   - Dashboard stats
   - Add conditional UI elements

6. **Create University Admin Accounts**
   ```typescript
   // Use your existing creation method
   await StudentService.createStudent({
     email: "admin@stanford.edu",
     password: "SecurePass123",
     fullName: "Stanford Admin",
     role: "UNIVERSITY_ADMIN",
     universityId: "stanford", // Important!
     // ... other fields
   });
   ```

---

## 🎨 UI Patterns

### Pattern 1: Conditional Buttons
```tsx
import { isSuperAdmin } from "@/lib/auth/role-utils";

{isSuperAdmin(user) && (
  <Button>Add New University</Button>
)}
```

### Pattern 2: Filtered Lists
```tsx
import { isUniversityAdmin } from "@/lib/auth/role-utils";

const visibleData = useMemo(() => {
  if (isSuperAdmin(user)) return allData;
  if (isUniversityAdmin(user)) {
    return allData.filter(item => item.universityId === user.universityId);
  }
  return [];
}, [user, allData]);
```

### Pattern 3: Different Messages
```tsx
<p className="text-muted-foreground">
  {isSuperAdmin(user) 
    ? "Manage all universities in the system"
    : "Manage your university"}
</p>
```

### Pattern 4: Access Verification
```tsx
import { hasUniversityAccess } from "@/lib/auth/role-utils";

function handleEdit(universityId: string) {
  if (!hasUniversityAccess(user, universityId)) {
    toast.error("You don't have access to this university");
    return;
  }
  // Proceed with edit
}
```

---

## 🔒 Security Best Practices

1. **Always Validate on Server**
   - Never trust client-side role checks alone
   - Always filter data in services/APIs

2. **Check Access Before Modifications**
   - Verify university access before UPDATE/DELETE
   - Prevent university admins from accessing other universities

3. **Use Utility Functions Consistently**
   ```typescript
   // Import these everywhere
   import { 
     isSuperAdmin, 
     isUniversityAdmin,
     hasUniversityAccess 
   } from "@/lib/auth/role-utils";
   ```

4. **Pass User Context**
   - Always pass `user` to service methods
   - Let services handle filtering logic

---

## 📚 Key Files to Reference

| File | Purpose |
|------|---------|
| `lib/auth/role-utils.ts` | Role checking utility functions |
| `models/user/UserResponse.ts` | Role enum and user interface |
| `server/services/examples/student.service.role-scoped.ts` | Example scoped service |
| `components/common/allUniversity.tsx` | Example role-filtered component |
| `docs/ROUTING_ARCHITECTURE.md` | Full routing guide |
| `docs/UNIVERSITY_ADMIN_IMPLEMENTATION.md` | Detailed implementation guide |

---

## 🎯 Summary

### Your Route Structure ✅
**Keep it as is!** It's already well-organized:
- `/admin/*` - Shared by both admin types (with different data scopes)
- `/company/*` - Company users only
- `/student/*` - Student users only

### Implementation Pattern 🎨
1. **Shared routes** for similar roles
2. **Filtered data** based on role
3. **Conditional UI** for role-specific features
4. **Server-side validation** always

### Don't Do ❌
- Create separate `/uni-admin` routes
- Duplicate admin UI for each role
- Trust client-side role checks alone
- Forget to pass `user` to services

### Do ✅
- Use role utility functions
- Filter data in services
- Show/hide features conditionally
- Validate access on every operation

---

## 🚀 Next Actions

1. Run `npm run db:push`
2. Update your `StudentService` with user filtering
3. Update API routes to pass `user` to services
4. Test with both admin types
5. Create a university admin account to test

Need help with any specific part? Check the detailed guides in the `docs/` folder!
