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
   * Fetches all users from the system
   */
  async fetchAllUsers(): Promise<UsersPaginated> {
    const route = getRoute(ApiUserRoute.BASE);
    const { status, data } = await this.client
      .GET<UsersPaginated>()
      .setRoute(route)
      .setSignal(this.ac.signal)
      .send();

    if (status !== HttpStatus.OK) {
      throw new BadResponseError();
    }

    return data;
  }

  /**
   * Fetches a user by their ID
   * @param id User ID
   */
  async fetchUserById(id: string): Promise<User> {
    const userId = id.toLowerCase();
    if (!userId) throw new Error("User ID is required");

    const route = getRoute(ApiUserRoute.USER, { ":userId": userId });
    const { status, data } = await this.client
      .GET<User>()
      .setRoute(route)
      .setSignal(this.ac.signal)
      .send();

    if (status !== HttpStatus.OK) {
      throw new BadResponseError();
    }

    return data;
  }

  /**
   * Creates a new user
   * @param user User data
   */
  async createUser(user: UserCreate): Promise<User> {
    if (!user.name || !user.email || !user.password) {
      throw new Error("Name, email and password are required");
    }

    const route = getRoute(ApiUserRoute.BASE);
    const { status, data } = await this.client
      .POST<User, UserCreate>()
      .setRoute(route)
      .setData(user)
      .setSignal(this.ac.signal)
      .send();

    if (status !== HttpStatus.CREATED) {
      throw new BadResponseError();
    }

    return data;
  }

  /**
   * Updates an existing user
   * @param user User data with ID
   */
  async updateUser(id: string, updateData: UserUpdate): Promise<User> {
    const userId = id.toLowerCase();
    if (!userId) throw new Error("User ID is required");

    const route = getRoute(ApiUserRoute.USER, { ":userId": userId });
    const { status, data } = await this.client
      .PATCH<User, UserUpdate>()
      .setRoute(route)
      .setData(updateData)
      .setSignal(this.ac.signal)
      .send();

    if (status !== HttpStatus.OK) {
      throw new BadResponseError();
    }

    return data;
  }

  /**
   * Deletes a user
   * @param id User ID
   */
  async deleteUser(id: string): Promise<void> {
    const userId = id.toLowerCase();
    if (!userId) {
      throw new Error("User ID is required");
    }

    const route = getRoute(ApiUserRoute.USER, { ":userId": userId });
    const { status } = await this.client
      .DELETE<never>()
      .setRoute(route)
      .setSignal(this.ac.signal)
      .send();

    if (status !== HttpStatus.OK) {
      throw new BadResponseError();
    }

    return;
  }
}

export default UserClient;
