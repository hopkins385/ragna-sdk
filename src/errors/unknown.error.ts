export class UnknownError extends Error {
  readonly code: number;

  constructor(message?: string) {
    super(message);
    this.name = 'UnknownError';
    this.code = 500;
  }
}
