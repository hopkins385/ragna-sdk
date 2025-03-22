import { BadResponseError } from "../../../errors/bad-response.error";
import RagnaClient from "../../../ragnaClient";
import { getRoute, HttpStatus } from "../../../utils";
import { BaseApiClient } from "../../base/base-api.client";
import { User, UserCreate, UsersPaginated } from "./interfaces";

type UserUpdate = Omit<User, "id">;

const ApiUserRoute = {
  BASE: "user", // GET, POST
  USER: "user/:userId", // GET, PATCH, DELETE
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
  async fetchAllUsers(): Promise<UsersPaginated> {
    const route = getRoute(ApiUserRoute.BASE);
    const response = await this.client
      .GET<UsersPaginated>()
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
   * Fetches a user by ID that belongs to the authenticated users organization.
   * @param id {string} - User ID
   * @returns
   */
  async fetchUserById(id: string): Promise<User> {
    const userId = id.toLowerCase();
    if (!userId) throw new Error("User ID is required");

    const route = getRoute(ApiUserRoute.USER, { ":userId": userId });
    const response = await this.client
      .GET<User>()
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
   * @param user {UserCreate} - New User data
   * @returns
   */
  async createUser(user: UserCreate): Promise<User> {
    if (!user.name || !user.email || !user.password) {
      throw new Error("Name, email and password are required");
    }

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
   * Updates a user in the authenticated users organization.
   * @param id {string} - User ID
   * @param updateData {UserUpdate} - User data to update
   * @returns
   */
  async updateUser(id: string, updateData: UserUpdate): Promise<User> {
    const userId = id.toLowerCase();
    if (!userId) throw new Error("User ID is required");

    const route = getRoute(ApiUserRoute.USER, { ":userId": userId });
    const response = await this.client
      .PATCH<User, UserUpdate>()
      .setRoute(route)
      .setData(updateData)
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
   * @param id {string} - User ID
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
