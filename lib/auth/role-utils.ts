import { UserResponse, Role } from "@/models/user/UserResponse";

/**
 * Utility functions for role-based authorization
 */

/**
 * Check if user is a super admin (has access to everything)
 */
export function isSuperAdmin(user: UserResponse | null | undefined): boolean {
  return user?.role === Role.ADMIN;
}

/**
 * Check if user is a university admin
 */
export function isUniversityAdmin(user: UserResponse | null | undefined): boolean {
  return user?.role === Role.UNIVERSITY_ADMIN;
}

/**
 * Check if user is any type of admin (super admin or university admin)
 */
export function isAnyAdmin(user: UserResponse | null | undefined): boolean {
  return isSuperAdmin(user) || isUniversityAdmin(user);
}

/**
 * Check if university admin has access to specific university
 * Super admins always have access to all universities
 */
export function hasUniversityAccess(
  user: UserResponse | null | undefined,
  universityId: string
): boolean {
  if (!user) return false;
  
  // Super admins have access to all universities
  if (isSuperAdmin(user)) return true;
  
  // University admins only have access to their assigned university
  if (isUniversityAdmin(user)) {
    return user.universityId === universityId;
  }
  
  return false;
}

/**
 * Get the university IDs that the user has access to
 * Super admin returns null (meaning all universities)
 * University admin returns their specific university ID
 */
export function getUserUniversityScope(
  user: UserResponse | null | undefined
): string[] | null {
  if (!user) return [];
  
  // Super admin has access to all universities
  if (isSuperAdmin(user)) return null;
  
  // University admin has access to their specific university
  if (isUniversityAdmin(user) && user.universityId) {
    return [user.universityId];
  }
  
  return [];
}

/**
 * Filter data based on university access
 * Returns all data for super admin, filtered data for university admin
 */
export function filterByUniversityAccess<T extends { universityId?: string | null }>(
  user: UserResponse | null | undefined,
  data: T[]
): T[] {
  if (!user) return [];
  
  // Super admin sees everything
  if (isSuperAdmin(user)) return data;
  
  // University admin only sees their university's data
  if (isUniversityAdmin(user) && user.universityId) {
    return data.filter(item => item.universityId === user.universityId);
  }
  
  return [];
}
