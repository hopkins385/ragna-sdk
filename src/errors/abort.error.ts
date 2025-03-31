export class RequestAbortError extends Error {
  readonly code: number;

  constructor(message?: string) {
    super(message);
    if (!this.message) {
      this.message = "Request aborted";
    }
    this.name = "AbortError";
    this.code = 499;
  }
}
