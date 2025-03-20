import { BadResponseError } from "../../../errors/bad-response.error";
import RagnaClient from "../../../ragnaClient";
import { getRoute, HttpStatus } from "../../../utils";
import { BaseApiClient } from "../../base/base-api.client";
import {
  InlineCompletionPayload,
  InlineCompletionResponse,
  PromptCompletionPayload,
  PromptCompletionResponse,
} from "./interfaces";

const ApiEditorRoute = {
  PROMPT_COMPLETION: "/editor/completion",
  INLINE_COMPLETION: "/editor/inline-completion",
} as const;

export class EditorClient extends BaseApiClient {
  constructor(private readonly client: RagnaClient) {
    super();
  }

  async fetchPromptCompletion(payload: PromptCompletionPayload) {
    this.abortRequest();
    const route = getRoute(ApiEditorRoute.PROMPT_COMPLETION);
    const response = await this.client
      .POST<PromptCompletionResponse, PromptCompletionPayload>()
      .setRoute(route)
      .setSignal(this.ac.signal)
      .setData(payload)
      .send();

    if (response.status !== HttpStatus.CREATED) {
      throw new BadResponseError();
    }

    return response.data;
  }

  async fetchInlineCompletion({ context }: any) {
    this.abortRequest();
    const route = getRoute(ApiEditorRoute.INLINE_COMPLETION);
    const response = await this.client
      .POST<InlineCompletionResponse, InlineCompletionPayload>()
      .setRoute(route)
      .setSignal(this.ac.signal)
      .setData(context)
      .send();

    if (response.status !== HttpStatus.CREATED) {
      throw new BadResponseError();
    }

    return response.data;
  }
}

export default EditorClient;
