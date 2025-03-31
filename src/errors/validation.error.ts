export class ValidationError extends Error {
  readonly code: number;

  constructor(message?: string) {
    super(message);
    if (!this.message) {
      this.message = "Validation Error";
    }
    this.name = "ValidationError";
    this.code = 422;
  }
}
