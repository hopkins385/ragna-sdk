import { BadResponseError } from "../../../../errors";
import RagnaClient from "../../../../ragnaClient";
import { getRoute, HttpStatus } from "../../../../utils";
import { BaseApiClient } from "../../../base/base-api.client";
import { PaginateParams } from "../../../interfaces";
import { TeamResponse, TeamsPaginated } from "./interfaces";

const ApiTeamRoute = {
  ALL: "/team/all", // GET
  TEAM: "/team/:id", // GET
  EDIT: "/team/:id/edit", // PATCH
} as const;

export class TeamClient extends BaseApiClient {
  constructor(private readonly client: RagnaClient) {
    super();
  }

  /**
   * Fetches all teams that belong to the authenticated users organization.
   * @info Requires admin privileges.
   * @returns
   */
  async fetchAllTeams(params: PaginateParams): Promise<TeamsPaginated> {
    const route = getRoute(ApiTeamRoute.ALL);
    const response = await this.client
      .GET<TeamsPaginated, PaginateParams>()
      .setRoute(route)
      .setParams(params)
      .setSignal(this.ac.signal)
      .send();

    if (response.status !== HttpStatus.OK) {
      throw new BadResponseError();
    }

    return response.data;
  }

  /**
   * Fetches a team by its ID.
   * @info Requires admin privileges.
   * @param teamId The ID of the team to fetch.
   * @returns
   */
  async fetchTeamById({ teamId }: { teamId: string }): Promise<TeamResponse> {
    const route = getRoute(ApiTeamRoute.TEAM, { ":id": teamId });
    const response = await this.client
      .GET<TeamResponse>()
      .setRoute(route)
      .setSignal(this.ac.signal)
      .send();

    if (response.status !== HttpStatus.OK) {
      throw new BadResponseError();
    }

    return response.data;
  }

  /**
   * Edits a team by its ID.
   * @info Requires admin privileges.
   * @param teamId The ID of the team to edit.
   * @param data The data to update the team with.
   * @returns
   */
  async updateTeam({
    teamId,
    data,
  }: {
    teamId: string;
    data: { name: string };
  }): Promise<TeamResponse> {
    const route = getRoute(ApiTeamRoute.EDIT, { ":id": teamId });
    const response = await this.client
      .PATCH<TeamResponse, { name: string }>()
      .setRoute(route)
      .setData(data)
      .setSignal(this.ac.signal)
      .send();

    if (response.status !== HttpStatus.OK) {
      throw new BadResponseError();
    }

    return response.data;
  }
}
