import { AxiosError, CanceledError } from 'axios';

export class BaseApiClient {
  protected ac: AbortController;
  // protected api: HttpRequestBuilder<any, any, any>;

  constructor() {
    // this.api = httpRequestBuilder;
    this.ac = new AbortController();
  }

  /**
   * Handle the error from the request
   */
  protected handleError(err: unknown) {
    if (err instanceof DOMException && err.name === 'AbortError') {
      console.warn('DOM: Request was aborted');
      return;
    }
    if (
      err instanceof CanceledError ||
      (err instanceof AxiosError && err.message === 'AbortError')
    ) {
      console.warn('Axios: Request was aborted');
      return;
    }
    if (err instanceof Error) {
      throw err;
    }
    console.error(err);
    throw new Error('Unknown error occurred');
  }

  /**
   * Abort the current request
   */
  public abortRequest() {
    this.ac.abort();
    this.ac = new AbortController();
  }

  public getAbortController(): AbortController {
    return this.ac;
  }
  public getAbortSignal(): AbortSignal {
    return this.ac.signal;
  }
  public getAbortStatus(): boolean {
    return this.ac.signal.aborted;
  }
  public getAbortReason(): string | null {
    return this.ac.signal.reason;
  }
  public getAbortError(): Error | null {
    if (this.ac.signal.aborted) {
      return new Error(this.ac.signal.reason);
    }
    return null;
  }
}
