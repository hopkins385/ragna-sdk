export class ConnRefusedError extends Error {
  readonly code: number;

  constructor(message?: string) {
    super(message);
    this.name = 'ConnRefusedError';
    this.code = 500;
  }
}
