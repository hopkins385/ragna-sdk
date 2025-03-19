import { BadResponseError } from "../../../errors/bad-response.error";
import RagnaClient from "../../../ragnaClient";
import { getRoute, HttpStatus } from "../../../utils";
import { BaseApiClient } from "../../base/base-api.client";
import { OnboardingResponse } from "./interfaces";

const ApiOnboardingRoute = {
  USER: "/onboard/user", // POST
} as const;

export class OnboardingClient extends BaseApiClient {
  constructor(private readonly client: RagnaClient) {
    super();
  }
  async onboardUser(payload: { orgName: string }): Promise<OnboardingResponse> {
    const route = getRoute(ApiOnboardingRoute.USER);
    const { status, data } = await this.client
      .POST<OnboardingResponse, { orgName: string }>()
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

export default OnboardingClient;
