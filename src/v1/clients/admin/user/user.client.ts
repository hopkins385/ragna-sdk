import { BadResponseError } from "../../../../errors";
import RagnaClient from "../../../../ragnaClient";
import { getRoute, HttpStatus } from "../../../../utils";
import { BaseApiClient } from "../../../base/base-api.client";
import { PaginateParams } from "../../../interfaces";
import {
  CreateUserData,
  FetchUserResponse,
  InviteUserData,
  InviteUserResponse,
  UpdateUserData,
  UpdateUserResponse,
  User,
  UsersPaginated,
} from "./interfaces";

const ApiUserRoute = {
  BASE: "/user", // GET, POST
  INVITE: "/user/invite", // POST
  USER: "/user/:userId", // GET, PATCH, DELETE
} as const;

export class UserClient extends BaseApiClient {
  constructor(private readonly client: RagnaClient) {
    super();
  }

  /**
   * Fetches all users that belong to the authenticated users organization with pagination.
   * @info Requires admin privileges.
   * @param params.page - The page number to fetch
   * @param params.limit - The number of items per page
   * @returns
   */
  async fetchAllUsers(params: PaginateParams): Promise<UsersPaginated> {
    const route = getRoute(ApiUserRoute.BASE);
    const response = await this.client
      .GET<UsersPaginated, PaginateParams>()
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
   * Fetches a user by ID that belongs to the authenticated users organization.
   * @info Requires admin privileges.
   * @param payload.userId - The ID of the user to fetch
   * @returns
   */
  async fetchUserById(payload: { userId: string }): Promise<FetchUserResponse> {
    const route = getRoute(ApiUserRoute.USER, { ":userId": payload.userId });
    const response = await this.client
      .GET<FetchUserResponse>()
      .setRoute(route)
      .setSignal(this.ac.signal)
      .send();

    if (response.status !== HttpStatus.OK) {
      throw new BadResponseError();
    }

    return response.data;
  }

  /**
   * Creates a new user in the authenticated users organization.
   * @info Requires admin privileges.
   * @param data.name - Full name
   * @param data.email - User email
   * @param data.password - User password
   * @returns
   */
  async createUser(data: CreateUserData): Promise<User> {
    const route = getRoute(ApiUserRoute.BASE);
    const response = await this.client
      .POST<User, CreateUserData>()
      .setRoute(route)
      .setData(data)
      .setSignal(this.ac.signal)
      .send();

    if (response.status !== HttpStatus.CREATED) {
      throw new BadResponseError();
    }

    return response.data;
  }

  /**
   * Creates a new user in the authenticated users organization and returns an invite token.
   * @info Requires admin privileges.
   * @param data.name - Full name
   * @param data.email - User email
   * @returns
   */
  async inviteUser(data: InviteUserData): Promise<InviteUserResponse> {
    const route = getRoute(ApiUserRoute.INVITE);
    const response = await this.client
      .POST<InviteUserResponse, InviteUserData>()
      .setRoute(route)
      .setData(data)
      .setSignal(this.ac.signal)
      .send();

    if (response.status !== HttpStatus.CREATED) {
      throw new BadResponseError();
    }

    return response.data;
  }

  /**
   * Updates a user in the authenticated users organization.
   * @info Requires admin privileges.
   * @param payload.userId - The ID of the user to update
   * @param payload.data - User data
   * @returns
   */
  async updateUser(payload: {
    userId: string;
    data: UpdateUserData;
  }): Promise<UpdateUserResponse> {
    const route = getRoute(ApiUserRoute.USER, { ":userId": payload.userId });
    const response = await this.client
      .PATCH<UpdateUserResponse, UpdateUserData>()
      .setRoute(route)
      .setData(payload.data)
      .setSignal(this.ac.signal)
      .send();

    if (response.status !== HttpStatus.OK) {
      throw new BadResponseError();
    }

    return response.data;
  }

  /**
   * Soft-deletes a user in the authenticated users organization.
   * @info Requires admin privileges.
   * @param payload.userId - The ID of the user to delete
   * @returns
   */
  async deleteUser(payload: { userId: string }): Promise<void> {
    const route = getRoute(ApiUserRoute.USER, { ":userId": payload.userId });
    const response = await this.client
      .DELETE<never>()
      .setRoute(route)
      .setSignal(this.ac.signal)
      .send();

    if (response.status !== HttpStatus.OK) {
      throw new BadResponseError();
    }

    return;
  }
}

export default UserClient;
