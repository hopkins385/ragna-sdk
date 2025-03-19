export interface CreateWorkflowStepDto {
  assistantId: string;
  name: string;
  description: string;
  orderColumn: number;
  rowCount: number;
}

export interface WorkflowRowItem {
  documentId: string;
  orderColumn: number;
  content: string;
  status: string;
  type: string;
}

export interface CreateWorkflowRowDto {
  items: WorkflowRowItem[];
}
