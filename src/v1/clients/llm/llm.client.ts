import { BaseApiClient } from "../../base/base-api.client";
import RagnaClient from "../../../ragnaClient";
import { getRoute, HttpStatus } from "../../../utils";
import { BadResponseError } from "../../../errors/bad-response.error";
import { LargeLangModelListResponse } from "./interfaces";

const ApiLlmRoute = {
  MODELS: "/llm/models", // GET
} as const;

export class LLMClient extends BaseApiClient {
  constructor(private readonly client: RagnaClient) {
    super();
  }

  async getAllModels() {
    const route = getRoute(ApiLlmRoute.MODELS);
    const response = await this.client
      .GET<LargeLangModelListResponse>()
      .setRoute(route)
      .setSignal(this.ac.signal)
      .send();

    if (response.status !== HttpStatus.OK) {
      throw new BadResponseError();
    }

    return response.data;
  }
}

export default LLMClient;
