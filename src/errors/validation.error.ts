export class ValidationError extends Error {
  readonly code: number;

  constructor(message?: string) {
    super(message);
    this.name = 'ValidationError';
    this.code = 422;
  }
}
