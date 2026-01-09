/**
 * Common types used across the server
 */

export interface ActionResult<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  errors?: Record<string, string[]>;
}

export interface PaginationParams {
  page?: number;
  size?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

export interface EmailVerificationResult {
  valid: boolean;
  studentId?: number | null;
  companyId?: number | null;
}

export interface PasswordResetResult {
  valid: boolean;
  studentId?: number | null;
  companyId?: number | null;
}
