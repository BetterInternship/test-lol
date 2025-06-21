import { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";

interface CustomErrorResponseData {
  error: string;
  status: number;
  message: string;
}

interface CustomAxiosResponse extends AxiosResponse {
  data: CustomErrorResponseData;
}

export interface ErrorResponse extends AxiosError {
  response?: CustomAxiosResponse;
}

export type AxiosResponseData<T> = AxiosResponse<T>;

export type Methods =
  | "GET"
  | "POST"
  | "PUT"
  | "DELETE"
  | "PATCH"
  | "OPTIONS"
  | "HEAD";

export interface BaseResponse {
  status_code: number;
  message?: string;
}

export type ApiMapping = Record<
  string,
  Partial<
    Record<
      Methods,
      {
        pathParams?: unknown;
        params?: unknown;
        body?: unknown;
        response?: unknown;
      }
    >
  >
>;
export type ApiPathParams<
  Mapping extends ApiMapping,
  T extends keyof Mapping,
  M extends keyof Mapping[T],
> = Mapping[T][M] extends { pathParams: infer P } ? P : undefined;

export type ApiRequestParams<
  Mapping extends ApiMapping,
  T extends keyof Mapping,
  M extends keyof Mapping[T],
> = Mapping[T][M] extends { params: infer P } ? P : undefined;

export type ApiRequestBody<
  Mapping extends ApiMapping,
  T extends keyof Mapping,
  M extends keyof Mapping[T],
> = Mapping[T][M] extends { body: infer B } ? B : undefined;

export type ApiResponseData<
  Mapping extends ApiMapping,
  T extends keyof Mapping,
  M extends keyof Mapping[T],
> = Mapping[T][M] extends { response: infer R } ? R : undefined;

export interface ApiRequestProps<
  Mapping extends ApiMapping,
  T extends Extract<keyof Mapping, string>,
  M extends Extract<keyof Mapping[T], Methods>,
> extends Partial<AxiosRequestConfig> {
  baseUrl: string;
  url: T;
  method: M;
  pathParams?: ApiPathParams<Mapping, T, M>;
  params?: ApiRequestParams<Mapping, T, M>;
  data?: ApiRequestBody<Mapping, T, M>;
  headers?: Record<string, string>;
}