import { BaseApiClient } from "../../base/base-api.client";
import RagnaClient from "../../../ragnaClient";
import { getRoute, HttpStatus } from "../../../utils";
import {
  AllRecordsResponse,
  CreateRecordDto,
  RecordsPaginatedResponse,
} from "./interfaces";
import { BadResponseError } from "../../../errors/bad-response.error";
import { PaginateParams } from "../../interfaces/paginate.interface";

const ApiRecordRoute = {
  BASE: "/record",
  RECORD: "/record/:recordId",
  ALL_RECORDS: "/record/:collectionId",
  ALL_RECORDS_PAGINATED: "/record/:collectionId/paginated",
} as const;

export class RecordClient extends BaseApiClient {
  constructor(private readonly client: RagnaClient) {
    super();
  }

  public async fetchAll(payload: { collectionId: string }) {
    const route = getRoute(ApiRecordRoute.ALL_RECORDS, {
      ":collectionId": payload.collectionId,
    });
    const { status, data } = await this.client
      .GET<AllRecordsResponse>()
      .setRoute(route)
      .setSignal(this.ac.signal)
      .send();

    if (status !== HttpStatus.OK) {
      throw new BadResponseError();
    }

    return data;
  }

  public async fetchAllPaginated(payload: {
    collectionId: string;
    params: PaginateParams;
  }) {
    const route = getRoute(ApiRecordRoute.ALL_RECORDS_PAGINATED, {
      ":collectionId": payload.collectionId,
    });
    const { status, data } = await this.client
      .GET<RecordsPaginatedResponse, PaginateParams>()
      .setRoute(route)
      .setParams(payload.params)
      .setSignal(this.ac.signal)
      .send();

    if (status !== HttpStatus.OK) {
      throw new BadResponseError();
    }

    return data;
  }

  public async createRecord(payload: CreateRecordDto) {
    const route = getRoute(ApiRecordRoute.BASE);
    const { status, data } = await this.client
      .POST<any, CreateRecordDto>()
      .setRoute(route)
      .setData(payload)
      .setSignal(this.ac.signal)
      .send();

    if (status !== HttpStatus.CREATED) {
      throw new BadResponseError();
    }

    return data;
  }

  public async deleteRecord(recordId: string) {
    const route = getRoute(ApiRecordRoute.RECORD, { ":recordId": recordId });
    const { status, data } = await this.client
      .DELETE<any>()
      .setRoute(route)
      .setSignal(this.ac.signal)
      .send();

    if (status !== HttpStatus.OK) {
      throw new BadResponseError();
    }

    return data;
  }
}

export default RecordClient;
