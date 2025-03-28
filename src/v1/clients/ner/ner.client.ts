import { BadResponseError } from "../../../errors";
import RagnaClient from "../../../ragnaClient";
import { getRoute, HttpStatus } from "../../../utils";
import { BaseApiClient } from "../../base/base-api.client";
import { NerPayload } from "../prompt-wizard/interfaces/ner-payload.interface";
import { NerExtractResponse } from "../prompt-wizard/interfaces/ner-response.interface";

const NerApiRoute = {
  EXTRACT: "/ner/extract", // POST
} as const;

export class NerClient extends BaseApiClient {
  constructor(private readonly client: RagnaClient) {
    super();
  }

  async extractEntities(payload: NerPayload): Promise<NerExtractResponse> {
    const route = getRoute(NerApiRoute.EXTRACT);
    const response = await this.client
      .POST<NerExtractResponse, NerPayload>()
      .setRoute(route)
      .setData(payload)
      .setSignal(this.ac.signal)
      .send();

    if (response.status !== HttpStatus.CREATED) {
      throw new BadResponseError();
    }

    return response.data;
  }
}

export default NerClient;
