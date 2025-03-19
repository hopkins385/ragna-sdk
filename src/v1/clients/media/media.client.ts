import { BadResponseError } from "../../../errors/bad-response.error";
import RagnaClient from "../../../ragnaClient";
import { getRoute, HttpStatus } from "../../../utils";
import { BaseApiClient } from "../../base/base-api.client";
import { PaginateParams } from "../../interfaces/paginate.interface";

const ApiMediaRoute = {
  UPLOAD: "/upload",
  BASE: "/media", // POST
  MEDIA: "/media/:mediaId", // GET, PATCH, DELETE
  FOR: "/media/for", // POST
  FOR_PAGINATE: "/media/for/paginate", // POST
} as const;

export class MediaClient extends BaseApiClient {
  constructor(private readonly client: RagnaClient) {
    super();
  }

  public async uploadFiles(files: File[], vision: boolean = false) {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append("file", file, encodeURIComponent(file.name));
    });
    // add to form vision key
    formData.append("vision", vision.toString());

    const route = getRoute(ApiMediaRoute.UPLOAD);
    const { status, data } = await this.client
      .POST<any, FormData>()
      .setHeaders({
        "Content-Type": "multipart/form-data",
      })
      .setRoute(route)
      .setData(formData)
      .setSignal(this.ac.signal)
      .send();

    if (status !== HttpStatus.CREATED) {
      throw new BadResponseError();
    }

    return data;
  }

  public async fetchAllMediaFor(
    model: {
      id: string;
      type: any;
    },
    params: PaginateParams
  ) {
    const bodyData = {
      model: {
        id: model.id,
        type: model.type,
      },
    };
    const route = getRoute(ApiMediaRoute.FOR_PAGINATE);
    const { status, data } = await this.client
      //@ts-ignore
      .POST<any, PaginateParams, { model: { id: string; type: any } }>()
      .setRoute(route)
      //@ts-ignore
      .setParams(params)
      //@ts-ignore
      .setData(bodyData)
      .setSignal(this.ac.signal)
      .send();

    if (status !== HttpStatus.OK) {
      throw new BadResponseError();
    }

    return data;
  }

  public async deleteMedia(mediaId: string) {
    const route = getRoute(ApiMediaRoute.MEDIA, { ":mediaId": mediaId });
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

export default MediaClient;
