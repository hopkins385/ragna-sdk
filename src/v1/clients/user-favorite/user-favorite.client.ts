import { BadResponseError } from "../../../errors/bad-response.error";
import RagnaClient from "../../../ragnaClient";
import { getRoute, HttpStatus } from "../../../utils";
import { BaseApiClient } from "../../base/base-api.client";
import {
  UserFavoritePayload,
  UserFavoriteResponse,
  UserFavoritesResponse,
} from "./interfaces";

export const ApiUserFavoriteRoute = {
  BASE: "/user-favorite", // GET, POST
  DELETE: "/user-favorite/:entityId", // DELETE
  TYPE: "/user-favorite/type/:favoriteType", // GET
} as const;

export class UserFavoriteClient extends BaseApiClient {
  constructor(private readonly client: RagnaClient) {
    super();
  }

  public async addFavorite(payload: UserFavoritePayload) {
    const bodyData = {
      favoriteId: payload.id,
      favoriteType: payload.type,
    };
    const route = getRoute(ApiUserFavoriteRoute.BASE);
    const { status, data } = await this.client
      .POST<UserFavoriteResponse, any>()
      .setRoute(route)
      .setData(bodyData)
      .setSignal(this.ac.signal)
      .send();

    if (status !== HttpStatus.CREATED) {
      throw new BadResponseError();
    }

    return data;
  }

  public async fetchAllFavorites() {
    const route = getRoute(ApiUserFavoriteRoute.BASE);
    const { status, data } = await this.client
      .GET<UserFavoritesResponse>()
      .setRoute(route)
      .setSignal(this.ac.signal)
      .send();

    if (status !== HttpStatus.OK) {
      throw new BadResponseError();
    }

    return data;
  }

  public async fetchAllFavoritesByType(favoriteType: string) {
    const route = ApiUserFavoriteRoute.TYPE.replace(
      ":favoriteType",
      favoriteType
    );
    const { status, data } = await this.client
      .GET<UserFavoritesResponse>()
      .setRoute(route)
      .setSignal(this.ac.signal)
      .send();

    if (status !== HttpStatus.OK) {
      throw new BadResponseError();
    }

    return data;
  }

  public async deleteFavorite(payload: {
    entityId: string;
    favoriteType: string;
  }) {
    if (!payload.entityId) {
      throw new Error("id missing");
    }
    const bodyData = {
      favoriteType: payload.favoriteType,
    };
    const route = getRoute(ApiUserFavoriteRoute.DELETE, {
      ":entityId": payload.entityId,
    });
    const { status, data } = await this.client
      .DELETE<UserFavoriteResponse, { favoriteType: string }>()
      .setRoute(route)
      // @ts-ignore
      .setData(bodyData)
      .setSignal(this.ac.signal)
      .send();

    if (status !== HttpStatus.OK) {
      throw new BadResponseError();
    }

    return data;
  }
}

export default UserFavoriteClient;
