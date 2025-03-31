export class ConnectionError extends Error {
  readonly code: number;

  constructor(message?: string) {
    super(message);
    if (!this.message) {
      this.message = "Connection Error";
    }
    this.name = "ConnectionError";
    this.code = 500;
  }
}
