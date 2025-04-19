import RagnaClient from "../../../ragnaClient";
import { getRoute, HttpStatus } from "../../../utils";
import { BaseApiClient } from "../../base/base-api.client";
import {
  ICreateWorkflow,
  IReCreateWorkflowFromMedia,
  UpdateWorkflowDto,
  WorkflowResponse,
  WorkflowsPaginatedResponse,
} from "./interfaces";

const ApiWorkflowRoute = {
  BASE: "/workflow",
  WORKFLOW: "/workflow/:workflowId", // GET, PATCH, DELETE
  WORKFLOW_FULL: "/workflow/:workflowId/full",
  WORKFLOW_ROW: "/workflow/:workflowId/row", // DELETE
  EXECUTE: "/workflow/:workflowId/execute",
  EXECUTE_STEP: "/workflow/:id/step/:stepId/execute",
  EXPORT: "/workflow/:workflowId/export",
} as const;

export class WorkflowClient extends BaseApiClient {
  constructor(private readonly client: RagnaClient) {
    super();
  }

  public async createWorkflow(payload: ICreateWorkflow) {
    const route = getRoute(ApiWorkflowRoute.BASE);
    const response = await this.client
      .POST<WorkflowResponse, ICreateWorkflow>()
      .setRoute(route)
      .setData(payload)
      .setSignal(this.ac.signal)
      .send();

    if (response.status !== HttpStatus.CREATED) {
      throw new Error("Failed to create workflow");
    }

    return response.data;
  }

  public async reCreateWorkflowFromMedia(payload: IReCreateWorkflowFromMedia) {
    throw new Error("Not implemented");
  }

  public async fetchWorkflow(workflowId: string) {
    const route = getRoute(ApiWorkflowRoute.WORKFLOW, {
      ":workflowId": workflowId,
    });
    const response = await this.client
      .GET<WorkflowResponse>()
      .setRoute(route)
      .setSignal(this.ac.signal)
      .send();

    if (response.status !== HttpStatus.OK) {
      throw new Error("Failed to fetch workflow");
    }

    return response.data;
  }

  public async fetchFullWorkflow(workflowId: string) {
    const route = getRoute(ApiWorkflowRoute.WORKFLOW_FULL, {
      ":workflowId": workflowId,
    });
    const response = await this.client
      .GET<WorkflowResponse>()
      .setRoute(route)
      .setSignal(this.ac.signal)
      .send();

    if (response.status !== HttpStatus.OK) {
      throw new Error("Failed to fetch workflow");
    }

    return response.data;
  }

  public async fetchWorkflows() {
    throw new Error("Not implemented");
    /*try {
        const route = getRoute(WorkflowRoute.BASE);
        const response = await $axios.get<WorkflowsResponse>(route, {
          signal: ac.signal,
        });

        if (response.status !== HttpStatus.OK) {
          throw new Error('Response not ok');
        }

        return response.data;
      } catch (error: any) {
        throw new WorkflowServiceError(
          error.status ?? 500,
          'Failed to fetch workflows',
        );
      }*/
  }

  public async fetchWorkflowsPaginated() {
    const route = getRoute(ApiWorkflowRoute.BASE);
    const response = await this.client
      .GET<WorkflowsPaginatedResponse>()
      .setRoute(route)
      .setSignal(this.ac.signal)
      .send();

    if (response.status !== HttpStatus.OK) {
      throw new Error("Failed to fetch workflows");
    }

    return response.data;
  }

  public async fetchWorkflowSettings(workflowId: string) {
    throw new Error("Not implemented");
  }

  public async updateWorkflow(
    workflowId: string,
    payload: Partial<UpdateWorkflowDto>
  ) {
    const route = getRoute(ApiWorkflowRoute.WORKFLOW, {
      ":workflowId": workflowId,
    });
    const response = await this.client
      .PATCH<WorkflowResponse, Partial<UpdateWorkflowDto>>()
      .setRoute(route)
      .setData(payload)
      .setSignal(this.ac.signal)
      .send();

    if (response.status !== HttpStatus.OK) {
      throw new Error("Failed to update workflow");
    }

    return response.data;
  }

  public async deleteWorkflow(workflowId: string) {
    const route = getRoute(ApiWorkflowRoute.WORKFLOW, {
      ":workflowId": workflowId,
    });

    const response = await this.client
      .DELETE<WorkflowResponse>()
      .setRoute(route)
      .setSignal(this.ac.signal)
      .send();

    if (response.status !== HttpStatus.OK) {
      throw new Error("Failed to delete workflow");
    }

    return response.data;
  }

  public async deleteWorkflowRows(workflowId: string, orderColumns: number[]) {
    const route = getRoute(ApiWorkflowRoute.WORKFLOW_ROW, {
      ":workflowId": workflowId,
    });
    const response = await this.client
      .PATCH<never, { orderColumns: number[] }>()
      .setRoute(route)
      .setData({ orderColumns })
      .setSignal(this.ac.signal)
      .send();

    if (response.status !== HttpStatus.OK) {
      throw new Error("Failed to delete workflow rows");
    }

    return response.data;
  }

  public async exportWorkflow(workflowId: string, format: string) {
    const route = getRoute(ApiWorkflowRoute.EXPORT, {
      ":workflowId": workflowId,
    });
    const response = await this.client
      .GET<Blob>()
      .setRoute(route)
      .setResponseType("blob")
      .setSignal(this.ac.signal)
      .send();

    if (response.status !== HttpStatus.OK) {
      throw new Error("Failed to export workflow");
    }

    return response.data;
  }

  public async clearAllRows(workflowId: string) {
    throw new Error("Not implemented");
  }

  public async executeWorkflow(workflowId: string) {
    const route = getRoute(ApiWorkflowRoute.EXECUTE, {
      ":workflowId": workflowId,
    });
    const response = await this.client
      .POST<WorkflowResponse>()
      .setRoute(route)
      .setSignal(this.ac.signal)
      .send();

    if (response.status !== HttpStatus.CREATED) {
      throw new Error("Failed to execute workflow");
    }

    return response.data;
  }

  public async executeWorkflowStep({
    workflowId,
    stepId,
  }: {
    workflowId: string;
    stepId: string;
  }) {
    const route = getRoute(ApiWorkflowRoute.EXECUTE_STEP, {
      ":id": workflowId,
      ":stepId": stepId,
    });
    const response = await this.client
      .POST<WorkflowResponse>()
      .setRoute(route)
      .setSignal(this.ac.signal)
      .send();

    if (response.status !== HttpStatus.CREATED) {
      throw new Error("Failed to execute workflow");
    }

    return response.data;
  }
}

export default WorkflowClient;
