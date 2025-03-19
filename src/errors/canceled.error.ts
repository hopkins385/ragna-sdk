export class CanceledError extends Error {
  readonly code: number;

  constructor(message?: string) {
    super(message);
    this.name = 'CanceledError';
    this.code = 499;
  }
}
