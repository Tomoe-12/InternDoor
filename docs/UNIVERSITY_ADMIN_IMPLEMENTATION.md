# University Admin Role Implementation

## Overview
This project now supports a two-tier admin system:
- **ADMIN** (Super Admin) - Full system access
- **UNIVERSITY_ADMIN** - Limited to managing their specific university

## Changes Made

### 1. **Role Enum Updated**
- Added `UNIVERSITY_ADMIN` to the `Role` enum in `models/user/UserResponse.ts`
- Added `universityId` field to `UserResponse` interface

### 2. **Database Schema Updates**
- **profiles table**: Added `university_id` field to link university admins to their university
- **students table**: Added `university_id` field to track which university a user manages
- Migration file: `drizzle/0004_add_university_admin_role.sql`

### 3. **Authentication Updates**
- Updated `AuthService` to include `universityId` in login responses
- Updated login/register routing to handle `UNIVERSITY_ADMIN` role
- University admins are redirected to `/admin/universities` after login

### 4. **Authorization Updates**
- Updated admin layout to allow both `ADMIN` and `UNIVERSITY_ADMIN` roles
- Created utility functions in `lib/auth/role-utils.ts` for role-based access control

### 5. **Schema Validation**
- Updated `createStudentSchema` to support `UNIVERSITY_ADMIN` role
- Added optional `universityId` field for university admin creation

## Role-Based Access Control Utilities

Use the helper functions from `lib/auth/role-utils.ts`:

```typescript
import { 
  isSuperAdmin, 
  isUniversityAdmin, 
  hasUniversityAccess,
  getUserUniversityScope,
  filterByUniversityAccess 
} from "@/lib/auth/role-utils";

// Check if user is super admin
if (isSuperAdmin(user)) {
  // Show all data
}

// Check if university admin has access to specific university
if (hasUniversityAccess(user, universityId)) {
  // Allow access
}

// Filter data based on user's university access
const filteredData = filterByUniversityAccess(user, allData);
```

## Implementation Guide

### Creating a University Admin

When creating a university admin, set both `role` and `universityId`:

```typescript
await StudentService.createStudent({
  email: "admin@university.edu",
  password: "SecurePassword123",
  passwordConfirmation: "SecurePassword123",
  fullName: "University Admin",
  role: "UNIVERSITY_ADMIN",
  universityId: "university-123", // Important!
  status: "Active"
});
```

### Protecting Routes

Use role guards in layouts or pages:

```tsx
import { Role } from "@/models/user/UserResponse";
import RoleGuard from "@/components/auth/role-guard";

// Allow both admin types
<RoleGuard rolesAllowed={[Role.ADMIN, Role.UNIVERSITY_ADMIN]}>
  {children}
</RoleGuard>
```

### Filtering Data by University

For API endpoints and services, filter data based on the user's university access:

```typescript
import { hasUniversityAccess } from "@/lib/auth/role-utils";

// In your API handler or service
export async function getStudents(user: UserResponse, universityId?: string) {
  // Build query
  let query = db.select().from(students);
  
  // If user is university admin, only show their university's students
  if (user.role === Role.UNIVERSITY_ADMIN) {
    if (universityId && !hasUniversityAccess(user, universityId)) {
      throw new Error("Access denied to this university");
    }
    query = query.where(eq(students.universityId, user.universityId));
  }
  
  // Super admins see all students
  return await query;
}
```

## Database Migration

Run the migration to add the new fields:

```bash
npm run db:push
# or if using drizzle-kit directly
npx drizzle-kit push:pg
```

## Next Steps

### Recommended Enhancements:

1. **Update Student/Company Services**
   - Add university-based filtering to `StudentService.getStudents()`
   - Ensure university admins can only modify students in their university

2. **Update UI Components**
   - Add university selector for super admins
   - Hide university selector for university admins (they only see their university)

3. **Update Admin Dashboard**
   - Show different views based on user role
   - Add analytics scoped to university for university admins

4. **Update RLS Policies**
   - Update Row Level Security policies in `scripts/enable-rls.js`
   - Add policies that check both role and universityId

5. **Add University Admin Creation UI**
   - Create a form for super admins to create university admin accounts
   - Include university selector in the form

## Example: Scoping API Endpoints

```typescript
// app/api/students/route.ts
import { getUserUniversityScope } from "@/lib/auth/role-utils";

export async function GET(request: Request) {
  const user = await getCurrentUser(); // Your auth logic
  const universityScope = getUserUniversityScope(user);
  
  // If universityScope is null, user is super admin (access all)
  // If universityScope is an array, filter by those universities
  
  let query = db.select().from(students);
  
  if (universityScope !== null) {
    // Filter to only accessible universities
    query = query.where(inArray(students.universityId, universityScope));
  }
  
  const results = await query;
  return Response.json(results);
}
```

## Security Considerations

1. Always validate `universityId` against the user's access rights
2. Never trust client-side role checks alone - always validate on the server
3. Use the utility functions consistently across the application
4. Implement proper Row Level Security (RLS) policies in the database
5. Log access attempts for audit trails

## Testing

Test the following scenarios:
- Super admin can access all universities
- University admin can only access their assigned university
- University admin cannot access other universities' data
- Role-based redirects work correctly after login
- University admin cannot escalate their privileges
