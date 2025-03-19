import { BadResponseError } from "../../../errors/bad-response.error";
import RagnaClient from "../../../ragnaClient";
import { getRoute, HttpStatus } from "../../../utils";
import { BaseApiClient } from "../../base/base-api.client";
import { AccountData } from "./interfaces";

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

  public async fetchAccountData() {
    const route = getRoute(ApiAccountRoute.BASE);
    const { status, data } = await this.client
      .GET<AccountData>()
      .setRoute(route)
      .setSignal(this.ac.signal)
      .send();

    if (status !== HttpStatus.OK) {
      throw new BadResponseError();
    }

    return data;
  }

  public async updateName(payload: { firstName: string; lastName: string }) {
    const route = getRoute(ApiAccountRoute.NAME);
    const { status, data } = await this.client
      .PATCH<AccountData, { firstName: string; lastName: string }>()
      .setRoute(route)
      .setData(payload)
      .setSignal(this.ac.signal)
      .send();

    if (status !== HttpStatus.OK) {
      throw new BadResponseError();
    }

    return data;
  }

  public async updatePassword(payload: {
    oldPassword: string;
    newPassword: string;
  }) {
    const route = getRoute(ApiAccountRoute.PASSWORD);
    const { status, data } = await this.client
      .PATCH<AccountData, { oldPassword: string; newPassword: string }>()
      .setRoute(route)
      .setData(payload)
      .setSignal(this.ac.signal)
      .send();

    if (status !== HttpStatus.OK) {
      throw new BadResponseError();
    }

    return data;
  }

  public async deleteAccount(payload: { password: string }) {
    throw new Error("Method not implemented.");
    // TODO: dont send password
    const route = getRoute(ApiAccountRoute.DELETE);
    const { status, data } = await this.client
      .DELETE<AccountData, { password: string }>()
      .setRoute(route)
      // .setParams(payload)
      .setSignal(this.ac.signal)
      .send();

    if (status !== HttpStatus.OK) {
      throw new BadResponseError();
    }

    return data;
  }
}

export default AccountClient;
