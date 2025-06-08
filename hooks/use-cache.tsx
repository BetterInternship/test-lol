/**
 * @ Author: BetterInternship
 * @ Create Time: 2025-06-09 02:34:48
 * @ Modified time: 2025-06-09 03:17:58
 * @ Description:
 * 
 * Easy interface to interact with localStorage.
 */

type IUseCache = () => {
	get_cache_item: (item: string) => unknown;
	set_cache_item: (item: string, value: unknown) => void;
	del_cache_item: (item: string) => void;
};

const get_cache_item = (item: string) => {
	if (typeof window !== "undefined")
		return JSON.parse(sessionStorage.getItem(item) ?? "null");
};

const set_cache_item = (item: string, value: unknown) => {
	if (typeof window !== "undefined")
		return sessionStorage.setItem(item, JSON.stringify(value));
};

const del_cache_item = (item: string) => {
	if (typeof window !== "undefined") return sessionStorage.removeItem(item);
};

export const useCache: IUseCache = () => {
	return {
		get_cache_item,
		set_cache_item,
		del_cache_item,
	};
};