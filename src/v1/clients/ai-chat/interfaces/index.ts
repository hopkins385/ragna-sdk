import type { Assistant } from "@/v1/clients/assistant/interfaces";
import type { PaginateMeta } from "v1/interfaces/paginate-meta.interface";

export type InputChatId = string | null | undefined;

export type ChatMessageType = "text" | "tool";
export type ChatMessageRole = "user" | "assistant" | "system" | "tool";

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

export interface ChatMessageContent {
  type: ChatMessageType;
  text: string;
}

export interface ChatMessage {
  type: ChatMessageType;
  role: ChatMessageRole;
  content: ChatMessageContent;
  visionContent?: ChatMessageVisionContent[];
}

export interface ChatsPaginatedResponse {
  chats: Chat[];
  meta: PaginateMeta;
}

export interface ChatResponse {
  chat: Chat;
}

export interface CreateChatPayload {
  assistantId: string;
}

export interface CreateChatMessagePayload {
  chatId: InputChatId;
  message: ChatMessage;
}

export interface CreateChatMessageStreamPayload {
  chatId: InputChatId;
  type: ChatMessage["type"];
  content: ChatMessageContent;
  visionContent?: ChatMessage["visionContent"];
  context?: string;
}

export interface CreateChatStreamPayload {
  chatId: InputChatId;
  chatMessages: ChatMessage[];
  context?: string;
  reasoningEffort?: number;
  maxTokens?: number;
  temperature?: number;
}
