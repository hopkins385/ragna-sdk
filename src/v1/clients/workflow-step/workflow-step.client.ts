import { BadResponseError } from "../../../errors/bad-response.error";
import RagnaClient from "../../../ragnaClient";
import { getRoute, HttpStatus } from "../../../utils";
import { BaseApiClient } from "../../base/base-api.client";
import { CreateWorkflowRowDto, CreateWorkflowStepDto } from "./interfaces";

const ApiWorkflowStepRoute = {
  BASE: "/workflow-step",
  ROW: "/workflow-step/row",
  STEP: "/workflow-step/:workflowStepId",
  INPUT_STEPS: "/workflow-step/:workflowStepId/input-steps",
  STEP_ASSISTANT: "/workflow-step/:workflowStepId/assistant",
  ITEM: "/workflow-step/:stepId/item/:itemId",
} as const;

export class WorkflowStepClient extends BaseApiClient {
  constructor(private readonly client: RagnaClient) {
    super();
  }

  public async createWorkflowStep(
    workflowId: string,
    payload: CreateWorkflowStepDto
  ) {
    const bodyData = {
      workflowId,
      ...payload,
    };

    const route = getRoute(ApiWorkflowStepRoute.BASE);
    const { status, data } = await this.client
      .POST<any, CreateWorkflowStepDto>()
      .setRoute(route)
      .setData(bodyData)
      .setSignal(this.ac.signal)
      .send();

    if (status !== HttpStatus.CREATED) {
      throw new BadResponseError();
    }

    return data;
  }

  public async createWorkflowRow(
    workflowId: string,
    payload: CreateWorkflowRowDto
  ) {
    const bodyData = {
      workflowId,
      items: payload.items,
    };

    const route = getRoute(ApiWorkflowStepRoute.ROW);
    const { status, data } = await this.client
      .POST<any, CreateWorkflowRowDto>()
      .setRoute(route)
      .setData(bodyData)
      .setSignal(this.ac.signal)
      .send();

    if (status !== HttpStatus.CREATED) {
      throw new BadResponseError();
    }

    return data;
  }

  public async updateInputSteps(
    workflowStepId: string,
    payload: { inputStepIds: string[] }
  ) {
    // const bodyData = {
    //   ...payload,
    // };
    const route = getRoute(ApiWorkflowStepRoute.INPUT_STEPS, {
      ":workflowStepId": workflowStepId,
    });
    const { status, data } = await this.client
      .PATCH<any, { inputStepIds: string[] }>()
      .setRoute(route)
      .setData(payload)
      .setSignal(this.ac.signal)
      .send();

    if (status !== HttpStatus.OK) {
      throw new BadResponseError();
    }

    return data;
  }

  public async updateWorkflowStep(
    workflowId: string,
    payload: { name?: string }
  ) {
    const bodyData = {
      name: payload.name,
    };

    const route = getRoute(ApiWorkflowStepRoute.STEP, {
      ":workflowStepId": workflowId,
    });
    const { status, data } = await this.client
      .PATCH<any, { name?: string }>()
      .setRoute(route)
      .setData(bodyData)
      .setSignal(this.ac.signal)
      .send();

    if (status !== HttpStatus.OK) {
      throw new BadResponseError();
    }

    return data;
  }

  public async updateWorkflowStepAssistant(
    workflowStepId: string,
    payload: { assistantId: string }
  ) {
    const bodyData = {
      assistantId: payload.assistantId,
    };

    const route = getRoute(ApiWorkflowStepRoute.STEP_ASSISTANT, {
      ":workflowStepId": workflowStepId,
    });
    const { status, data } = await this.client
      .PATCH<any, { assistantId: string }>()
      .setRoute(route)
      .setData(bodyData)
      .setSignal(this.ac.signal)
      .send();

    if (status !== HttpStatus.OK) {
      throw new BadResponseError();
    }

    return data;
  }

  public async deleteWorkflowStep(workflowStepId: string) {
    const route = getRoute(ApiWorkflowStepRoute.STEP, {
      ":workflowStepId": workflowStepId,
    });
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

  public async updateItemContent({
    stepId,
    itemId,
    content,
  }: {
    stepId: string;
    itemId: string;
    content: string;
  }) {
    if (!stepId || !itemId) {
      throw new Error("Invalid stepId or itemId");
    }
    const route = getRoute(ApiWorkflowStepRoute.ITEM, {
      ":stepId": stepId,
      ":itemId": itemId,
    });
    const bodyData = {
      itemContent: content,
    };

    const { status, data } = await this.client
      .PATCH<any, { itemContent: string }>()
      .setRoute(route)
      .setData(bodyData)
      .setSignal(this.ac.signal)
      .send();

    if (status !== HttpStatus.OK) {
      throw new BadResponseError();
    }

    return data;
  }
}

export default WorkflowStepClient;
