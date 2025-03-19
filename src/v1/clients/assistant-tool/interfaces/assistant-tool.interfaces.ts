export interface AssistantTool {
  id: string;
  toolId: string;
  name: string;
  description?: string | null;
  iconName?: string | null;
}

export interface AssistantToolResponse {
  tools: AssistantTool[];
}
