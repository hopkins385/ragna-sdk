import { PaginateMeta } from "../../../interfaces";

export interface ICreateWorkflow {
  name: string;
  description: string;
}

export interface IReCreateWorkflowFromMedia {
  workflowId: string;
  mediaId: string;
}

export interface UpdateWorkflowDto {
  name: string;
  description: string;
}

export interface Workflow {
  id: string;
  name: string;
  description: string;
  steps: any[];
}

export interface WorkflowResponse {
  workflow: Workflow;
}

export interface WorkflowsResponse {
  workflows: Workflow[];
}

export interface WorkflowsPaginatedResponse {
  workflows: Workflow[];
  meta: PaginateMeta;
}
