import { BadResponseError } from "../../../../errors";
import RagnaClient from "../../../../ragnaClient";
import { getRoute, HttpStatus } from "../../../../utils";
import { BaseApiClient } from "../../../base/base-api.client";
import { PaginateParams } from "../../../interfaces";
import {
  FetchUserResponse,
  InviteUserData,
  InviteUserResponse,
  UpdateUserData,
  UpdateUserResponse,
  User,
  UserCreate,
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
   * Requires admin privileges.\
   * Fetches all users that belong to the authenticated users organization.
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
   * Requires admin privileges.\
   * Fetches a user by ID that belongs to the authenticated users organization.
   * @param id - UserID
   * @returns
   */
  async fetchUserById({
    userId,
  }: {
    userId: string;
  }): Promise<FetchUserResponse> {
    if (!userId) throw new Error("User ID is required");

    const route = getRoute(ApiUserRoute.USER, { ":userId": userId });
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
   * Requires admin privileges.\
   * Creates a new user in the authenticated users organization.
   * @param name - Full name
   * @param email - User email
   * @param password - User password
   * @returns
   */
  async createUser(user: UserCreate): Promise<User> {
    const route = getRoute(ApiUserRoute.BASE);
    const response = await this.client
      .POST<User, UserCreate>()
      .setRoute(route)
      .setData(user)
      .setSignal(this.ac.signal)
      .send();

    if (response.status !== HttpStatus.CREATED) {
      throw new BadResponseError();
    }

    return response.data;
  }

  /**
   * Requires admin privileges.\
   * Creates a new user in the authenticated users organization and returns an invite link.
   * @param name - Full name
   * @param email - User email
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
   * Requires admin privileges.\
   * Updates a user in the authenticated users organization.
   * @param userId - User ID
   * @param data - User data
   * @returns
   */
  async updateUser({
    userId,
    data,
  }: {
    userId: string;
    data: UpdateUserData;
  }): Promise<UpdateUserResponse> {
    if (!userId) throw new Error("User ID is required");

    const route = getRoute(ApiUserRoute.USER, { ":userId": userId });
    const response = await this.client
      .PATCH<UpdateUserResponse, UpdateUserData>()
      .setRoute(route)
      .setData(data)
      .setSignal(this.ac.signal)
      .send();

    if (response.status !== HttpStatus.OK) {
      throw new BadResponseError();
    }

    return response.data;
  }

  /**
   * Requires admin privileges.\
   * Deletes a user in the authenticated users organization.
   * @param id {string} - UserID
   * @returns
   */
  async deleteUser(id: string): Promise<void> {
    const userId = id.toLowerCase();
    if (!userId) {
      throw new Error("User ID is required");
    }

    const route = getRoute(ApiUserRoute.USER, { ":userId": userId });
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
