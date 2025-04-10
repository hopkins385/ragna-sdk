export class ConflictError extends Error {
  readonly code: number;

  constructor(message?: string) {
    super(message);
    if (!this.message) {
      this.message = "Conflict";
    }
    this.name = "ConfilctError";
    this.code = 409;
  }
}
