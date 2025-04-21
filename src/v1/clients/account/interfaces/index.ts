import { Team } from "../../admin/team";

export interface Organisation {
  id: string;
  name: string;
}

export interface Role {
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
  roles: Role[];
  teams: Team[];
  activeTeamId: string;
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
  prompTokens: number;
  completionTokens: number;
  totalTokens: number;
  createdAt: Date;
  promptPrice: number;
  completionPrice: number;
  totalPrice: number;
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
