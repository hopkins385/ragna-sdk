export class ForbiddenError extends Error {
  readonly code: number;

  constructor(message?: string) {
    super(message);
    this.name = 'ForbiddenError';
    this.code = 403;
  }
}
