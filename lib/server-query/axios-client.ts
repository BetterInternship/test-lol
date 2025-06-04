import axios from "axios";
import {
  ApiMapping,
  ApiPathParams,
  ApiRequestProps,
  ApiResponseData,
  ErrorResponse,
  Methods,
} from "@/types";

const apiClient = (url: string) => {
  return axios.create({
    baseURL: url,
    timeout: 5000,
  });
};

function resolveUrlWithParams<
  Mapping extends ApiMapping,
  T extends Extract<keyof Mapping, string>,
  M extends Extract<keyof Mapping[T], Methods>,
>(url: T, pathParams?: ApiPathParams<Mapping, T, M>): string {
  if (!pathParams) {
    return url;
  }

  let resolvedUrl = url as string;
  for (const key in pathParams) {
    if (pathParams.hasOwnProperty(key)) {
      const placeholder = `:${key}`;
      if (resolvedUrl.includes(placeholder)) {
        resolvedUrl = resolvedUrl.replace(placeholder, String(pathParams[key]));
      } else {
        console.warn(`Placeholder ${placeholder} not found in URL ${url}`);
      }
    }
  }
  return resolvedUrl;
}

async function makeApiRequest<
  Mapping extends ApiMapping,
  T extends Extract<keyof Mapping, string>,
  M extends Extract<keyof Mapping[T], Methods>,
>({
  baseUrl,
  url,
  method,
  headers,
  pathParams,
  params,
  data,
  ...config
}: ApiRequestProps<Mapping, T, M>): Promise<{
  data: ApiResponseData<Mapping, T, M> | null;
  error: ErrorResponse | null;
}> {
  const resolvedUrl = resolveUrlWithParams<Mapping, T, M>(url, pathParams);

  // Use your API client with the provided baseUrl
  const client = apiClient(baseUrl);
  const req = {
    url: `${resolvedUrl}`,
    method,
    params,
    data: data || {},
    headers,
    ...config,
  };
  try {
    const response = await client(req);
    return { data: response.data, error: null };
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      return { data: null, error: error as ErrorResponse }; // Cast to your custom ErrorResponse
    } else {
      return {
        data: null,
        error: {
          message: "An unexpected error occurred",
          isAxiosError: () => false,
        } as never,
      };
    }
  }
}

function createApiClient<Mapping extends ApiMapping>(
  baseUrl: string,
  headers: Record<string, string> = {},
) {
  return async function request<
    T extends Extract<keyof Mapping, string>,
    M extends Extract<keyof Mapping[T], Methods>,
  >(props: Omit<ApiRequestProps<Mapping, T, M>, "baseUrl">) {
    const mergedHeaders = {
      ...headers,
      ...(props.headers || {}),
    };
    return makeApiRequest<Mapping, T, M>({
      baseUrl,
      ...props,
      headers: mergedHeaders,
    });
  };
}

export default createApiClient;