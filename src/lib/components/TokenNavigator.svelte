<script lang="ts">
  import { getNetworks, getProjects, getProtocols, getTokenData } from '$lib/api/tokens';
  import { onMount } from 'svelte';
  import { parseFilterQuery } from '../search/parser';
  import type { ProjectData, TokenData, TokenParams } from '../types/api';

  import FilterBuilder from '$lib/filters/FilterBuilder.svelte';
  import type { Network, Protocol, Token } from '$lib/types/api';
  import { debounce } from '$lib/utils/debounce';
  import * as _ from 'lodash';
  import ResultsStats from './composite/ResultsStats.svelte';
  import TokenCard from './composite/TokenCard.svelte';
  import TokenDetails from './composite/TokenDetails.svelte';
  import TokenSearch from './composite/TokenSearch.svelte';
  import EmptyState from './feedback/EmptyState.svelte';
  import LoadingSpinner from './feedback/LoadingSpinner.svelte';
  import SkeletonLoader from './feedback/SkeletonLoader.svelte';

  import { parseShareableUrl } from '$lib/search/url';

  import { page } from '$app/state';
  import Nav from './Nav.svelte';

  // State
  let didMount = $state(false);
  let tokens: Token[] = $state([]);
  let protocols: Protocol[] = $state([]);
  let projects: ProjectData[] = $state([]);
  let networks: Network[] = $state([]);
  let isLoading = $state(true);
  let isLoadingMore = $state(false);
  let error: string | null = $state(null);
  let showOverlay = $state(false);
  let selectedToken: TokenData | null = $state(null);

  let initialTokenParams: TokenParams = $state({});

  // Search and filter state
  let searchQuery = $state('');
  let tokenParams = $state<TokenParams>({});
  let selectedNetwork = 1; // Default to Ethereum Mainnet
  let filterView: 'cli' | 'ui' = $state('ui'); // 'cli' or 'ui'
  // Initialize and load tokens

  onMount(() => {
    let observer: IntersectionObserver | null = null;
    initialTokenParams = parseShareableUrl(page.url.toString());
    tokenParams = initialTokenParams;
    // Start loading immediately, but don't await inside the function that's returned
    Promise.all([loadTokens(tokenParams), loadProtocols(), loadNetworks(), loadProjects()])
      .then(() => {
        // Set up the infinite scroll observer after data is loaded
        observer = new IntersectionObserver(handleIntersection, {
          rootMargin: '100px'
        });

        const sentinel = document.getElementById('scroll-sentinel');
        if (sentinel) {
          observer.observe(sentinel);
        }
      })
      .catch((err) => {
        error = `Failed to initialize: ${err.message}`;
      });
    didMount = true;
    // Return the cleanup function synchronously
    return () => {
      if (observer) {
        observer.disconnect();
      }
    };
  });

  const loadTokens = debounce(async (params: TokenParams) => {
    try {
      isLoading = true;
      error = null;
      const result = await getTokenData(params);
      tokens = result;
    } catch (err) {
      error = `Failed to load tokens: ${(err as Error).message}`;
      tokens = [];
    } finally {
      isLoading = false;
    }
  }, 1200);

  async function loadProtocols() {
    try {
      protocols = await getProtocols(selectedNetwork);
    } catch (err) {
      console.error('Failed to load protocols:', err);
      protocols = [];
    }
  }

  async function loadProjects() {
    try {
      projects = await getProjects();
    } catch (err) {
      console.error('Failed to load protocols:', err);
      projects = [];
    }
  }

  async function loadNetworks() {
    try {
      networks = await getNetworks();
    } catch (err) {
      console.error('Failed to load networks:', err);
      networks = [];
    }
  }

  async function loadMoreTokens() {
    // In a real implementation, we would track pagination cursor
    // This is a simplified version without pagination support
    if (isLoadingMore) return;

    try {
      isLoadingMore = true;
      // For now, we'll just simulate loading more by duplicating existing tokens
      // In a real app, you would use pagination parameters
      await new Promise((resolve) => setTimeout(resolve, 1000));
      isLoadingMore = false;
    } catch (err) {
      error = `Failed to load more tokens: ${(err as Error).message}`;
      isLoadingMore = false;
    }
  }

  const handleIntersection: IntersectionObserverCallback = (entries: any[]) => {
    if (entries[0].isIntersecting && !isLoading && !isLoadingMore && tokens.length > 0) {
      loadMoreTokens();
    }
  };

  // Filter handling
  function handleSearchInput(event: CustomEvent<{ query: string }>) {
    const query = event.detail.query;
    searchQuery = query;

    // Parse the query for structured filtering
    parseFilterQuery(query, {
      filterSelecting: (partialKey) => {
        // Could be used to show autocomplete suggestions
        console.debug(`Filtering by: ${partialKey}`);
      },
      filterSelected: (key, operator) => {
        // Could be used to highlight that a filter key is active
        console.debug(`Filter selected: ${key}${operator}`);
        if (key === 'protocol') {
          // displays protocols as autosuggest
        }
      },
      filter: async (params) => {
        console.debug('Filter applied:', params);

        // When we have a complete filter, update the token params and load tokens
        if (_.isEqual(params, tokenParams)) {
          return;
        }
        tokenParams = params;
        loadTokens(params);
      }
    });
  }

  function handleSearchResults(event: CustomEvent) {
    // This might be used for handling search results from an external search component
  }

  function handleOpenDetails(event: CustomEvent<{ token: Token }>) {
    selectedToken = event.detail.token as TokenData;
    showOverlay = true;
  }

  function closeOverlay() {
    showOverlay = false;
    selectedToken = null;
  }

  // visual filter
  function handleFilter(event: CustomEvent<TokenParams>) {
    const params = event.detail;
    if (!_.isEqual(params, tokenParams)) {
      tokenParams = params;
    }
    loadTokens(params);
  }

  function onSwitch(view: 'cli' | 'ui') {
    console.log('Switching view to', view);
    filterView = view;
  }
