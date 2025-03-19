import { BadRequestError } from "../../../errors/bad-request.error";
import { BadResponseError } from "../../../errors/bad-response.error";
import RagnaClient from "../../../ragnaClient";
import { getRoute, HttpStatus } from "../../../utils";
import { BaseApiClient } from "../../base/base-api.client";
import { PaginateParams } from "../../interfaces";
import { CollectionAbleModel } from "../collection-able/interfaces";
import {
  CollectionResponse,
  CollectionsPaginatedResponse,
  CollectionsResponse,
  CreateCollectionPayload,
  EditCollectionPayload,
} from "./interfaces";

const ApiCollectionRoute = {
  BASE: "/collection",
  COLLECTION: "/collection/:collectionId", // GET, PATCH, DELETE
  ALL: "/collection/all",
  FOR: "/collection/for",
} as const;

export class CollectionClient extends BaseApiClient {
  constructor(private readonly client: RagnaClient) {
    super();
  }

  public async createCollection(payload: CreateCollectionPayload) {
    const route = getRoute(ApiCollectionRoute.BASE);
    const { status, data } = await this.client
      .POST<CollectionResponse, CreateCollectionPayload>()
      .setRoute(route)
      .setData(payload)
      .setSignal(this.ac.signal)
      .send();

    if (status !== HttpStatus.CREATED) {
      throw new BadResponseError();
    }

    return data;
  }

  public async editCollection(
    collectionId: string,
    payload: EditCollectionPayload
  ) {
    if (!collectionId) {
      throw new BadRequestError("Collection ID is required");
    }
    const route = getRoute(ApiCollectionRoute.COLLECTION, {
      ":collectionId": collectionId,
    });
    const { status, data } = await this.client
      .PATCH<CollectionResponse, EditCollectionPayload>()
      .setRoute(route)
      .setData(payload)
      .setSignal(this.ac.signal)
      .send();

    if (status !== HttpStatus.OK) {
      throw new BadResponseError();
    }

    return data;
  }

  public async fetchFirst(collectionId: string) {
    if (!collectionId) {
      throw new BadRequestError("Collection ID is required");
    }
    const route = getRoute(ApiCollectionRoute.COLLECTION, {
      ":collectionId": collectionId,
    });
    const { status, data } = await this.client
      .GET<CollectionResponse>()
      .setRoute(route)
      .setSignal(this.ac.signal)
      .send();

    if (status !== HttpStatus.OK) {
      throw new BadResponseError();
    }

    return data;
  }

  public async fetchAll() {
    const route = getRoute(ApiCollectionRoute.ALL);
    const { status, data } = await this.client
      .GET<CollectionsResponse>()
      .setRoute(route)
      .setSignal(this.ac.signal)
      .send();

    if (status !== HttpStatus.OK) {
      throw new BadResponseError();
    }

    return data;
  }

  public async fetchAllPaginated(params: PaginateParams) {
    const route = getRoute(ApiCollectionRoute.BASE);
    const { status, data } = await this.client
      .GET<CollectionsPaginatedResponse, PaginateParams>()
      .setRoute(route)
      .setParams(params)
      .setSignal(this.ac.signal)
      .send();

    if (status !== HttpStatus.OK) {
      throw new BadResponseError();
    }

    return data;
  }

  public async fetchAllCollectionsFor(payload: { model: CollectionAbleModel }) {
    const route = getRoute(ApiCollectionRoute.FOR);
    const { status, data } = await this.client
      .POST<CollectionsResponse, { model: CollectionAbleModel }>()
      .setRoute(route)
      .setData(payload)
      .setSignal(this.ac.signal)
      .send();

    if (status !== HttpStatus.OK) {
      throw new BadResponseError();
    }

    return data;
  }

  public async deleteCollection(collectionId: string) {
    if (!collectionId) {
      throw new BadRequestError("Collection ID is required");
    }
    const route = getRoute(ApiCollectionRoute.COLLECTION, {
      ":collectionId": collectionId,
    });
    const { status, data } = await this.client
      .DELETE<CollectionResponse>()
      .setRoute(route)
      .setSignal(this.ac.signal)
      .send();

    if (status !== HttpStatus.OK) {
      throw new BadResponseError();
    }

    return data;
  }
}

export default CollectionClient;
