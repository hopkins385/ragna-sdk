import type { Assistant } from "@/v1/clients/assistant/interfaces";
import type { PaginateMeta } from "v1/interfaces/paginate-meta.interface";

export type InputChatId = string | null | undefined;

export interface Chat {
  id: string;
  title: string;
  assistant?: Assistant;
  messages?: ChatMessage[];
  createdAt: string;
  updatedAt: string;
}

export interface VisionImageUrlContent {
  type: string;
  url: string;
}

export type ChatMessageVisionContent = VisionImageUrlContent;

export interface ChatMessage {
  type: "text" | "image";
  role: "user" | "assistant";
  content: string;
  visionContent?: ChatMessageVisionContent[];
}

export interface ChatsPaginatedResponse {
  chats: Chat[];
  meta: PaginateMeta;
}

export interface ChatResponse {
  chat: Chat;
}

export interface CreateChatMessagePayload {
  chatId: InputChatId;
  message: ChatMessage;
}

export interface CreateChatMessageStreamPayload {
  chatId: InputChatId;
  type: ChatMessage["type"];
  content: ChatMessage["content"];
  visionContent?: ChatMessage["visionContent"];
  context?: string;
  // model?: string; // deprecated
  // provider?: string; // deprecated
}

export interface CreateChatStreamPayload {
  chatId: InputChatId;
  chatMessages: ChatMessage[];
  context?: string;
  reasoningEffort?: number;
  maxTokens?: number;
  temperature?: number;
  // provider?: string; // deprecated
  // model?: string; // deprecated
}
