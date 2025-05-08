import { filterService } from '$lib/services/filters/filterService';
import type { FilterKey, FilterValue, TokenParams } from '$lib/types';
import { derived, get, writable } from 'svelte/store';
import { loadTokens } from './tokenStore';

// Core state
export const filterParams = writable<TokenParams>({});
export const searchQuery = writable('');
export const filterMode = writable<'ui' | 'cli'>('ui');

// Derived stores
export const activeFilters = derived(filterParams, ($params) => {
  return filterService.convertParamsToFilterItems($params);
});

export const queryString = derived(filterParams, ($params) => {
  return filterService.generateQueryString($params);
});

// Actions
export function initializeFilters(initialParams: TokenParams) {
  filterParams.set(initialParams);
  searchQuery.set(filterService.generateQueryString(initialParams));
}

export function switchFilterMode(mode: 'ui' | 'cli') {
  filterMode.set(mode);

  // When switching to CLI mode, set the search query from params
  if (mode === 'cli') {
    searchQuery.set(get(queryString));
  }
}

export function updateQueryString(query: string) {
  searchQuery.set(query);

  const parsedParams = filterService.parseQueryString(query);
  if (parsedParams) {
    filterParams.set(parsedParams);
  }
}

export function addFilter(key: FilterKey, value: FilterValue) {
  console.log('Adding filter:', key, value);
  filterParams.update((params) => filterService.addFilter(params, key, value));

  // Update CLI search query if in CLI mode
  if (get(filterMode) === 'cli') {
    searchQuery.set(get(queryString));
  }
  if (get(filterMode) === 'ui') {
    executeSearch();
  }
}

export function removeFilter(key: FilterKey, value?: FilterValue) {
  filterParams.update((params) => filterService.removeFilter(params, key, value));

  // Update CLI search query if in CLI mode
  if (get(filterMode) === 'cli') {
    searchQuery.set(get(queryString));
  }
  if (get(filterMode) === 'ui') {
    executeSearch();
  }
}

export function clearFilters() {
  filterParams.set({});
  searchQuery.set('');
  loadTokens({});
}

export function executeSearch() {
  loadTokens(get(filterParams));
}
