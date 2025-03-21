import { getRoute, HttpStatus } from "../../../utils";
import { BaseApiClient } from "../../base/base-api.client";
import RagnaClient from "../../../ragnaClient";
import { BadResponseError } from "../../../errors/bad-response.error";
import {
  TokenUsageHistoryParams,
  TokenUsageHistoryResponse,
} from "./interfaces";

const ApiAccountStatsRoute = {
  TOKEN_HISTORY: "/token-usage/history", // GET
} as const;

export type ApiAccountStatsRoute =
  (typeof ApiAccountStatsRoute)[keyof typeof ApiAccountStatsRoute];

export class AccountStatsClient extends BaseApiClient {
  constructor(private readonly client: RagnaClient) {
    super();
  }

  /**
   * Fetches token usage history for the authenticated user for a specific month and year.
   *
   * @param params - Object containing month and year
   * @param params.month - Month in MM format (01-12)
   * @param params.year - Year in YYYY format
   *
   * @example
   * ```typescript
   * const tokenHistory = await client.accountStats.fetchTokenHistory({
   *   month: "03",
   *   year: "2025"
   * });
   * ```
   */
  public async fetchTokenHistory(params: TokenUsageHistoryParams) {
    const route = getRoute(ApiAccountStatsRoute.TOKEN_HISTORY);
    const response = await this.client
      .GET<TokenUsageHistoryResponse, TokenUsageHistoryParams>()
      .setRoute(route)
      .setParams(params)
      .setSignal(this.ac.signal)
      .send();

    if (response.status !== HttpStatus.OK) {
      throw new BadResponseError();
    }

    return response.data;
  }
}

export default AccountStatsClient;
