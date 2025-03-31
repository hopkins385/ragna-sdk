export class ForbiddenError extends Error {
  readonly code: number;

  constructor(message?: string) {
    super(message);
    if (!this.message) {
      this.message = "Forbidden";
    }
    this.name = "ForbiddenError";
    this.code = 403;
  }
}
