export class CanceledError extends Error {
  readonly code: number;

  constructor(message?: string) {
    super(message);
    if (!this.message) {
      this.message = "Request canceled";
    }
    this.name = "CanceledError";
    this.code = 499;
  }
}
