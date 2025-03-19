import type { AssistantTool } from "v1/clients/assistant-tool/interfaces/assistant-tool.interfaces";
import type { PaginateMeta } from "v1/interfaces/paginate-meta.interface";

export interface AssistantLLM {
  id: string;
  provider: string;
  displayName: string;
  apiName: string;
  multiModal: boolean;
  capabilities: {
    imageInput: boolean;
    audioInput: boolean;
    videoInput: boolean;
    textOutput: boolean;
    imageOutput: boolean;
    audioOutput: boolean;
    videoOutput: boolean;
  };
}

export interface Assistant {
  id: string;
  teamId: string;
  llmId: string;
  title: string;
  description: string;
  systemPrompt: string;
  isShared: boolean;
  hasKnowledgeBase: boolean;
  hasWorkflow: boolean;
  systemPromptTokenCount: number;
  tools: AssistantTool[];
  llm: AssistantLLM;
  createdAt: string;
  updatedAt: string;
}

export interface AssistantsPaginatedResponse {
  assistants: Assistant[];
  meta: PaginateMeta;
}

export interface AssistantResponse {
  assistant: Assistant;
}

export interface CreateAssistantPayload {
  teamId: string;
  llmId: string;
  title: string;
  description: string;
  systemPrompt: string;
  isShared: boolean;
  hasKnowledgeBase: boolean;
  hasWorkflow: boolean;
  tools: string[];
}

export interface CreateAssistantFromTemplatePayload {
  templateId: string;
  language: "de" | "en";
}
