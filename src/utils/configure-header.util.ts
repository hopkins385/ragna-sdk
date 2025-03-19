import type { AxiosRequestConfig } from "axios";

export function configureAuthorizationHeader(
  config: AxiosRequestConfig,
  token: string
) {
  if (!config.headers) {
    config.headers = {};
  }
  config.headers.Authorization = `Bearer ${token}`;
}
