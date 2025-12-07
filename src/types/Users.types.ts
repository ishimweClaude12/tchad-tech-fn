// ============================================================================
// Main Response Interfaces
// ============================================================================

export interface UserListResponse {
  success: boolean;
  message: string;
  data: {
    users: User[];
    meta: PaginationMeta;
  };
}

// ============================================================================
// User & Role Interfaces
// ============================================================================

export const UserRole = {
  STUDENT: "STUDENT",
  ADMIN: "ADMIN",
  SUPPER_ADMIN: "SUPPER_ADMIN",
} as const;

export type UserRole = (typeof UserRole)[keyof typeof UserRole];

export interface User {
  id: string;
  userId: string;
  role: UserRole;
  clerkProfile: ClerkProfile;
}

// ============================================================================
// Clerk Profile Interfaces
// ============================================================================

export interface ClerkProfile {
  id: string;
  passwordEnabled: boolean;
  totpEnabled: boolean;
  backupCodeEnabled: boolean;
  twoFactorEnabled: boolean;
  banned: boolean;
  locked: boolean;
  createdAt: number;
  updatedAt: number;
  imageUrl: string;
  hasImage: boolean;
  primaryEmailAddressId: string | null;
  primaryPhoneNumberId: string | null;
  primaryWeb3WalletId: string | null;
  lastSignInAt: number;
  externalId: string | null;
  username: string;
  firstName: string;
  lastName: string;
  publicMetadata: Record<string, any>;
  privateMetadata: Record<string, any>;
  unsafeMetadata: Record<string, any>;
  emailAddresses: EmailAddress[];
  phoneNumbers: PhoneNumber[];
  web3Wallets: Web3Wallet[];
  externalAccounts: ExternalAccount[];
  samlAccounts: SamlAccount[];
  lastActiveAt: number;
  createOrganizationEnabled: boolean;
  createOrganizationsLimit: number | null;
  deleteSelfEnabled: boolean;
  legalAcceptedAt: number | null;
  _raw: ClerkRawProfile;
}

// ============================================================================
// Email Address Interfaces
// ============================================================================

export interface EmailAddress {
  id: string;
  emailAddress: string;
  verification: EmailVerification;
  linkedTo: LinkedAccount[];
}

export interface EmailVerification {
  status: "verified" | "unverified" | "pending";
  strategy: "email_code" | "from_oauth_google" | "email_link" | string;
  externalVerificationRedirectURL: string | null;
  attempts: number | null;
  expireAt: number | null;
  nonce: string | null;
  message: string | null;
}

export interface LinkedAccount {
  id: string;
  type: "oauth_google" | "oauth_github" | string;
}

// ============================================================================
// Phone Number Interfaces
// ============================================================================

export interface PhoneNumber {
  id: string;
  phoneNumber: string;
  verification: PhoneVerification;
  linkedTo: LinkedAccount[];
}

export interface PhoneVerification {
  status: "verified" | "unverified" | "pending";
  strategy: "phone_code" | string;
  externalVerificationRedirectURL: string | null;
  attempts: number | null;
  expireAt: number | null;
  nonce: string | null;
  message: string | null;
}

// ============================================================================
// Web3 Wallet Interfaces
// ============================================================================

export interface Web3Wallet {
  id: string;
  web3Wallet: string;
  verification: Web3Verification;
}

export interface Web3Verification {
  status: "verified" | "unverified" | "pending";
  strategy: string;
  nonce: string | null;
  message: string | null;
}

// ============================================================================
// External Account Interfaces
// ============================================================================

export interface ExternalAccount {
  id: string;
  provider: "oauth_google" | "oauth_github" | "oauth_facebook" | string;
  identificationId: string;
  externalId: string;
  approvedScopes: string;
  emailAddress: string;
  firstName: string;
  lastName: string;
  imageUrl: string;
  username: string;
  publicMetadata: Record<string, any>;
  label: string | null;
  verification: ExternalAccountVerification;
}

export interface ExternalAccountVerification {
  status: "verified" | "unverified";
  strategy: "oauth_google" | "oauth_github" | string;
  externalVerificationRedirectURL: string | null;
  attempts: number | null;
  expireAt: number;
  nonce: string | null;
  message: string | null;
}

// ============================================================================
// SAML Account Interfaces
// ============================================================================

export interface SamlAccount {
  id: string;
  provider: string;
  providerUserId: string;
  emailAddress: string;
  firstName: string;
  lastName: string;
  verification: SamlVerification;
}

