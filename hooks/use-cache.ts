/**
 * @ Author: BetterInternship
 * @ Create Time: 2025-06-09 02:34:48
 * @ Modified time: 2025-06-24 04:55:51
 * @ Description:
 *
 * Easy interface to interact with localStorage.
 */

type IUseCache = <T>(key: string) => {
  get_cache: () => T | null;
  set_cache: (value: T) => void;
  del_cache: () => void;
};

const get_cache_item =
  <T>(item: string) =>
  (): T | null => {
    if (typeof window !== "undefined")
      return JSON.parse(sessionStorage.getItem(item) ?? "null") as T | null;
    return null;
  };

const set_cache_item =
  <T>(item: string) =>
  (value: T): void => {
    if (typeof window !== "undefined")
      return sessionStorage.setItem(item, JSON.stringify(value));
  };

const del_cache_item =
  <T>(item: string) =>
  (): void => {
    if (typeof window !== "undefined") return sessionStorage.removeItem(item);
  };

export const useCache: IUseCache = <T>(key: string) => {
  return {
    get_cache: get_cache_item<T>(key),
    set_cache: set_cache_item<T>(key),
    del_cache: del_cache_item<T>(key),
  };
};
