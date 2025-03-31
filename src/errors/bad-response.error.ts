export class BadResponseError extends Error {
  readonly code: number;

  constructor(message?: string) {
    super(message);
    if (!this.message) {
      this.message = "Bad Response";
    }
    this.name = "BadResponseError";
    this.code = 500;
  }
}