</script>

<svelte:head>
  <title>Enso DeFi Explorer</title>
  <link
    href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Roboto+Mono&display=swap"
    rel="stylesheet"
  />
</svelte:head>

<div class="token-explorer mx-auto max-w-screen-xl px-8 pt-5">
  <header class="explorer-header mb-7">
    <Nav />
    {#if error}
      <div
        class="error-message bg-error-light text-error border-error-border mb-5 flex items-center gap-2.5 rounded-lg border p-3 px-4 before:text-base before:content-['⚠️']"
      >
        {error}
      </div>
    {/if}
    {#if didMount}
      <div>
        <div class=" flex overflow-hidden rounded-md"></div>
        {#if filterView === 'cli'}
          <TokenSearch
            on:input={handleSearchInput}
            on:searchResults={handleSearchResults}
            {protocols}
            {networks}
            {projects}
            tokenParams={initialTokenParams}
            {onSwitch}
          />
        {:else}
          <FilterBuilder
            {networks}
            {protocols}
            on:filter={handleFilter}
            {projects}
            tokenParams={initialTokenParams}
            {onSwitch}
          />
        {/if}
      </div>
    {/if}
  </header>

  {#if isLoading && tokens.length === 0}
    <div class="loading-container py-10">
      <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {#each Array(8) as _, i}
          <div class="skeleton-card">
            <div class="mb-4 flex items-center gap-3">
              <SkeletonLoader type="circle" width="48px" />
              <div class="flex-1">
                <SkeletonLoader type="text" width="80%" height="20px" />
                <SkeletonLoader type="text" width="40%" height="16px" />
              </div>
            </div>
            <SkeletonLoader type="custom" width="100%" height="40px" rounded={true} />
            <SkeletonLoader type="custom" width="100%" height="24px" rounded={true} />
          </div>
        {/each}
      </div>
    </div>
  {:else if tokens.length === 0 && !tokenParams}
    <EmptyState message="Start searching for tokens" description="" illustration="empty" />
  {:else if tokens.length === 0 && tokenParams}
    <EmptyState
      message="No matching tokens"
      description="No tokens match your search criteria"
      actionText="Clear search"
      illustration="no-results"
      on:action={() => (searchQuery = '')}
    />
  {:else if tokens.length > 0}
    <ResultsStats totalCount={tokens.length} filteredCount={tokens.length} {searchQuery} />

    <div
      class="tokens-grid mt-5 grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
    >
      {#each tokens as token (token.address + token.chainId)}
        <TokenCard {token} on:openDetails={handleOpenDetails} />
      {/each}
    </div>

    {#if isLoadingMore}
      <div class="loading-more text-text-tertiary flex flex-col items-center py-10 text-center">
        <LoadingSpinner text="Loading more tokens..." />
      </div>
    {/if}

    <div id="scroll-sentinel" class="h-5"></div>
  {/if}

  {#if showOverlay && selectedToken}
    <TokenDetails token={selectedToken} {showOverlay} on:close={closeOverlay} />
  {/if}
</div>
