import { BadResponseError } from "../../../errors/bad-response.error";
import RagnaClient from "../../../ragnaClient";
import { getRoute, HttpStatus } from "../../../utils";
import { BaseApiClient } from "../../base/base-api.client";
import { PaginateParams } from "../../interfaces";
import {
  FluxKontextPayload,
  FluxProPayload,
  FluxUltraPayload,
  GoogleImagegenPayload,
  ImageDetailsResponse,
  ImageGenFolderResponse,
  ImageGenPaginatedResponse,
  ImageGenResponse,
} from "./interfaces";

const ApiImageGenRoute = {
  FLUX_PRO: "/text-to-image/flux-pro", // POST
  FLUX_ULTRA: "/text-to-image/flux-ultra", // POST
  FLUX_KONTEXT_PRO: "/text-to-image/flux-kontext-pro", // POST
  FLUX_KONTEXT_MAX: "/text-to-image/flux-kontext-max", // POST
  GOOGLE_IMAGES: "/text-to-image/google-imagegen", // POST
  FOLDERS: "/text-to-image/folders", // GET
  FOLDER_RUNS: "/text-to-image/:id", // GET
  FOLDER_RUNS_PAGINATED: "/text-to-image/:folderId/paginated", // GET
  TOGGLE_HIDE: "/text-to-image/:runId/toggle-hide", // POST
  DOWNLOAD_IMAGE: "/text-to-image/:imageId/download", // GET
  IMAGE_DETAILS: "/text-to-image/:imageId/details", // GET
} as const;

export class TextToImageClient extends BaseApiClient {
  constructor(private readonly client: RagnaClient) {
    super();
  }

  public async generateFluxProImages(payload: FluxProPayload) {
    const route = getRoute(ApiImageGenRoute.FLUX_PRO);
    const response = await this.client
      .POST<ImageGenResponse, FluxProPayload>()
      .setRoute(route)
      .setData(payload)
      .setSignal(this.ac.signal)
      .send();

    if (response.status !== HttpStatus.CREATED) {
      throw new BadResponseError();
    }

    return response.data;
  }

  public async generateFluxUltraImages(payload: FluxUltraPayload) {
    const route = getRoute(ApiImageGenRoute.FLUX_ULTRA);
    const response = await this.client
      .POST<ImageGenResponse, FluxUltraPayload>()
      .setRoute(route)
      .setData(payload)
      .setSignal(this.ac.signal)
      .send();

    if (response.status !== HttpStatus.CREATED) {
      throw new BadResponseError();
    }

    return response.data;
  }

  public async generateFluxKontextProImages(payload: FluxKontextPayload) {
    const route = getRoute(ApiImageGenRoute.FLUX_KONTEXT_PRO);
    const response = await this.client
      .POST<ImageGenResponse, FluxKontextPayload>()
      .setRoute(route)
      .setData(payload)
      .setSignal(this.ac.signal)
      .send();

    if (response.status !== HttpStatus.CREATED) {
      throw new BadResponseError();
    }

    return response.data;
  }

  public async generateFluxKontextMaxImages(payload: FluxKontextPayload) {
    const route = getRoute(ApiImageGenRoute.FLUX_KONTEXT_MAX);
    const response = await this.client
      .POST<ImageGenResponse, FluxKontextPayload>()
      .setRoute(route)
      .setData(payload)
      .setSignal(this.ac.signal)
      .send();

    if (response.status !== HttpStatus.CREATED) {
      throw new BadResponseError();
    }

    return response.data;
  }

  public async generateGoogleImages(payload: GoogleImagegenPayload) {
    const route = getRoute(ApiImageGenRoute.GOOGLE_IMAGES);
    const response = await this.client
      .POST<ImageGenResponse, GoogleImagegenPayload>()
      .setRoute(route)
      .setData(payload)
      .setSignal(this.ac.signal)
      .send();

    if (response.status !== HttpStatus.CREATED) {
      throw new BadResponseError();
    }

    return response.data;
  }

  public async toggleHideRun(payload: { runId: string }) {
    const route = getRoute(ApiImageGenRoute.TOGGLE_HIDE, {
      ":runId": payload.runId,
    });
    const response = await this.client
      .PATCH<ImageGenResponse, typeof payload>()
      .setRoute(route)
      //.setData(payload)
      .setSignal(this.ac.signal)
      .send();

    if (response.status !== HttpStatus.OK) {
      throw new BadResponseError();
    }

    return response.data;
  }

  public async fetchFolders() {
    const route = getRoute(ApiImageGenRoute.FOLDERS);
    const response = await this.client
      .GET<ImageGenFolderResponse>()
      .setRoute(route)
      .setSignal(this.ac.signal)
      .send();

    if (response.status !== HttpStatus.OK) {
      throw new BadResponseError();
    }

    return response.data;
  }

  public async fetchRunsPaginated(
    { folderId }: { folderId: string },
    params: PaginateParams & { showHidden?: boolean }
  ) {
    const route = getRoute(ApiImageGenRoute.FOLDER_RUNS_PAGINATED, {
      ":folderId": folderId,
    });
    const response = await this.client
      .GET<ImageGenPaginatedResponse, PaginateParams>()
      .setRoute(route)
      .setParams(params)
      .setSignal(this.ac.signal)
      .send();

    if (response.status !== HttpStatus.OK) {
      throw new BadResponseError();
    }

    return response.data;
  }

  public async downloadImage(imageId: string) {
    const route = getRoute(ApiImageGenRoute.DOWNLOAD_IMAGE, {
      ":imageId": imageId,
    });
    const response = await this.client
      .GET<Blob>()
      .setResponseType("blob")
      .setRoute(route)
      .setSignal(this.ac.signal)
      .send();

    if (response.status !== HttpStatus.OK) {
      throw new BadResponseError();
    }

    return response.data;
  }

  public async fetchImageDetails(imageId: string) {
    const route = getRoute(ApiImageGenRoute.IMAGE_DETAILS, {
      ":imageId": imageId,
    });
    const response = await this.client
      .GET<ImageDetailsResponse>()
      .setRoute(route)
      .setSignal(this.ac.signal)
      .send();

    if (response.status !== HttpStatus.OK) {
      throw new BadResponseError();
    }

    return response.data;
  }
}

export default TextToImageClient;
