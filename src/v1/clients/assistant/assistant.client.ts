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

  /**
   * Create a new assistant for a team.
   * @param payload {CreateAssistantPayload} - Payload to create an assistant
   * @returns
   */
  public async createAssistant(payload: CreateAssistantPayload) {
    const route = getRoute(ApiAssistantRoute.BASE);
    const response = await this.client
      .POST<AssistantResponse, CreateAssistantPayload>()
      .setRoute(route)
      .setData(payload)
      .setSignal(this.ac.signal)
      .send();

    if (response.status !== HttpStatus.CREATED) {
      throw new BadResponseError();
    }

    return response.data;
  }

  /**
   * Create a new assistant from a template.
   * @param payload {CreateAssistantFromTemplatePayload} - Payload to create an assistant from a template
   * @returns
   */
  public async createAssistantFromTemplate(
    payload: CreateAssistantFromTemplatePayload
  ) {
    const route = getRoute(ApiAssistantRoute.FROM_TEMPLATE);
    const response = await this.client
      .POST<AssistantResponse, CreateAssistantFromTemplatePayload>()
      .setRoute(route)
      .setData(payload)
      .setSignal(this.ac.signal)
      .send();

    if (response.status !== HttpStatus.CREATED) {
      throw new BadResponseError();
    }

    return response.data;
  }

  /**
   * Fetch an assistant by its ID.
   * @param assistantId {string} - Assistant ID
   * @returns
   */
  public async fetchAssistant(assistantId: string) {
    const route = getRoute(ApiAssistantRoute.ASSISTANT, {
      ":assistantId": assistantId,
    });
    const response = await this.client
      .GET<AssistantResponse>()
      .setRoute(route)
      .setSignal(this.ac.signal)
      .send();

    if (response.status !== HttpStatus.OK) {
      throw new BadResponseError();
    }

    return response.data;
  }

  /**
   * Fetch all assistants of the team with optional pagination and search.
   * @param page {number} - Page number for pagination
   * @param limit {number} - Number of assistants per page
   * @param searchQuery {string} - Optional search query to filter assistants by title
   * @returns
   */
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
    const response = await this.client
      .GET<AssistantsPaginatedResponse, PaginateParams>()
      .setRoute(route)
      .setParams(params)
      .setSignal(this.ac.signal)
      .send();

    if (response.status !== HttpStatus.OK) {
      throw new BadResponseError();
    }

    return response.data;
  }

  /**
   * Update an existing assistant.
   * @param assistantId {string} - Assistant ID
   * @param payload {Partial<CreateAssistantPayload>} - Partial payload to update the assistant
   * @returns
   */
  public async updateAssistant(
    assistantId: string,
    payload: Partial<CreateAssistantPayload>
  ) {
    const route = getRoute(ApiAssistantRoute.ASSISTANT, {
      ":assistantId": assistantId,
    });
    const response = await this.client
      .PATCH<AssistantResponse, Partial<CreateAssistantPayload>>()
      .setRoute(route)
      .setData(payload)
      .setSignal(this.ac.signal)
      .send();

    if (response.status !== HttpStatus.OK) {
      throw new BadResponseError();
    }

    return response.data;
  }

  /**
   * Update the knowledge base status of an assistant.
   * @param assistantId {string} - Assistant ID
   * @param hasKnowledgeBase {boolean} - Whether the assistant has a knowledge base
   * @returns
   */
  public async updateHasKnowledgeBase(
    assistantId: string,
    hasKnowledgeBase: boolean
  ) {
    const route = getRoute(ApiAssistantRoute.HAS_KNOWLEDGE, {
      ":assistantId": assistantId,
    });
    const response = await this.client
      .PATCH<AssistantResponse, { hasKnowledgeBase: boolean }>()
      .setRoute(route)
      .setData({ hasKnowledgeBase })
      .setSignal(this.ac.signal)
      .send();

    if (response.status !== HttpStatus.OK) {
      throw new BadResponseError();
    }

    return response.data;
  }

  /**
   * Delete an assistant by its ID.
   * @param assistantId {string} - Assistant ID
   * @returns
   */
  public async deleteAssistant(assistantId: string) {
    const route = getRoute(ApiAssistantRoute.ASSISTANT, {
      ":assistantId": assistantId,
    });
    const response = await this.client
      .DELETE<AssistantResponse>()
      .setRoute(route)
      .setSignal(this.ac.signal)
      .send();

    if (response.status !== HttpStatus.OK) {
      throw new BadResponseError();
    }

    return response.data;
  }
}

export default AssistantClient;
