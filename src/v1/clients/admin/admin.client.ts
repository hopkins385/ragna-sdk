import RagnaClient from "../../../ragnaClient";
import { BaseApiClient } from "../../base/base-api.client";
import { TeamClient } from "./team/team.client";
import { UserClient } from "./user";

export class AdminClient extends BaseApiClient {
  public readonly user: UserClient;
  public readonly team: TeamClient;

  constructor(private readonly client: RagnaClient) {
    super();

    this.user = new UserClient(this.client);
    this.team = new TeamClient(this.client);
  }
}
