export class BadRequestError extends Error {
  readonly code: number;

  constructor(message?: string) {
    super(message);
    if (!this.message) {
      this.message = "Bad Request";
    }
    this.name = "BadRequestError";
    this.code = 400;
  }
}
