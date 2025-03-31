export class ConnRefusedError extends Error {
  readonly code: number;

  constructor(message?: string) {
    super(message);
    if (!this.message) {
      this.message = "Connection refused";
    }
    this.name = "ConnRefusedError";
    this.code = 500;
  }
}
