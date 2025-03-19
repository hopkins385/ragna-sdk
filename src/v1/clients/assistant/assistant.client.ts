import { BadResponseError } from "../../../errors/bad-response.error";
import RagnaClient from "../../../ragnaClient";
import { getRoute, HttpStatus } from "../../../utils";
import { BaseApiClient } from "../../base/base-api.client";
import { PaginateParams } from "../../interfaces";
import {
  AssistantResponse,
  AssistantsPaginatedResponse,
  CreateAssistantFromTemplatePayload,
  CreateAssistantPayload,
} from "./interfaces";

const ApiAssistantRoute = {
  BASE: "/assistant", // GET, POST
  ASSISTANT: "/assistant/:assistantId", // GET, PATCH, DELETE
  HAS_KNOWLEDGE: "/assistant/:assistantId/has-knowledge", // PATCH
  FROM_TEMPLATE: "/assistant/from-template", // POST
};

export class AssistantClient extends BaseApiClient {
  constructor(private readonly client: RagnaClient) {
    super();
  }

  public async createAssistant(payload: CreateAssistantPayload) {
    const route = getRoute(ApiAssistantRoute.BASE);
    const { status, data } = await this.client
      .POST<AssistantResponse, CreateAssistantPayload>()
      .setRoute(route)
      .setData(payload)
      .setSignal(this.ac.signal)
      .send();

    if (status !== HttpStatus.CREATED) {
      throw new BadResponseError();
    }

    return data;
  }

  public async createAssistantFromTemplate(
    payload: CreateAssistantFromTemplatePayload
  ) {
    const route = getRoute(ApiAssistantRoute.FROM_TEMPLATE);
    const { status, data } = await this.client
      .POST<AssistantResponse, CreateAssistantFromTemplatePayload>()
      .setRoute(route)
      .setData(payload)
      .setSignal(this.ac.signal)
      .send();

    if (status !== HttpStatus.CREATED) {
      throw new BadResponseError();
    }

    return data;
  }

  public async fetchAssistant(assistantId: string) {
    const route = getRoute(ApiAssistantRoute.ASSISTANT, {
      ":assistantId": assistantId,
    });
    const { status, data } = await this.client
      .GET<AssistantResponse>()
      .setRoute(route)
      .setSignal(this.ac.signal)
      .send();

    if (status !== HttpStatus.OK) {
      throw new BadResponseError();
    }

    return data;
  }

  public async fetchAllAssistants({
    page,
    limit,
    searchQuery,
  }: {
    page: number;
    limit?: number;
    searchQuery?: string;
  }) {
    const params = {
      page,
      limit: limit ?? undefined,
      searchQuery: searchQuery ?? undefined,
    };
    const route = getRoute(ApiAssistantRoute.BASE);
    const { status, data } = await this.client
      .GET<AssistantsPaginatedResponse, PaginateParams>()
      .setRoute(route)
      .setParams(params)
      .setSignal(this.ac.signal)
      .send();

    if (status !== HttpStatus.OK) {
      throw new BadResponseError();
    }

    return data;
  }

  public async updateAssistant(
    assistantId: string,
    payload: Partial<CreateAssistantPayload>
  ) {
    const route = getRoute(ApiAssistantRoute.ASSISTANT, {
      ":assistantId": assistantId,
    });
    const { status, data } = await this.client
      .PATCH<AssistantResponse, Partial<CreateAssistantPayload>>()
      .setRoute(route)
      .setData(payload)
      .setSignal(this.ac.signal)
      .send();

    if (status !== HttpStatus.OK) {
      throw new BadResponseError();
    }

    return data;
  }

  public async updateHasKnowledgeBase(
    assistantId: string,
    hasKnowledgeBase: boolean
  ) {
    const route = getRoute(ApiAssistantRoute.HAS_KNOWLEDGE, {
      ":assistantId": assistantId,
    });
    const { status, data } = await this.client
      .PATCH<AssistantResponse, { hasKnowledgeBase: boolean }>()
      .setRoute(route)
      .setData({ hasKnowledgeBase })
      .setSignal(this.ac.signal)
      .send();

    if (status !== HttpStatus.OK) {
      throw new BadResponseError();
    }

    return data;
  }

  public async deleteAssistant(assistantId: string) {
    const route = getRoute(ApiAssistantRoute.ASSISTANT, {
      ":assistantId": assistantId,
    });
    const { status, data } = await this.client
      .DELETE<AssistantResponse>()
      .setRoute(route)
      .setSignal(this.ac.signal)
      .send();

    if (status !== HttpStatus.OK) {
      throw new BadResponseError();
    }

    return data;
  }
}

export default AssistantClient;
