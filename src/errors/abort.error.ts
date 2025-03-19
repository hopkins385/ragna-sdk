export class RequestAbortError extends Error {
  readonly code: number;

  constructor(message?: string) {
    super(message);
    this.name = 'AbortError';
    this.code = 499;
  }
}
