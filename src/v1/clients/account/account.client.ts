import { BadResponseError } from "../../../errors/bad-response.error";
import RagnaClient from "../../../ragnaClient";
import { getRoute, HttpStatus } from "../../../utils";
import { BaseApiClient } from "../../base/base-api.client";
import { AccountData, AccountDataResponse } from "./interfaces";

const ApiAccountRoute = {
  BASE: "/account", // GET
  NAME: "/account/name", // PATCH
  PASSWORD: "/account/password", // PATCH
  DELETE: "/account/delete", // DELETE
} as const;

export class AccountClient extends BaseApiClient {
  constructor(private readonly client: RagnaClient) {
    super();
  }

  /**
   * Fetch account data for the authenticated user.
   *
   * @returns
   */
  public async fetchAccountData() {
    const route = getRoute(ApiAccountRoute.BASE);
    const response = await this.client
      .GET<AccountDataResponse>()
      .setRoute(route)
      .setSignal(this.ac.signal)
      .send();

    if (response.status !== HttpStatus.OK) {
      throw new BadResponseError();
    }

    return response.data;
  }

  /**
   * Update the name for the authenticated user.
   *
   * @param firstName - First name of the user
   * @param lastName - Last name of the user
   * @returns
   */
  public async updateName(payload: { firstName: string; lastName: string }) {
    const route = getRoute(ApiAccountRoute.NAME);
    const response = await this.client
      .PATCH<AccountData, { firstName: string; lastName: string }>()
      .setRoute(route)
      .setData(payload)
      .setSignal(this.ac.signal)
      .send();

    if (response.status !== HttpStatus.OK) {
      throw new BadResponseError();
    }

    return response.data;
  }

  /**
   * Update the password for the authenticated user.
   *
   * @param oldPassword - Old password of the user
   * @param newPassword - New password of the user
   * @returns
   */
  public async updatePassword(payload: {
    oldPassword: string;
    newPassword: string;
  }) {
    const route = getRoute(ApiAccountRoute.PASSWORD);
    const response = await this.client
      .PATCH<AccountData, { oldPassword: string; newPassword: string }>()
      .setRoute(route)
      .setData(payload)
      .setSignal(this.ac.signal)
      .send();

    if (response.status !== HttpStatus.OK) {
      throw new BadResponseError();
    }

    return response.data;
  }

  /**
   * Delete the account for the authenticated user.
   *
   * @param password - Password of the user
   * @returns
   */
  public async deleteAccount(payload: { password: string }) {
    throw new Error("Method not implemented.");
    // TODO: dont send password
    const route = getRoute(ApiAccountRoute.DELETE);
    const response = await this.client
      .DELETE<AccountData, { password: string }>()
      .setRoute(route)
      // .setParams(payload)
      .setSignal(this.ac.signal)
      .send();

    if (response.status !== HttpStatus.OK) {
      throw new BadResponseError();
    }

    return response.data;
  }
}

export default AccountClient;
