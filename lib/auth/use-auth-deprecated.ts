/**
 * DEPRECATED: Use useSupabaseAuth from lib/auth/supabase-auth.ts instead
 * This file is kept for backward compatibility only.
 * All new components should import useSupabaseAuth directly.
 */

import { useSupabaseAuth } from "./supabase-auth";
import type { AuthProps } from "./supabase-auth";

// Re-export the new hook with the old name for backward compatibility
export const useAuthGuard = (props?: AuthProps) => {
  return useSupabaseAuth(props);
};
