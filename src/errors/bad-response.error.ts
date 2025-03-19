export class BadResponseError extends Error {
  readonly code: number;

  constructor(message?: string) {
    super(message);
    this.name = 'BadResponseError';
    this.code = 500;
  }
}
