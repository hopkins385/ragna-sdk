export class BaseApiClient {
  protected ac: AbortController;

  constructor() {
    this.ac = new AbortController();
  }

  /**
   * Abort the current request.
   * @returns
   */
  public abortRequest() {
    this.ac.abort();
    this.ac = new AbortController();
  }

  /**
   * Get the current AbortController.
   * @returns
   */
  public getAbortController(): AbortController {
    return this.ac;
  }
  /**
   * Get the current AbortSignal.
   * @returns
   */
  public getAbortSignal(): AbortSignal {
    return this.ac.signal;
  }
  /**
   * Check if the request has been aborted.
   * @returns
   */
  public getAbortStatus(): boolean {
    return this.ac.signal.aborted;
  }
  /**
   * Get the reason for the abort.
   * @returns
   */
  public getAbortReason(): string | null {
    return this.ac.signal.reason;
  }
  /**
   * Get an instance of Error with the abort reason.
   * @returns
   */
  public getAbortError(): Error | null {
    if (this.ac.signal.aborted) {
      return new Error(this.ac.signal.reason);
    }
    return null;
  }
}
