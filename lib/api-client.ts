// API configuration and helper funcs
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
if (!API_BASE_URL) console.warn("[WARNING]: Base API URL is not set.");

// Helper function for api routes
export const APIRoute = (() => {
  interface Params {
    [key: string]: any;
  }

  // Generates a parameter string for query urls
  const search_params = (params: Params) => {
    const search_params = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "")
        search_params.append(key, value.toString());
    });
    return search_params.toString();
  };

  class APIRouteClass {
    routes: string[];
    params: Params | null;

    constructor(base: string) {
      this.routes = [base];
      this.params = null;
    }

    // Adds a subroute
    r(...route: string[]) {
      route.map((r) => this.routes.push(r));
      return this;
    }

    // Adds a list of params
    p(params: Params) {
      this.params = params;
      return this;
    }

    build() {
      if (!this.params) return `${API_BASE_URL}/${this.routes.join("/")}`;
      return `${API_BASE_URL}/${this.routes.join("/")}?${search_params(
        this.params
      )}`;
    }
  }

  return (route: string) => new APIRouteClass(route);
})();

// HTTP client with auth handling
class FetchClient {
  /**
   * Request utility we can reuse
   *
   * @param url
   * @param options
   * @param type
   * @returns
   */
  private async request<T>(
    url: string,
    options: RequestInit = {},
    type: string = "json"
  ): Promise<T> {
    const headers: HeadersInit =
      type === "json"
        ? {
            "Content-Type": "application/json",
            ...options.headers,
          }
        : { ...options.headers };

    const config: RequestInit = {
      ...options,
      credentials: "include",
      headers,
    };

    try {
      const response = await fetch(url, config);
      if (!response.ok && response.status !== 304) {
        const errorData = await response.json().catch(() => ({}));
        console.warn(`${url}: ${errorData.message || response.status}`);
        return { error: errorData.message } as T;
      }

      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        return (await response.json()) as unknown as T;
      }
      return (await response.text()) as unknown as T;
    } catch (error) {
      console.error("API request failed:", error);
      throw error;
    }
  }

  async get<T>(url: string): Promise<T> {
    return this.request<T>(url, { method: "GET" });
  }

  async post<T>(url: string, data?: any, type: string = "json"): Promise<T> {
    return this.request<T>(
      url,
      {
        method: "POST",
        body: data
          ? type === "json"
            ? JSON.stringify(data)
            : data
          : undefined,
      },
      type
    );
  }

  async put<T>(url: string, data?: any): Promise<T> {
    return this.request<T>(url, {
      method: "PUT",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T>(url: string): Promise<T> {
    return this.request<T>(url, { method: "DELETE" });
  }

  async uploadFile<T>(url: string, formData: FormData): Promise<T> {
    const headers: HeadersInit = {};
    const config: RequestInit = {
      method: "POST",
      headers,
      body: formData,
    };

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || `HTTP error! status: ${response.status}`
        );
      }

      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        return await response.json();
      }

      return (await response.text()) as unknown as T;
    } catch (error) {
      console.error("File upload failed:", error);
      throw error;
    }
  }
}

export const APIClient = new FetchClient();

// API response types
export interface ApiResponse<T> {
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  totalPages: number;
  currentPage: number;
  total: number;
}

// Error handling
export class ApiError extends Error {
  constructor(message: string, public status?: number, public code?: string) {
    super(message);
    this.name = "ApiError";
  }
}
