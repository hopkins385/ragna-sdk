import { BadResponseError } from "../../../errors/bad-response.error";
import RagnaClient from "../../../ragnaClient";
import { getRoute, HttpStatus } from "../../../utils";
import { BaseApiClient } from "../../base/base-api.client";
import { AssistantToolResponse } from "./interfaces";

const ApiAssistantToolRoute = {
  TOOLS: "/assistant-tool/tools", // GET
} as const;

export class AssistantToolClient extends BaseApiClient {
  constructor(private readonly client: RagnaClient) {
    super();
  }

  async fetchAllTools() {
    const route = getRoute(ApiAssistantToolRoute.TOOLS);
    const response = await this.client
      .GET<AssistantToolResponse>()
      .setRoute(route)
      .setSignal(this.ac.signal)
      .send();

    if (response.status !== HttpStatus.OK) {
      throw new BadResponseError();
    }

    return response.data;
  }
}

export default AssistantToolClient;
