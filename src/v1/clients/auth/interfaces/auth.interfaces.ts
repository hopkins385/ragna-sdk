export interface AuthCredentials {
  email: string;
  password: string;
}

export interface RegistrationCredentials {
  name: string;
  email: string;
  password: string;
  termsAndConditions: boolean;
  invitationCode?: string;
}

export interface AuthUserResponse {
  userData: AuthUserData;
}

export interface AuthUserData {
  id: number;
  name: string;
  email: string;
}

export interface TokensResponse {
  accessToken: string;
  accessTokenExpiresAt: number;
  refreshToken: string;
  refreshTokenExpiresAt: number;
}

export type AuthUrl = string;

export interface SocialAuthUrlResponse {
  url: AuthUrl;
}

export interface EmptyBodyData {}
