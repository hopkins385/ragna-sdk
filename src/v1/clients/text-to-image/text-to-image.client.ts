import { BadResponseError } from "../../../errors/bad-response.error";
import RagnaClient from "../../../ragnaClient";
import { getRoute, HttpStatus } from "../../../utils";
import { BaseApiClient } from "../../base/base-api.client";
import { PaginateParams } from "../../interfaces";
import {
  FluxProPayload,
  FluxUltraPayload,
  ImageGenFolderResponse,
  ImageGenPaginatedResponse,
  ImageGenResponse,
} from "./interfaces";

const ApiImageGenRoute = {
  FLUX_PRO: "/text-to-image/flux-pro", // POST
  FLUX_ULTRA: "/text-to-image/flux-ultra", // POST
  FOLDERS: "/text-to-image/folders", // GET
  FOLDER_RUNS: "/text-to-image/:id", // GET
  FOLDER_RUNS_PAGINATED: "/text-to-image/:folderId/paginated", // GET
  TOGGLE_HIDE: "/text-to-image/:runId/toggle-hide", // POST
  DOWNLOAD_IMAGE: "/text-to-image/:imageId/download", // GET
} as const;

export class TextToImageClient extends BaseApiClient {
  constructor(private readonly client: RagnaClient) {
    super();
  }

  public async generateFluxProImages(payload: FluxProPayload) {
    const bodyData = {
      ...payload,
      safety_tolerance: 4,
    };

    const route = getRoute(ApiImageGenRoute.FLUX_PRO);
    const { status, data } = await this.client
      .POST<ImageGenResponse, FluxProPayload>()
      .setRoute(route)
      .setData(bodyData)
      .setSignal(this.ac.signal)
      .send();

    if (status !== HttpStatus.CREATED) {
      throw new BadResponseError();
    }

    return data;
  }

  public async generateFluxUltraImages(payload: FluxUltraPayload) {
    const bodyData = {
      ...payload,
      safety_tolerance: 4,
    };

    const route = getRoute(ApiImageGenRoute.FLUX_ULTRA);
    const { status, data } = await this.client
      .POST<ImageGenResponse, FluxUltraPayload>()
      .setRoute(route)
      .setData(bodyData)
      .setSignal(this.ac.signal)
      .send();

    if (status !== HttpStatus.CREATED) {
      throw new BadResponseError();
    }

    return data;
  }

  public async toggleHideRun(payload: { runId: string }) {
    const route = getRoute(ApiImageGenRoute.TOGGLE_HIDE, {
      ":runId": payload.runId,
    });
    const { status, data } = await this.client
      .PATCH<ImageGenResponse, typeof payload>()
      .setRoute(route)
      //.setData(payload)
      .setSignal(this.ac.signal)
      .send();

    if (status !== HttpStatus.OK) {
      throw new BadResponseError();
    }

    return data;
  }

  public async fetchFolders() {
    const route = getRoute(ApiImageGenRoute.FOLDERS);
    const { status, data } = await this.client
      .GET<ImageGenFolderResponse>()
      .setRoute(route)
      .setSignal(this.ac.signal)
      .send();

    if (status !== HttpStatus.OK) {
      throw new BadResponseError();
    }

    return data;
  }

  public async fetchRunsPaginated(
    { folderId }: { folderId: string },
    params: PaginateParams & { showHidden?: boolean }
  ) {
    const route = getRoute(ApiImageGenRoute.FOLDER_RUNS_PAGINATED, {
      ":folderId": folderId,
    });
    const { status, data } = await this.client
      .GET<ImageGenPaginatedResponse, PaginateParams>()
      .setRoute(route)
      .setParams(params)
      .setSignal(this.ac.signal)
      .send();

    if (status !== HttpStatus.OK) {
      throw new BadResponseError();
    }

    return data;
  }

  public async downloadImage(imageId: string) {
    const route = getRoute(ApiImageGenRoute.DOWNLOAD_IMAGE, {
      ":imageId": imageId,
    });
    const { status, data } = await this.client
      .GET<Blob>()
      .setResponseType("blob")
      .setRoute(route)
      .setSignal(this.ac.signal)
      .send();

    if (status !== HttpStatus.OK) {
      throw new BadResponseError();
    }

    return data;
  }
}

export default TextToImageClient;
