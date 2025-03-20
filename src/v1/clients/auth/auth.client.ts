import { BadResponseError } from "../../../errors/bad-response.error";
import { UnauthorizedError } from "../../../errors/unauthorized.error";
import RagnaClient from "../../../ragnaClient";
import { getRoute, HttpStatus } from "../../../utils";
import { BaseApiClient } from "../../base/base-api.client";
import {
  AuthCredentials,
  AuthUserResponse,
  EmptyBodyData,
  GoogleAuthCallbackQuery,
  RegistrationCredentials,
  SocialAuthUrlResponse,
  TokensResponse,
} from "./interfaces";

export const ApiAuthRoute = {
  LOGIN: "/auth/login", // POST
  LOGOUT: "/auth/logout", // POST
  REGISTER: "/auth/register", // POST
  REFRESH: "/auth/refresh", // POST
  SESSION: "/auth/session", // GET
  SOCIAL_AUTH_URL: "/auth/:provider/url", // GET
  CALLBACK_GOOGLE: "/auth/google/callback", // POST
} as const;

const emptyBodyData: EmptyBodyData = {};

export class AuthClient extends BaseApiClient {
  constructor(private readonly client: RagnaClient) {
    super();
  }

  async loginUser(body: AuthCredentials) {
    this.abortRequest();
    const route = getRoute(ApiAuthRoute.LOGIN);
    const response = await this.client
      .POST<TokensResponse, AuthCredentials>()
      .setRoute(route)
      .setData(body)
      .setSignal(this.ac.signal)
      .send();

    if (response.status !== HttpStatus.CREATED) {
      throw new UnauthorizedError("Invalid credentials");
    }

    return response.data;
  }

  async logoutUser(): Promise<void> {
    this.abortRequest();
    const route = getRoute(ApiAuthRoute.LOGOUT);
    const response = await this.client
      .POST<never, EmptyBodyData>()
      .setRoute(route)
      .setData(emptyBodyData)
      .setSignal(this.ac.signal)
      .send();

    // Logout should always return 200 (OK) status
    if (response.status !== HttpStatus.OK) {
      throw new BadResponseError();
    }

    return;
  }

  async registerUser(payload: RegistrationCredentials) {
    this.abortRequest();
    const route = getRoute(ApiAuthRoute.REGISTER);
    const response = await this.client
      .POST<AuthUserResponse, RegistrationCredentials>()
      .setRoute(route)
      .setData(payload)
      .setSignal(this.ac.signal)
      .send();

    if (response.status !== HttpStatus.CREATED) {
      throw new BadResponseError();
    }

    return response.data;
  }

  async fetchSession() {
    const route = getRoute(ApiAuthRoute.SESSION);
    const response = await this.client
      .GET<AuthUserResponse>()
      .setRoute(route)
      .setSignal(this.ac.signal)
      .send();

    if (response.status !== HttpStatus.OK) {
      throw new BadResponseError();
    }

    return response.data;
  }

  async refreshTokens() {
    const route = getRoute(ApiAuthRoute.REFRESH);
    const response = await this.client
      .POST<TokensResponse, EmptyBodyData>()
      .setRoute(route)
      .setData(emptyBodyData)
      .setSignal(this.ac.signal)
      .send();

    if (response.status !== HttpStatus.CREATED) {
      throw new BadResponseError();
    }

    return response.data;
  }

  async fetchSocialAuthUrl(provider: string) {
    const route = getRoute(ApiAuthRoute.SOCIAL_AUTH_URL, {
      ":provider": provider,
    });
    const response = await this.client
      .GET<SocialAuthUrlResponse>()
      .setRoute(route)
      .setSignal(this.ac.signal)
      .send();

    if (response.status !== HttpStatus.OK) {
      throw new BadResponseError();
    }

    return response.data;
  }

  async googleAuth(callbackData: GoogleAuthCallbackQuery) {
    const route = getRoute(ApiAuthRoute.CALLBACK_GOOGLE);
    const response = await this.client
      .POST<TokensResponse, GoogleAuthCallbackQuery>()
      .setRoute(route)
      .setData(callbackData)
      .setSignal(this.ac.signal)
      .send();

    if (response.status !== HttpStatus.CREATED) {
      throw new BadResponseError();
    }

    return response.data;
  }
}

export default AuthClient;
