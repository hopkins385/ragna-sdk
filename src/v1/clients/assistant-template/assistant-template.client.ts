import { BadResponseError } from "../../../errors/bad-response.error";
import RagnaClient from "../../../ragnaClient";
import { getRoute, HttpStatus } from "../../../utils";
import { BaseApiClient } from "../../base/base-api.client";
import { PaginateParams } from "../../interfaces/paginate.interface";
import {
  AssistantTemplateCategoriesResponse,
  AssistantTemplatesPaginatedResponse,
  AssistantTemplatesResponse,
  CategoriesWithTemplatesResponse,
  RandomTemplatesParams,
} from "./interfaces";

const ApiAssistantTemplateRoute = {
  ASSISTANT_TEMPLATE: "/assistant-template", // GET
  ASSISTANT_TEMPLATE_PAGINATED: "/assistant-template/paginated", // GET
  ASSISTANT_TEMPLATE_RANDOM: "/assistant-template/random", // GET
  ASSISTANT_TEMPLATE_ID: "/assistant-template/one/:templateId", // GET
  ASSISTANT_TEMPLATE_BY_CATEGORY:
    "/assistant-template/category/:categoryId/templates", // GET
  ASSISTANT_TEMPLATES_BY_CATEGORY_IDS:
    "/assistant-template/categories/templates", // POST
  ASSISTANT_CATEGORY_ID: "/assistant-template/category/one/:categoryId", // GET
  ASSISTANT_CATEGORY: "/assistant-template/category", // GET
  ASSISTANT_CATEGORY_PAGINATED: "/assistant-template/category/paginated", // GET
} as const;

export class AssistantTemplateClient extends BaseApiClient {
  constructor(private readonly client: RagnaClient) {
    super();
  }

  /**
   * Fetch all assistant templates
   */
  async fetchAllTemplates() {
    const route = getRoute(ApiAssistantTemplateRoute.ASSISTANT_TEMPLATE);
    const { status, data } = await this.client
      .GET<AssistantTemplatesResponse>()
      .setRoute(route)
      .setSignal(this.ac.signal)
      .send();

    if (status !== HttpStatus.OK) {
      throw new BadResponseError();
    }

    return data;
  }

  /**
   * Fetch all assistant templates paginated
   */
  async fetchAllTemplatesPaginated(params: PaginateParams) {
    const route = getRoute(
      ApiAssistantTemplateRoute.ASSISTANT_TEMPLATE_PAGINATED
    );
    const { status, data } = await this.client
      .GET<AssistantTemplatesPaginatedResponse, PaginateParams>()
      .setRoute(route)
      .setParams(params)
      .setSignal(this.ac.signal)
      .send();

    if (status !== HttpStatus.OK) {
      throw new BadResponseError();
    }

    return data;
  }

  /**
   * Fetch random assistant templates
   */
  async fetchRandomTemplates(params: RandomTemplatesParams) {
    const route = getRoute(ApiAssistantTemplateRoute.ASSISTANT_TEMPLATE_RANDOM);
    const { status, data } = await this.client
      .GET<AssistantTemplatesResponse, RandomTemplatesParams>()
      .setRoute(route)
      .setParams(params)
      .setSignal(this.ac.signal)
      .send();

    if (status !== HttpStatus.OK) {
      throw new BadResponseError();
    }

    return data;
  }

  /**
   * Fetch all templates categories
   */
  async fetchAllCategories() {
    const route = getRoute(ApiAssistantTemplateRoute.ASSISTANT_CATEGORY);
    const { status, data } = await this.client
      .GET<AssistantTemplateCategoriesResponse>()
      .setRoute(route)
      .setSignal(this.ac.signal)
      .send();

    if (status !== HttpStatus.OK) {
      throw new BadResponseError();
    }

    return data;
  }

  /**
   * Fetch all templates for a category
   */
  async fetchTemplatesByCategory(categoryId: string) {
    const route = getRoute(
      ApiAssistantTemplateRoute.ASSISTANT_TEMPLATE_BY_CATEGORY,
      {
        ":categoryId": categoryId,
      }
    );
    const { status, data } = await this.client
      .GET<AssistantTemplatesResponse>()
      .setRoute(route)
      .setSignal(this.ac.signal)
      .send();

    if (status !== HttpStatus.OK) {
      throw new BadResponseError();
    }

    return data;
  }

  /**
   * Fetch many templates by many category ids
   */
  async fetchTemplatesByCategoryIds(payload: { categoryIds: string[] }) {
    const route = getRoute(
      ApiAssistantTemplateRoute.ASSISTANT_TEMPLATES_BY_CATEGORY_IDS
    );
    const { status, data } = await this.client
      .POST<CategoriesWithTemplatesResponse, { categoryIds: string[] }>()
      .setRoute(route)
      .setData(payload)
      .setSignal(this.ac.signal)
      .send();

    // The expected status code is HttpStatus.OK in this case.
    if (status !== HttpStatus.OK) {
      throw new BadResponseError();
    }

    return data;
  }
}

export default AssistantTemplateClient;
