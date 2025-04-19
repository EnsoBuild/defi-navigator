<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { debounce } from '../debounce';
  import type { Token } from '../types';

  export let tokens: Token[] = [];
  export let placeholder: string = 'Filter tokens (e.g. symbol:AUSDC chain:1 apy>5)...';

  // Search state
  let searchQuery: string = '';
  let isSearching: boolean = false;

  const dispatch = createEventDispatcher();

  // Create debounced search function
  const debouncedSearch: (query: string) => void = debounce((query: string) => {
    performSearch(query);
  }, 1000);

  // Parse search query and apply filters
  function performSearch(query: string): void {
    if (!query.trim()) {
      dispatch('searchResults', { results: tokens, query: '' });
      return;
    }

    isSearching = true;

    try {
      const filters = parseSearchQuery(query);
      const results = filterTokens(tokens, filters);

      // Apply sorting if specified in filters
      if (filters.sortBy && filters.sortOrder) {
        sortTokens(results, filters.sortBy, filters.sortOrder);
      }

      dispatch('searchResults', {
        results,
        query: query,
        filters
      });
    } catch (error) {
      console.error('Search error:', error);
      dispatch('searchError', { error });
    } finally {
      isSearching = false;
    }
  }

  // Sort tokens based on specified field and order
  function sortTokens(tokens: Token[], field: string, order: 'asc' | 'desc'): void {
    tokens.sort((a, b) => {
      // Handle null/undefined values (push them to the end regardless of sort order)
      if (a[field] === null || a[field] === undefined) return 1;
      if (b[field] === null || b[field] === undefined) return -1;

      const valueA = a[field];
      const valueB = b[field];

      if (order === 'asc') {
        return valueA < valueB ? -1 : valueA > valueB ? 1 : 0;
      } else {
        return valueA > valueB ? -1 : valueA < valueB ? 1 : 0;
      }
    });
  }

  // Handle search input
  function handleSearchInput(): void {
    debouncedSearch(searchQuery);
  }

  // Clear search
  function clearSearch(): void {
    searchQuery = '';
    dispatch('searchResults', { results: tokens, query: '' });
  }

  // Parse search query into structured filters
  function parseSearchQuery(query: string) {
    const filters: { [key: string]: any } = {};

    // Regular search terms (without operators) will be used for name/symbol search
    let generalTerms: string[] = [];

    // Extract specific filters with regex patterns
    const patterns = [
      { regex: /symbol:([^\s]+)/g, key: 'symbol' },
      { regex: /name:([^\s]+)/g, key: 'name' },
      { regex: /chain:(\d+)/g, key: 'chainId' },
      { regex: /address:([^\s]+)/g, key: 'address' },
      { regex: /primary:([^\s]+)/g, key: 'primaryAddress' },
      { regex: /underlying:([^\s]+)/g, key: 'underlying' },
      { regex: /project:([^\s]+)/g, key: 'project' },
      { regex: /protocol:([^\s]+)/g, key: 'protocolSlug' },
      { regex: /type:([^\s]+)/g, key: 'type' },
      { regex: /apy[><]=?(\d+\.?\d*)/g, key: 'apy' },
      { regex: /tvl[><]=?(\d+\.?\d*)/g, key: 'tvl' },
      // New sort patterns
      { regex: /apy:sort:(asc|desc)/g, key: 'apySort' },
      { regex: /tvl:sort:(asc|desc)/g, key: 'tvlSort' }
    ];

    // Clean up the query for processing
    let processedQuery = query.trim() + ' '; // Add space to help with regex matching

    // Extract specific filters
    patterns.forEach((pattern) => {
      const matches = [...processedQuery.matchAll(pattern.regex)];

      if (matches.length > 0) {
        if (pattern.key === 'underlying') {
          if (!filters.underlyingTokens) {
            filters.underlyingTokens = [];
          }
          matches.forEach((match) => {
            filters.underlyingTokens.push(match[1]);
          });
        } else if (pattern.key === 'apy' || pattern.key === 'tvl') {
          // Handle comparison operators
          matches.forEach((match) => {
            const fullMatch = match[0];
            const value = parseFloat(match[1]);

            if (fullMatch.includes('>')) {
              filters[`${pattern.key}From`] = value;
            } else if (fullMatch.includes('<')) {
              filters[`${pattern.key}To`] = value;
            } else {
              // Exact match
              filters[pattern.key] = value;
            }
          });
        } else if (pattern.key === 'apySort' || pattern.key === 'tvlSort') {
          // Handle sort directives
          const field = pattern.key.replace('Sort', '');
          const order = matches[0][1] as 'asc' | 'desc';

          filters.sortBy = field;
          filters.sortOrder = order;
        } else {
          // For simple filters, use the last match if multiple exist
          filters[pattern.key] = matches[matches.length - 1][1];

          // Convert chainId to number
          if (pattern.key === 'chainId') {
            filters[pattern.key] = parseInt(filters[pattern.key]);
          }
        }

        // Remove matched patterns from query
        matches.forEach((match) => {
          processedQuery = processedQuery.replace(match[0], '');
        });
      }
    });

    // Any remaining terms are used for general search
    generalTerms = processedQuery
      .trim()
      .split(/\s+/)
      .filter((term) => term.length > 0);

    if (generalTerms.length > 0) {
      filters.generalTerms = generalTerms;
    }

    return filters;
  }

  // Apply filters to tokens
  function filterTokens(allTokens: Token[], filters: { [key: string]: any }): Token[] {
    if (Object.keys(filters).length === 0) return allTokens;

    // Make a copy of filters without sort-related properties for filtering
    const filtersCopy = { ...filters };
    delete filtersCopy.sortBy;
    delete filtersCopy.sortOrder;

    if (Object.keys(filtersCopy).length === 0) return allTokens;

    return allTokens.filter((token) => {
      // Check each filter condition
      for (const [key, value] of Object.entries(filtersCopy)) {
        switch (key) {
          case 'symbol':
            if (!token.symbol?.toLowerCase().includes(value.toLowerCase())) {
              return false;
            }
            break;

          case 'name':
            if (!token.name?.toLowerCase().includes(value.toLowerCase())) {
              return false;
            }
            break;

          case 'chainId':
            if (token.chainId !== value) {
              return false;
            }
            break;

          case 'address':
            if (!token.address.toLowerCase().includes(value.toLowerCase())) {
              return false;
            }
            break;

          case 'primaryAddress':
            if (!token.primaryAddress?.toLowerCase().includes(value.toLowerCase())) {
              return false;
            }
            break;

          case 'underlyingTokens':
            // Check if token has all the specified underlying tokens
            for (const address of value) {
              const hasUnderlyingToken = token.underlyingTokens?.some((ut) =>
                ut.address.toLowerCase().includes(address.toLowerCase())
              );
              if (!hasUnderlyingToken) {
                return false;
              }
            }
            break;

          case 'project':
            if (token.project?.toLowerCase() !== value.toLowerCase()) {
              return false;
            }
            break;

          case 'protocolSlug':
            if (token.protocolSlug?.toLowerCase() !== value.toLowerCase()) {
              return false;
            }
            break;

          case 'type':
            if (token.type.toLowerCase() !== value.toLowerCase()) {
              return false;
            }
            break;

          case 'apyFrom':
            if (token.apy === null || token.apy === undefined || token.apy < value) {
              return false;
            }
            break;

          case 'apyTo':
            if (token.apy === null || token.apy === undefined || token.apy > value) {
              return false;
            }
            break;

          case 'tvlFrom':
            if (token.tvl === null || token.tvl === undefined || token.tvl < value) {
              return false;
            }
            break;

          case 'tvlTo':
            if (token.tvl === null || token.tvl === undefined || token.tvl > value) {
              return false;
            }
            break;

          case 'generalTerms':
            // Search in multiple fields
            const termMatches = value.some((term: string) => {
              return (
                (token.name && token.name.toLowerCase().includes(term.toLowerCase())) ||
                (token.symbol && token.symbol.toLowerCase().includes(term.toLowerCase())) ||
                token.address.toLowerCase().includes(term.toLowerCase())
              );
            });

            if (!termMatches) {
              return false;
            }
            break;
        }
      }

      // If all filters pass, include the token
      return true;
    });
  }
