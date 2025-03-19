export class ConnectionError extends Error {
  readonly code: number;

  constructor(message?: string) {
    super(message);
    this.name = 'ConnectionError';
    this.code = 500;
  }
}
