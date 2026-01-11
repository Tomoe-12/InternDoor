# Routing Architecture Guide

## Current Route Structure ✅

Your project has a **well-organized route structure** using Next.js route groups:

```
app/
├── (admin)/admin/              ← ADMIN + UNIVERSITY_ADMIN (shared)
│   ├── layout.tsx              ← Guards: [Role.ADMIN, Role.UNIVERSITY_ADMIN]
│   ├── (dashboard)/
│   │   ├── dashboard/          ← Main dashboard
│   │   ├── universities/       ← University management
│   │   ├── students/           ← Student management
│   │   ├── companies/          ← Company management
│   │   └── settings/           ← Settings
│   └── notifications/
│
├── (company)/company/          ← COMPANY role only
│   ├── layout.tsx              ← Guard: [Role.COMPANY]
│   ├── (dashboard)/
│   └── onboarding/
│
├── student/                    ← USER/STUDENT role
│   ├── layout.tsx
│   └── page.tsx
│
└── (landing)/                  ← Public routes + auth
    ├── page.tsx                ← Landing page
    └── auth/                   ← Login/Register
```

## ✅ **Recommended Approach: Shared Routes with Role-Based Logic**

### **DON'T** create separate routes like:
```
❌ app/(admin)/admin/           ← For ADMIN
❌ app/(uni-admin)/uni-admin/   ← For UNIVERSITY_ADMIN (duplicate!)
❌ app/(company)/company/       ← For COMPANY
```

### **DO** share routes and differentiate with:
1. **Conditional rendering** based on role
2. **Data filtering** on backend by universityId
3. **Role utility functions** to show/hide features

---

## Implementation Patterns

### Pattern 1: Conditional Rendering in Components

```tsx
// components/common/allUniversity.tsx
'use client'
import { useAuthGuard } from "@/lib/auth/use-auth";
import { isSuperAdmin, isUniversityAdmin } from "@/lib/auth/role-utils";
import { Role } from "@/models/user/UserResponse";

export function AllUniversity() {
  const { user } = useAuthGuard({ middleware: "auth" });
  
  // Filter universities based on role
  const visibleUniversities = React.useMemo(() => {
    if (isSuperAdmin(user)) {
      // Super admin sees ALL universities
      return allUniversities;
    }
    
    if (isUniversityAdmin(user) && user?.universityId) {
      // University admin sees ONLY their university
      return allUniversities.filter(uni => uni.id === user.universityId);
    }
    
    return [];
  }, [user, allUniversities]);

  return (
    <div>
      <div className="flex justify-between items-center">
        <h1>Universities</h1>
        
        {/* Only super admin can add new universities */}
        {isSuperAdmin(user) && (
          <Button>
            <Plus className="mr-2" />
            Add University
          </Button>
        )}
      </div>
      
      <div className="grid gap-4">
        {visibleUniversities.map(uni => (
          <UniversityCard key={uni.id} university={uni} />
        ))}
      </div>
    </div>
  );
}
```

### Pattern 2: Backend Data Filtering

```typescript
// app/api/universities/route.ts
import { getUserUniversityScope } from "@/lib/auth/role-utils";
import { getCurrentUser } from "@/lib/auth/session";

export async function GET(request: Request) {
  const user = await getCurrentUser();
  const universityScope = getUserUniversityScope(user);
  
  let query = db.select().from(universities);
  
  // If universityScope is null → super admin (see all)
  // If universityScope is array → university admin (filter)
  if (universityScope !== null && universityScope.length > 0) {
    query = query.where(inArray(universities.id, universityScope));
  }
  
  const results = await query;
  return Response.json(results);
}
```

### Pattern 3: Service Layer Filtering

```typescript
// server/services/student.service.ts
import { UserResponse, Role } from "@/models/user/UserResponse";
import { hasUniversityAccess } from "@/lib/auth/role-utils";

export class StudentService {
  static async getStudents(
    user: UserResponse,
    params: GetStudentsInput
  ) {
    let query = db.select().from(students);
    
    // University admin can only see their university's students
    if (user.role === Role.UNIVERSITY_ADMIN && user.universityId) {
      query = query.where(eq(students.universityId, user.universityId));
    }
    
    // Super admin sees all students (no filter)
    
    return await query.limit(params.size).offset(params.offset);
  }
  
  static async updateStudent(
    user: UserResponse,
    id: number,
    data: UpdateStudentInput
  ) {
    // Check access before updating
    const [student] = await db.select().from(students).where(eq(students.id, id));
    
    if (!student) {
      throw new Error("Student not found");
    }
    
    // Verify university admin has access to this student
    if (user.role === Role.UNIVERSITY_ADMIN) {
      if (!hasUniversityAccess(user, student.universityId)) {
        throw new Error("Access denied: You can only manage students from your university");
      }
    }
    
    // Proceed with update...
  }
}
```

### Pattern 4: UI Component Variations

