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
