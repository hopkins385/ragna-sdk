import { BadResponseError } from "../../../errors/bad-response.error";
import RagnaClient from "../../../ragnaClient";
import { getRoute, HttpStatus } from "../../../utils";
import { BaseApiClient } from "../../base/base-api.client";
import { DriveParams } from "./interfaces";

const ApiGoogleDriveRoute = {
  BASE: "/google-drive",
};

export class GoogleDriveClient extends BaseApiClient {
  constructor(private readonly client: RagnaClient) {
    super();
  }

  public async fetchDriveData(params: DriveParams) {
    const route = getRoute(ApiGoogleDriveRoute.BASE);
    const { status, data } = await this.client
      .GET<any, DriveParams>()
      .setRoute(route)
      .setParams(params)
      .setSignal(this.ac.signal)
      .send();

    if (status !== HttpStatus.OK) {
      throw new BadResponseError();
    }

    return data;
  }
}

export default GoogleDriveClient;
