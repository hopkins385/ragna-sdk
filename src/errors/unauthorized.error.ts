export class UnauthorizedError extends Error {
  readonly code: number;

  constructor(message?: string) {
    super(message);
    this.name = 'UnauthorizedError';
    this.code = 401;
  }
}
