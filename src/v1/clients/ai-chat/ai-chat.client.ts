import type {
  Chat,
  ChatMessage,
  ChatResponse,
  ChatsPaginatedResponse,
  CreateChatMessagePayload,
  CreateChatStreamPayload,
  InputChatId,
} from "./interfaces";
import { AiChatClientError } from "./error/ai-chat.error";
import RagnaClient from "ragnaClient";
import { AxiosError } from "axios";
import { BaseApiClient } from "../../base/base-api.client";
import { getRoute, HttpStatus } from "../../../utils";
import { BadResponseError } from "../../../errors/bad-response.error";
import { BadRequestError } from "../../../errors/bad-request.error";
import { RequestAbortError } from "../../../errors/abort.error";
import { ConnectionError } from "../../../errors/connection.error";
import { PaginateParams } from "../../interfaces/paginate.interface";

const ApiChatRoute = {
  BASE: "/chat", // POST
  CHAT: "/chat/:chatId", // GET, PATCH, DELETE
  CHAT_ALL: "/chat/all", // GET
  CHAT_STREAM: "/chat-stream/:chatId", // POST
  CHAT_HISTORY: "/chat/history", // GET
  CHAT_LATEST: "/chat/latest", // GET
  CHAT_MESSAGE: "/chat/:chatId/message", // POST
  CHAT_MESSAGES: "/chat/:chatId/messages", // DELETE
} as const;

const DEFAULT_MAX_TOKENS = 4000;
const DEFAULT_TEMPERATURE = 80;
const DEFAULT_REASONING_EFFORT = 0;

export class AiChatClient extends BaseApiClient {
  constructor(private readonly client: RagnaClient) {
    super();
  }

  public async createChat(payload: {
    assistantId: string;
  }): Promise<ChatResponse> {
    const route = getRoute(ApiChatRoute.BASE);
    const response = await this.client
      .POST<ChatResponse, { assistantId: string }>()
      .setRoute(route)
      .setData(payload)
      .setSignal(this.ac.signal)
      .send();

    if (response.status !== HttpStatus.CREATED) {
      throw new BadResponseError();
    }

    return response.data;
  }

  public async createChatMessage(
    payload: CreateChatMessagePayload
  ): Promise<ChatMessage> {
    if (!payload.chatId || !payload.message) {
      throw new BadRequestError();
    }
    const route = getRoute(ApiChatRoute.CHAT_MESSAGE, {
      ":chatId": payload.chatId,
    });
    const response = await this.client
      .POST<ChatMessage, { message: ChatMessage }>()
      .setRoute(route)
      .setData({ message: payload.message })
      .setSignal(this.ac.signal)
      .send();

    if (response.status !== HttpStatus.CREATED) {
      throw new BadResponseError();
    }

    return response.data;
  }

  public async createChatStream(
    payload: CreateChatStreamPayload
  ): Promise<ReadableStream<Uint8Array>> {
    if (!payload.chatId) {
      throw new Error("Chat ID is required");
    }
    const streamRoute = getRoute(ApiChatRoute.CHAT_STREAM, {
      ":chatId": payload.chatId,
    });
    const body = {
      messages: payload.chatMessages,
      context: payload.context,
      reasoningEffort: payload.reasoningEffort || DEFAULT_REASONING_EFFORT,
      maxTokens: payload.maxTokens || DEFAULT_MAX_TOKENS,
      temperature: payload.temperature || DEFAULT_TEMPERATURE,
    };

    try {
      const response = await this.client.axiosInstance.post<
        ReadableStream<Uint8Array>
      >(streamRoute, body, {
        signal: this.ac.signal,
        headers: {
          Accept: "text/event-stream",
        },
        responseType: "stream",
        adapter: "fetch",
      });

      if (response.status !== HttpStatus.OK) {
        throw new BadResponseError(`Response not ok: ${response.statusText}`);
      }

      if (!(response.data instanceof ReadableStream)) {
        throw new BadResponseError("Response is not a readable stream");
      }

      return response.data;
      //
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        if (error.name === "AbortError") {
          throw new RequestAbortError();
        }
        if (error.code === "ERR_NETWORK") {
          throw new ConnectionError();
        }
        if (error.code === "ERR_CANCELED") {
          throw new RequestAbortError();
        }
      }
      if (error instanceof Error) {
        if (error.name === "AbortError") {
          throw new RequestAbortError();
        }
      }
      throw error;
    }
  }

  async fetchChatById(chatId: InputChatId): Promise<ChatResponse> {
    if (!chatId) {
      throw new AiChatClientError("Chat ID is required");
    }
    const route = getRoute(ApiChatRoute.CHAT, { ":chatId": chatId });
    const response = await this.client
      .GET<ChatResponse>()
      .setRoute(route)
      .setSignal(this.ac.signal)
      .send();

    if (response.status !== HttpStatus.OK) {
      throw new BadResponseError();
    }

    return response.data;
  }

  public async fetchAllChats(): Promise<Chat[]> {
    const route = getRoute(ApiChatRoute.CHAT_ALL);
    const response = await this.client
      .GET<Chat[]>()
      .setRoute(route)
      .setSignal(this.ac.signal)
      .send();

    if (response.status !== HttpStatus.OK) {
      throw new BadResponseError();
    }

    return response.data;
  }

  public async fetchAllChatsPaginated(
    params: PaginateParams
  ): Promise<ChatsPaginatedResponse> {
    const route = getRoute(ApiChatRoute.CHAT_HISTORY);
    const response = await this.client
      .GET<ChatsPaginatedResponse, PaginateParams>()
      .setRoute(route)
      .setParams(params)
      .setSignal(this.ac.signal)
      .send();

    if (response.status !== HttpStatus.OK) {
      throw new BadResponseError();
    }

    return response.data;
  }

  public async fetchLatestChat(): Promise<ChatResponse> {
    const route = getRoute(ApiChatRoute.CHAT_LATEST);
    const response = await this.client
      .GET<ChatResponse>()
      .setRoute(route)
      .setSignal(this.ac.signal)
      .send();

    if (response.status !== HttpStatus.OK) {
      throw new BadResponseError();
    }

    return response.data;
  }

  public async deleteAllChatMessages(payload: { chatId: InputChatId }) {
    if (!payload.chatId) {
      throw new AiChatClientError("Chat ID is required");
    }
    const route = getRoute(ApiChatRoute.CHAT_MESSAGES, {
      ":chatId": payload.chatId,
    });
    const response = await this.client
      .DELETE()
      .setRoute(route)
      .setSignal(this.ac.signal)
      .send();

    if (response.status !== HttpStatus.OK) {
      throw new BadResponseError();
    }

    return;
  }

  public async deleteChat(payload: { chatId: InputChatId }) {
    if (!payload.chatId) {
      throw new AiChatClientError("Chat ID is required");
    }
    const route = getRoute(ApiChatRoute.CHAT, { ":chatId": payload.chatId });
    const response = await this.client
      .DELETE()
      .setRoute(route)
      .setSignal(this.ac.signal)
      .send();

    if (response.status !== HttpStatus.OK) {
      throw new BadResponseError();
    }

    return;
  }
}

export default AiChatClient;
