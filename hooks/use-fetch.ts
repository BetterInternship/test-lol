/**
 * @ Author: BetterInternship
 * @ Create Time: 2025-06-17 18:04:08
 * @ Modified time: 2025-06-17 19:22:48
 * @ Description:
 *
 * Feature for abstracting fetches on component mount.
 */

import { useEffect, useState } from "react";

const DEFAULT_ERROR = "Something went wrong.";

// All responses from the BetterInternship API server will extend this interface
export interface FetchResponse {
  success?: boolean;
  message?: string;
}

/**
 * Executes a fetch when the returned trigger is called.
 * Simplifies state management and reduces useEffect clutter.
 *
 * @param fetch_callback
 */
export const useFetchOnTrigger = <T extends FetchResponse>(
  fetch_callback: (...args: any[]) => Promise<T>
) => {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);

  /**
   * Executes the fetch
   *
   * @returns
   */
  const fetch_data_safely = async (...args: any[]) => {
    try {
      const response: T = await fetch_callback(...args);
      if (!response.success) {
        setData(null);
        setError(response.message ?? DEFAULT_ERROR);
      } else setData(response);
      setLoading(false);
      return response;
    } catch (error: any) {
      setData(null);
      setError(error);
      setLoading(false);
      return null;
    }
  };

  return {
    data,
    loading,
    error,
    message,
    clear_error: () => setError(""),
    clear_message: () => setMessage(""),
    trigger: (...args: any[]) => fetch_data_safely(...args),
  };
};

/**
 * A way to clean up fetch calls instead of putting them around useEffects.
 * Also cleans up useState calls for loading and error stuff.
 *
 * @param fetch_callback
 * @param args
 * @param deps
 * @returns
 */
export const useFetchOnStateChange = <T extends FetchResponse>(
  fetch_callback: (...args: any[]) => Promise<T>,
  args: any[],
  deps: any[]
) => {
  // Internal state
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);

  // ! TO FIX: make sure that all fetches have a signal option
  /**
   * A wrapper around the fetch
   *
   * @returns
   */
  const fetch_data_safely = async () => {
    try {
      const response: T = await fetch_callback(...args);
      if (!response.success) {
        setData(null);
        setError(response.message ?? DEFAULT_ERROR);
      } else setData(response);
      setLoading(false);
      return response;
    } catch (error: any) {
      setData(null);
      // No need to display error if it was aborted
      if (error.name === "AbortError") console.warn("Fetch aborted");
      else setError(error);
      setLoading(false);
      return null;
    }
  };

  /**
   * Performs the fetch when dependencies change.
   * Only does so when dependencies are truthy.
   */
  useEffect(() => {
    setError("");
    setMessage("");
    setLoading(true);

    // Makes sure that the fetch is cancelled on reload
    const controller = new AbortController();
    const signal = controller.signal;

    // Fetch if all dependencies are truthy
    if (!deps.some((dep) => !dep)) fetch_data_safely();

    return () => {
      controller.abort();
    };
  }, [...deps]);

  return {
    data,
    loading,
    error,
    message,
    clear_error: () => setError(""),
    clear_message: () => setMessage(""),
  };
};
