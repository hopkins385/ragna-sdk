export interface ProviderAuthConsentURL {
  url: string;
}

export interface ProviderAuthHasAccess {
  hasAccess: boolean;
}

export type ProviderAuthConsentURLResponse = ProviderAuthConsentURL;
export type ProviderAuthHasAccessResponse = ProviderAuthHasAccess;
export type ProviderAuthName = 'google' | 'microsoft';
export type ProviderAuthType = 'googledrive' | 'onedrive';
