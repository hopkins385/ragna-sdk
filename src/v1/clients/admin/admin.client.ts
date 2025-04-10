import RagnaClient from "../../../ragnaClient";
import { BaseApiClient } from "../../base/base-api.client";
import { UserClient } from "./user";

export class AdminClient extends BaseApiClient {
  public readonly user: UserClient;

  constructor(private readonly client: RagnaClient) {
    super();

    this.user = new UserClient(this.client);
  }
}
