/**
 * @ Author: BetterInternship
 * @ Create Time: 2025-06-15 00:52:43
 * @ Modified time: 2025-06-15 01:12:59
 * @ Description:
 * 
 * Filter implementation utility, so we don't pollute components with classes. 
 */

import { useState } from "react";

interface Filters {
	[filter: string]: string,
}

/**
 * The useFilter hook.
 * Check the returned interface for more info.
 * 
 * @hook
 */
export const useFilter = <T extends Filters>() => {
	const [filters, set_filters] = useState<T>({} as T);

	// Sets and individual filter 
	const set_filter = (filter: keyof T, value: string) => {
		set_filters({ ...filters, [filter]: value });
	}

	// Creates a function that sets the filter
	const filter_setter = (filter: keyof T) => (value: string) => {
		set_filters({ ...filters, [filter]: value });
	}

	return {
		filters,
		set_filter,
		filter_setter,
	}
}