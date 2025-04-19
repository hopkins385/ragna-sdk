import type { AxiosInstance } from "axios";
import axios from "axios";
import { RequestBuilder } from "./http";

export abstract class BaseClient {
  public axiosInstance: AxiosInstance;
  protected baseURL: string;
  protected accessToken?: string | null;
  protected refreshToken: string | null;
  protected timeout: number;

  constructor(options?: { baseURL?: string; timeout?: number }) {
    this.baseURL = options?.baseURL || "https://api.ragna.io";
    this.timeout = options?.timeout || 300000; // 300 seconds = 5 minutes

    this.accessToken = null;
    this.refreshToken = null;

    this.axiosInstance = this._createAxiosInstance(this.baseURL, this.timeout);
  }

  public setTokens(payload: {
    accessToken: string;
    refreshToken: string;
  }): void {
    this.accessToken = payload.accessToken;
    this.refreshToken = payload.refreshToken;
  }

  protected _ensureAuthenticated(): void {
    if (!this.accessToken) {
      throw new Error("Not authenticated. Please login first.");
    }
  }

  protected _createAxiosInstance(
    baseURL: string,
    timeout: number
  ): AxiosInstance {
    const instance = axios.create({
      baseURL: baseURL || "https://api.ragna.io",
      headers: {
        "Content-Type": "application/json",
      },
      timeout,
    });

    return instance;
  }

  #getRequestBuilder<TResponse, TParams = never, TData = never>(
    method: "GET" | "POST" | "PATCH" | "DELETE"
  ): RequestBuilder<TResponse, TParams, TData> {
    return new RequestBuilder<TResponse, TParams, TData>(
      this.axiosInstance,
      method
    );
  }
  public GET<TResponse, TParams = never>(): RequestBuilder<TResponse, TParams> {
    return this.#getRequestBuilder<TResponse, TParams>("GET");
  }
  public POST<TResponse, TData = never>(): RequestBuilder<
    TResponse,
    never,
    TData
  > {
    return this.#getRequestBuilder<TResponse, never, TData>("POST");
  }
  public PATCH<TResponse, TData = never>(): RequestBuilder<
    TResponse,
    never,
    TData
  > {
    return this.#getRequestBuilder<TResponse, never, TData>("PATCH");
  }
  public DELETE<TResponse, TParams = never>(): RequestBuilder<
    TResponse,
    TParams
  > {
    return this.#getRequestBuilder<TResponse, TParams>("DELETE");
  }
}