```tsx
// components/Admin/sidebar.tsx
'use client'
import { useAuthGuard } from "@/lib/auth/use-auth";
import { isSuperAdmin } from "@/lib/auth/role-utils";

export function AdminSidebar() {
  const { user } = useAuthGuard({ middleware: "auth" });
  
  const menuItems = [
    { 
      label: "Dashboard", 
      href: "/admin/dashboard", 
      icon: LayoutDashboard,
      roles: ["ADMIN", "UNIVERSITY_ADMIN"] // Both can see
    },
    { 
      label: "Universities", 
      href: "/admin/universities",
      icon: School,
      roles: ["ADMIN", "UNIVERSITY_ADMIN"] // Both can see (but filtered differently)
    },
    { 
      label: "Students", 
      href: "/admin/students",
      icon: Users,
      roles: ["ADMIN", "UNIVERSITY_ADMIN"] // Both can see (but filtered differently)
    },
    { 
      label: "Companies", 
      href: "/admin/companies",
      icon: Building,
      roles: ["ADMIN"] // ONLY super admin
    },
    { 
      label: "System Settings", 
      href: "/admin/settings/system",
      icon: Settings,
      roles: ["ADMIN"] // ONLY super admin
    },
  ];
  
  // Filter menu items based on user role
  const visibleItems = menuItems.filter(item => 
    item.roles.includes(user?.role as string)
  );
  
  return (
    <nav>
      {visibleItems.map(item => (
        <NavLink key={item.href} {...item} />
      ))}
    </nav>
  );
}
```

---

## When to Use Separate Routes vs Shared Routes

### ✅ **Use SHARED routes when:**
- Same UI structure but different data scope
- Similar workflows with permission variations
- Same page layout with role-based feature toggling

**Example:** `/admin/students` for both ADMIN and UNIVERSITY_ADMIN
- Super admin sees ALL students
- University admin sees ONLY their university's students
- Same UI, different data

### ⚠️ **Use SEPARATE routes when:**
- Completely different UI/UX between roles
- Different navigation flows
- No overlap in functionality

**Example:** `/company` vs `/admin`
- Different layouts
- Different features entirely
- Different user journeys

---

## Migration Path for Your Project

Your current structure is already good! Here's what to do:

### 1. **Keep the shared `/admin` routes** ✅
```tsx
// app/(admin)/admin/layout.tsx
<RoleGuard rolesAllowed={[Role.ADMIN, Role.UNIVERSITY_ADMIN]}>
  {children}
</RoleGuard>
```

### 2. **Update components to filter by role**
```tsx
// Each component should check user role and filter accordingly
const { user } = useAuthGuard({ middleware: "auth" });

if (isSuperAdmin(user)) {
  // Show everything
} else if (isUniversityAdmin(user)) {
  // Show only their university's data
}
```

### 3. **Update API routes to scope data**
```typescript
// All API routes should filter based on user.universityId
if (user.role === Role.UNIVERSITY_ADMIN) {
  query.where(eq(table.universityId, user.universityId));
}
```

### 4. **Add role-based UI variations**
- Hide "Add University" button for university admins
- Hide "System Settings" menu for university admins
- Show university selector for super admins
- Auto-set university context for university admins

---

## Route Guard Examples

### Admin Layout (Shared)
```tsx
// app/(admin)/admin/layout.tsx
import { Role } from "@/models/user/UserResponse";

export default function AdminLayout({ children }) {
  return (
    <RoleGuard rolesAllowed={[Role.ADMIN, Role.UNIVERSITY_ADMIN]}>
      <AdminSidebar /> {/* Shows different menus based on role */}
      <main>{children}</main>
    </RoleGuard>
  );
}
```

### Company Layout (Separate)
```tsx
// app/(company)/company/layout.tsx
export default function CompanyLayout({ children }) {
  return (
    <RoleGuard rolesAllowed={[Role.COMPANY]}>
      <CompanySidebar />
      <main>{children}</main>
    </RoleGuard>
  );
}
```

### Student Routes (Separate)
```tsx
// app/student/layout.tsx
export default function StudentLayout({ children }) {
  return (
    <RoleGuard rolesAllowed={[Role.USER]}>
      {children}
    </RoleGuard>
  );
}
```

---

## Summary

### Your Current Structure is Good! ✅

Keep it as:
- **(admin)** → Shared by ADMIN + UNIVERSITY_ADMIN
- **(company)** → COMPANY only
- **student** → USER/STUDENT only
- **(landing)** → Public + Auth

### Key Implementation Points:

1. ✅ Share routes between similar roles
2. ✅ Use role utilities to filter data
3. ✅ Conditional rendering for role-specific features
4. ✅ Backend validation on every data access
5. ✅ Clear separation for completely different user types

### Don't Do:
- ❌ Create duplicate routes for each admin type
- ❌ Check role only on frontend (always validate backend)
- ❌ Mix company/student logic in admin routes

This approach keeps your codebase maintainable while providing proper role-based access control!