</script>

<div class="search-wrapper">
  <div class="search-help">
    <button class="help-button" on:click={() => dispatch('showHelp')}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        ><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"
        ></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg
      >
      Filters
    </button>
  </div>
  <div class="search-input-wrapper">
    <input
      type="text"
      class="search-input"
      bind:value={searchQuery}
      on:input={handleSearchInput}
      {placeholder}
      aria-label="Filter tokens"
    />

    <div class="search-icon">
      {#if searchQuery.length > 0}
        <button class="clear-button" on:click={clearSearch} aria-label="Clear search">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            ><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"
            ></line></svg
          >
        </button>
      {:else}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          ><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"
          ></line></svg
        >
      {/if}
    </div>

    {#if isSearching}
      <div class="search-spinner"></div>
    {/if}
  </div>
</div>

<style>
  .search-wrapper {
    flex: 2;
    min-width: 0; /* Prevents overflow issues */
    display: flex;
    flex-direction: column;
    /* width: 100%; */
    position: relative;
  }

  .search-input-wrapper {
    position: relative;
    width: 100%;
  }

  .search-input {
    width: 100%;
    /* padding: 20px 40px 12px; */
    padding-left: 20px;
    padding-top: 12px;
    padding-bottom: 12px;
    padding-right: 0px;
    border: 1px solid #333;
    border-radius: 8px;
    background-color: #1e1e1e;
    font-size: 14px;
    color: #f0f0f0;
    transition: all 0.2s ease;
    font-family: 'Courier New', Courier, monospace;
  }

  .search-input:focus {
    outline: none;
    border-color: #ff3d87;
    box-shadow: 0 0 0 2px rgba(255, 61, 135, 0.2);
  }

  .search-icon {
    position: absolute;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
    color: #a0a0a0;
    display: flex;
    align-items: center;
  }

  .clear-button {
    background: none;
    border: none;
    color: #a0a0a0;
    cursor: pointer;
    padding: 0;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .clear-button:hover {
    color: #f0f0f0;
  }

  .search-spinner {
    position: absolute;
    right: 12px;
    top: 50%;
    transform: translateY(-50%);
    width: 18px;
    height: 18px;
    border: 2px solid rgba(255, 61, 135, 0.2);
    border-top-color: #ff3d87;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    to {
      transform: translateY(-50%) rotate(360deg);
    }
  }

  .search-help {
    margin-top: 8px;
    align-self: self-end;
    width: 100%; /* Match the width of the parent container */
  }

  .help-button {
    background: none;
    border: none;
    color: #a0a0a0;
    font-size: 12px;
    cursor: pointer;
    padding: 4px 8px;
    display: flex;
    align-items: center;
    gap: 5px;
    transition: color 0.2s ease;
  }

  .help-button:hover {
    color: #f0f0f0;
  }
</style>
