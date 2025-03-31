export class UnknownError extends Error {
  readonly code: number;

  constructor(message?: string) {
    super(message);
    if (!this.message) {
      this.message = "Unknown Error";
    }
    this.name = "UnknownError";
    this.code = 500;
  }
}
