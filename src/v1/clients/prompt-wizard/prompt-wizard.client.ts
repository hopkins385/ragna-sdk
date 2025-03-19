import { BadResponseError } from "../../../errors/bad-response.error";
import RagnaClient from "../../../ragnaClient";
import { getRoute, HttpStatus } from "../../../utils";
import { BaseApiClient } from "../../base/base-api.client";
import { CreatePromptResponse } from "./interfaces";

const ApiPromptWizardRoute = {
  CREATE: "/prompt-wizard/create", // POST
} as const;

export class PromptWizardClient extends BaseApiClient {
  constructor(private readonly client: RagnaClient) {
    super();
  }

  async createPrompt(payload: {}) {
    const route = getRoute(ApiPromptWizardRoute.CREATE);
    const { status, data } = await this.client
      .POST<CreatePromptResponse, {}>()
      .setRoute(route)
      .setData(payload)
      .setSignal(this.ac.signal)
      .send();

    if (status !== HttpStatus.CREATED) {
      throw new BadResponseError();
    }

    return data;
  }
}

export default PromptWizardClient;
