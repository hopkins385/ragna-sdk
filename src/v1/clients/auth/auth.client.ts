import { BadResponseError } from "../../../errors/bad-response.error";
import { UnauthorizedError } from "../../../errors/unauthorized.error";
import RagnaClient from "../../../ragnaClient";
import { getRoute, HttpStatus } from "../../../utils";
import { BaseApiClient } from "../../base/base-api.client";
import {
  AuthCredentials,
  AuthResetPasswordData,
  AuthResetPasswordResponse,
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
  RESET_PASSWORD: "/auth/reset-password", // POST
  SOCIAL_AUTH_URL: "/auth/:provider/url", // GET
  CALLBACK_GOOGLE: "/auth/google/callback", // POST
} as const;

const emptyBodyData: EmptyBodyData = {};

export class AuthClient extends BaseApiClient {
  constructor(private readonly client: RagnaClient) {
    super();
  }

  /**
   * Login user
   * @param email User's email
   * @param password User's password
   * @returns
   */
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

  /**
   * Logout user
   * @returns
   */
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

  /**
   * Register a new user
   * @param name User's name
   * @param email User's email
   * @param password User's password
   * @param termsAndConditions Terms and conditions acceptance
   * @param invitationCode Invitation code
   * @returns
   */
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

  /**
   * Reset user password via token
   * @param token Password reset token
   * @param password User's new password
   * @returns
   */
  async resetPassword(payload: AuthResetPasswordData) {
    this.abortRequest();
    const route = getRoute(ApiAuthRoute.RESET_PASSWORD);
    const response = await this.client
      .POST<AuthResetPasswordResponse, AuthResetPasswordData>()
      .setRoute(route)
      .setData(payload)
      .setSignal(this.ac.signal)
      .send();

    if (response.status !== HttpStatus.CREATED) {
      throw new BadResponseError();
    }

    return response.data;
  }

  /**
   * Fetch active user session
   * @returns
   */
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

  /**
   * Retrieves new access and refresh tokens, if session is valid
   * @info The header needs to contain the refresh token which is automatically added by this sdk for this request
   * @returns
   */
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
