export class NotFoundError extends Error {
  readonly code: number;

  constructor(message?: string) {
    super(message);
    if (!this.message) {
      this.message = "Not Found";
    }
    this.name = "NotFoundError";
    this.code = 404;
  }
}
