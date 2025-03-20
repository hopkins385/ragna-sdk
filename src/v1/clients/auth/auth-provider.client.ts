import { BadResponseError } from "../../../errors/bad-response.error";
import RagnaClient from "../../../ragnaClient";
import { getRoute, HttpStatus } from "../../../utils";
import { BaseApiClient } from "../../base/base-api.client";
import {
  ProviderAuthConsentURLResponse,
  ProviderAuthHasAccessResponse,
  ProviderAuthName,
} from "./interfaces";

const ApiProviderAuthRoute = {
  GOOGLE: "/google-drive",
  GOOGLE_CONSENT_URL: "/google-drive/consent-url",
  GOOGLE_CALLBACK: "/google-drive/callback",
  GOOGLE_HAS_ACCESS: "/google-drive/has-access",
} as const;

export class AuthProviderClient extends BaseApiClient {
  constructor(private readonly client: RagnaClient) {
    super();
  }

  public async fetchUserHasAccess(provider: ProviderAuthName) {
    const route = getRoute(ApiProviderAuthRoute.GOOGLE_HAS_ACCESS);
    const response = await this.client
      .GET<ProviderAuthHasAccessResponse>()
      .setRoute(route)
      .setSignal(this.ac.signal)
      .send();

    if (response.status !== HttpStatus.OK) {
      throw new BadResponseError();
    }

    return response.data;
  }

  public async fetchConsentURL(provider: ProviderAuthName) {
    const route = getRoute(ApiProviderAuthRoute.GOOGLE_CONSENT_URL);
    const response = await this.client
      .GET<ProviderAuthConsentURLResponse>()
      .setRoute(route)
      .setSignal(this.ac.signal)
      .send();

    if (response.status !== HttpStatus.OK) {
      throw new BadResponseError();
    }

    return response.data;
  }

  public async connectGoogleDrive(payload: { code: string }) {
    const route = getRoute(ApiProviderAuthRoute.GOOGLE_CALLBACK);
    const response = await this.client
      .GET<any, { code: string }>()
      .setRoute(route)
      .setParams(payload)
      .setSignal(this.ac.signal)
      .send();

    if (response.status !== HttpStatus.OK) {
      throw new BadResponseError();
    }

    return response.data;
  }
}

export default AuthProviderClient;
