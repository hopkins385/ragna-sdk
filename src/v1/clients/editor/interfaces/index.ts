export interface PromptCompletionPayload {
  context: string;
  selectedText: string;
  prompt: string;
}

export interface PromptCompletionResponse {
  completion: string;
}

export interface InlineCompletionPayload {}

export interface InlineCompletionResponse {
  inlineCompletion: string;
}
