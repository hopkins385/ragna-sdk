export class InternalServerError extends Error {
  readonly code: number;

  constructor(message?: string) {
    super(message);
    this.name = 'InternalServerError';
    this.code = 500;
  }
}
