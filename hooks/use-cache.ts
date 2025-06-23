/**
 * @ Author: BetterInternship
 * @ Create Time: 2025-06-09 02:34:48
 * @ Modified time: 2025-06-22 20:58:55
 * @ Description:
 *
 * Easy interface to interact with localStorage.
 */

type IUseCache = <T>() => {
  get: (item: string) => T | null;
  set: (item: string, value: T) => void;
  del: (item: string) => void;
};

const get_cache_item =
  <T>() =>
  (item: string): T | null => {
    if (typeof window !== "undefined")
      return JSON.parse(sessionStorage.getItem(item) ?? "null") as T | null;
    return null;
  };

const set_cache_item =
  <T>() =>
  (item: string, value: T): void => {
    if (typeof window !== "undefined")
      return sessionStorage.setItem(item, JSON.stringify(value));
  };

const del_cache_item =
  <T>() =>
  (item: string): void => {
    if (typeof window !== "undefined") return sessionStorage.removeItem(item);
  };

export const useCache: IUseCache = <T>() => {
  return {
    get: get_cache_item<T>(),
    set: set_cache_item<T>(),
    del: del_cache_item<T>(),
  };
};
