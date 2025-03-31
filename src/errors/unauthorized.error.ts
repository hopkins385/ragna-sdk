export class UnauthorizedError extends Error {
  readonly code: number;

  constructor(message?: string) {
    super(message);
    if (!this.message) {
      this.message = "Unauthorized";
    }
    this.name = "UnauthorizedError";
    this.code = 401;
  }
}
