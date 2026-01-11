export interface UserResponse {
  id: number;
  role: Role;
  firstName?: string;
  lastName?: string;
  email: string;
  profileImageUrl?: string;
  connectedAccounts: ConnectedAccount[];
  authorities: string[];
  profileComplete?: boolean;
  universityId?: string; // For UNIVERSITY_ADMIN role
}

interface ConnectedAccount {
  provider: 'google' | 'github' | 'facebook' | 'okta' ;
  connectedAt: string;
}

export enum Role {
  USER = "USER",
  COMPANY = "COMPANY",
  ADMIN = "ADMIN",
  UNIVERSITY_ADMIN = "UNIVERSITY_ADMIN"
}