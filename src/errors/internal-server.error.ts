export class InternalServerError extends Error {
  readonly code: number;

  constructor(message?: string) {
    super(message);
    if (!this.message) {
      this.message = "Internal Server Error";
    }
    this.name = "InternalServerError";
    this.code = 500;
  }
}
