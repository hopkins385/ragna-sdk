interface Organisation {
  id: string;
  name: string;
}

interface Team {
  id: string;
  name: string;
}

export interface AccountData {
  id: string;
  name: string;
  firstName: string;
  lastName: string;
  email: string;
  image: string;
  roles: string[];
  teams: Team[];
  organisation: Organisation;
  lastLoginAt: string | null;
  onboardedAt: string | null;
  emailVerifiedAt: string | null;
  hasOnboarded: boolean;
  hasEmailVerified: boolean;
}

export interface AccountDataResponse {
  account: AccountData;
}

export interface TokenUsage {
  totalTokens: number;
  createdAt: Date;
  llm: {
    provider: string;
    displayName: string;
  };
}

export interface TokenUsageHistoryResponse {
  tokenUsages: TokenUsage[];
}

export interface TokenUsageHistoryParams {
  month: string;
  year: string;
}
