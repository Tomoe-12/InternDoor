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
}

interface ConnectedAccount {
  provider: 'google' | 'github' | 'facebook' | 'okta' ;
  connectedAt: string;
}

export enum Role {
  USER = "USER",
  COMPANY = "COMPANY",
  ADMIN = "ADMIN"
}