export interface SamlVerification {
  status: "verified" | "unverified";
  strategy: string;
  externalVerificationRedirectURL: string | null;
  attempts: number | null;
  expireAt: number | null;
  nonce: string | null;
  message: string | null;
}

// ============================================================================
// Clerk Raw Profile (from _raw field)
// ============================================================================

export interface ClerkRawProfile {
  id: string;
  object: "user";
  username: string;
  first_name: string;
  last_name: string;
  locale: string | null;
  image_url: string;
  has_image: boolean;
  primary_email_address_id: string | null;
  primary_phone_number_id: string | null;
  primary_web3_wallet_id: string | null;
  password_enabled: boolean;
  two_factor_enabled: boolean;
  totp_enabled: boolean;
  backup_code_enabled: boolean;
  email_addresses: ClerkRawEmailAddress[];
  phone_numbers: ClerkRawPhoneNumber[];
  web3_wallets: ClerkRawWeb3Wallet[];
  passkeys: ClerkRawPasskey[];
  external_accounts: ClerkRawExternalAccount[];
  saml_accounts: ClerkRawSamlAccount[];
  enterprise_accounts: ClerkRawEnterpriseAccount[];
  password_last_updated_at: number | null;
  public_metadata: Record<string, any>;
  private_metadata: Record<string, any>;
  unsafe_metadata: Record<string, any>;
  external_id: string | null;
  last_sign_in_at: number;
  banned: boolean;
  locked: boolean;
  lockout_expires_in_seconds: number | null;
  verification_attempts_remaining: number;
  created_at: number;
  updated_at: number;
  delete_self_enabled: boolean;
  create_organization_enabled: boolean;
  last_active_at: number;
  mfa_enabled_at: number | null;
  mfa_disabled_at: number | null;
  legal_accepted_at: number | null;
  profile_image_url: string;
}

export interface ClerkRawEmailAddress {
  id: string;
  object: "email_address";
  email_address: string;
  reserved: boolean;
  verification: ClerkRawVerification;
  linked_to: ClerkRawLinkedAccount[];
  matches_sso_connection: boolean;
  created_at: number;
  updated_at: number;
}

export interface ClerkRawPhoneNumber {
  id: string;
  object: "phone_number";
  phone_number: string;
  reserved: boolean;
  verification: ClerkRawVerification;
  linked_to: ClerkRawLinkedAccount[];
  created_at: number;
  updated_at: number;
}

export interface ClerkRawWeb3Wallet {
  id: string;
  object: "web3_wallet";
  web3_wallet: string;
  verification: ClerkRawVerification;
  created_at: number;
  updated_at: number;
}

export interface ClerkRawPasskey {
  id: string;
  object: "passkey";
  name: string;
  verification: ClerkRawVerification;
  created_at: number;
  updated_at: number;
}

export interface ClerkRawExternalAccount {
  object: "google_account" | "github_account" | string;
  id: string;
  provider: string;
  identification_id: string;
  provider_user_id: string;
  approved_scopes: string;
  email_address: string;
  first_name: string;
  last_name: string;
  avatar_url: string;
  image_url: string;
  username: string;
  public_metadata: Record<string, any>;
  label: string | null;
  created_at: number;
  updated_at: number;
  verification: ClerkRawVerification;
  external_account_id: string;
  google_id?: string;
  given_name?: string;
  family_name?: string;
  picture?: string;
}

export interface ClerkRawSamlAccount {
  id: string;
  object: "saml_account";
  provider: string;
  provider_user_id: string;
  email_address: string;
  first_name: string;
  last_name: string;
  verification: ClerkRawVerification;
  created_at: number;
  updated_at: number;
}

export interface ClerkRawEnterpriseAccount {
  id: string;
  object: "enterprise_account";
  provider: string;
  provider_user_id: string;
  email_address: string;
  first_name: string;
  last_name: string;
  verification: ClerkRawVerification;
  created_at: number;
  updated_at: number;
}

export interface ClerkRawVerification {
  object:
    | "verification_otp"
    | "verification_oauth"
    | "verification_from_oauth"
    | string;
  status: "verified" | "unverified" | "pending";
  strategy: string;
  attempts: number | null;
  expire_at: number | null;
}

export interface ClerkRawLinkedAccount {
  type: string;
  id: string;
}

// ============================================================================
// Pagination Interfaces
// ============================================================================

export interface PaginationMeta {
  currentPage: number;
  nextPage: number | null;
  prevPage: number | null;
  itemsPerPage: number;
  totalPages: number;
  totalItems: number;
}
