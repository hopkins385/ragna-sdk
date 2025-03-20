import { BadRequestError } from "../../../errors/bad-request.error";
import RagnaClient from "../../../ragnaClient";
import { getRoute, HttpStatus } from "../../../utils";
import { BaseApiClient } from "../../base/base-api.client";
import { CollectionAbleModel } from "./interfaces";

const ApiCollectionAbleRoute = {
  ATTACH: "/collection-able/attach", // POST
  DETACH: "/collection-able/detach", // POST
  DETACH_ALL: "/collection-able/detach-all", // POST
  REPLACE: "/collection-able/replace", // POST
} as const;

export class CollectionAbleClient extends BaseApiClient {
  constructor(private readonly client: RagnaClient) {
    super();
  }

  async detachCollectionFrom(
    collectionId: string,
    payload: {
      model: CollectionAbleModel;
    }
  ) {
    const body = {
      model: payload.model,
      collectionId,
    };

    const route = getRoute(ApiCollectionAbleRoute.DETACH);
    const response = await this.client
      .POST<any, { model: CollectionAbleModel; collectionId: string }>()
      .setRoute(route)
      .setData(body)
      .setSignal(this.ac.signal)
      .send();

    if (response.status !== HttpStatus.OK) {
      throw new BadRequestError();
    }

    return response.data;
  }

  async detachAllCollectionsFrom(payload: { model: CollectionAbleModel }) {
    const route = getRoute(ApiCollectionAbleRoute.DETACH_ALL);
    const response = await this.client
      .POST<any, { model: CollectionAbleModel }>()
      .setRoute(route)
      .setData(payload)
      .setSignal(this.ac.signal)
      .send();

    if (response.status !== HttpStatus.OK) {
      throw new BadRequestError();
    }

    return response.data;
  }

  async replaceCollectionTo(
    collectionId: string,
    payload: {
      model: CollectionAbleModel;
    }
  ) {
    const route = getRoute(ApiCollectionAbleRoute.REPLACE);
    const response = await this.client
      .POST<any, { model: CollectionAbleModel; collectionId: string }>()
      .setRoute(route)
      .setData({ model: payload.model, collectionId })
      .setSignal(this.ac.signal)
      .send();

    if (response.status !== HttpStatus.OK) {
      throw new BadRequestError();
    }

    return response.data;
  }
}

export default CollectionAbleClient;
