export interface AccountData {
  id: string;
  name: string;
  firstName: string;
  lastName: string;
  totalCredits: number;
  email: string;
  organisation: any;
  roles: any;
  teams: any;
  organisationId: string;
  firstTeamId: string;
  onboardedAt: string | null;
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
