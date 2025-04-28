<script lang="ts">
  import { getNetworks, getProjects, getProtocols, getTokenData } from '$lib/api/tokens';
  import { onMount } from 'svelte';
  import { parseFilterQuery } from '../search/parser';
  import type { ProjectData, TokenData, TokenParams } from '../types/api';
  // Change this import line
  import { Tween } from 'svelte/motion';
  // To this (using only tweened)

  import FilterBuilder from '$lib/filters/FilterBuilder.svelte';
  import type { Network, Protocol, Token } from '$lib/types/api';
  import { debounce } from '$lib/utils/debounce';
  import * as _ from 'lodash';
  import TokenDetails from './composite/TokenDetails.svelte';
  import TokenSearch from './composite/TokenSearch.svelte';
  import TokenList from './TokenList.svelte';

  import { parseShareableUrl } from '$lib/search/url';

  import { page } from '$app/state';
  import { PlayIcon } from '@lucide/svelte';
  import { fade } from 'svelte/transition';
  import Button from './core/Button.svelte';
  import Nav from './Nav.svelte';
  import { linear } from 'svelte/easing';

  // State
  let didMount = $state(false);
  let tokens: Token[] = $state([]);
  let protocols: Protocol[] = $state([]);
  let projects: ProjectData[] = $state([]);
  let networks: Network[] = $state([]);
  let isLoading = $state(false);
  let isLoadingMore = $state(false);
  let error: string | null = $state(null);
  let showOverlay = $state(false);
  let selectedToken: TokenData | null = $state(null);
  let loadingProgress = new Tween(0, { duration: 400, easing: linear });
  let loaderInterval: ReturnType<typeof setInterval> | null = $state(null);

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

    // Add keyboard event listener for CMD+Enter or CTRL+Enter
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === 'Enter') {
        
        executeSearch();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    // Return the cleanup function synchronously
    return () => {
      if (observer) {
        observer.disconnect();
      }
      if (loaderInterval) {
        clearInterval(loaderInterval);
      }
      document.removeEventListener('keydown', handleKeyDown);
    };
  });

  const loadTokens = debounce(async (params: TokenParams) => {
    try {
      isLoading = true;
      error = null;

      // Start progress animation
      loadingProgress.set(0);
      if (loaderInterval) clearInterval(loaderInterval);
      loadingProgress.set(90, { duration: 2000 });

      const result = await getTokenData(params);
      tokens = result;

      // Complete the progress when data is loaded
      loadingProgress.set(100);

      setTimeout(() => {
        if (loaderInterval) {
          clearInterval(loaderInterval);
          loaderInterval = null;
        }
        loadingProgress.set(0, { duration: 0 }); // Reset without animation
      }, 500); // Keep loader visible briefly after completion
    } catch (err) {
      error = `Failed to load tokens: ${(err as Error).message}`;
      tokens = [];
      loadingProgress.set(0, { duration: 0 }); // Reset without animation
      if (loaderInterval) {
        clearInterval(loaderInterval);
        loaderInterval = null;
      }
    } finally {
      isLoading = false;
    }
  }, 100);

  // Execute search function (called by the Run button or keyboard shortcuts)
  function executeSearch() {
    console.log('Executing search with params:', tokenParams);
    loadTokens(tokenParams);
  }

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
        tokenParams = params;
      }
    });
  }

  function handleSearchResults(event: CustomEvent) {
    console.log('Search results:', event.detail);
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
    initialTokenParams = tokenParams;
  }
</script>

<svelte:head>
  <title>Enso DeFi Explorer</title>
  <link
    href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Roboto+Mono&display=swap"
    rel="stylesheet"
  />
</svelte:head>

<div class="token-explorer relative mx-auto max-w-screen-xl px-8 pt-5">
  <header class="explorer-header mb-7">
    <Nav />
    {#if error}
      <div
        class="error-message bg-error-light text-error border-error-border mb-5 flex items-center gap-2.5 rounded-lg border p-3 px-4 before:text-base before:content-['⚠️']"
      >
        {error}
      </div>
    {/if}
  </header>

  <div class="relative">
    <TokenList
      {isLoading}
      {isLoadingMore}
      {tokens}
      {tokenParams}
      {searchQuery}
      {handleOpenDetails}
    />

    {#if didMount}
      <div
        class="bg-bg-secondary border-brdr-light fixed right-0 bottom-0 left-0 z-10 mx-auto flex w-full items-center justify-between border-t px-6 py-4 pb-5"
      >
        {#if isLoading || loadingProgress.current > 0}
          <div
            class="bg-primary shadow-primary/50 absolute top-0 left-0 h-[1px] py-[1px] transition-all duration-300 ease-out"
            style="width: {loadingProgress.current}%;"
            transition:fade={{ duration: 300 }}
          ></div>
        {/if}
        {#if filterView === 'cli'}
          <div class="flex w-full items-center gap-3">
            <div class="flex-grow">
              <TokenSearch
                on:input={handleSearchInput}
                on:searchResults={handleSearchResults}
                {protocols}
                {networks}
                {projects}
                initialTokenParams={initialTokenParams}
                tokenParams={tokenParams}
                {onSwitch}
              />
            </div>
            <Button
              onclick={executeSearch}
              size="sm"
              aria-label="Run search (CMD+Enter/CTRL+Enter)"
              title="Run search (CMD+Enter/CTRL+Enter)"
            >
              <PlayIcon size={16} />
            </Button>
          </div>
        {:else}
          <div class="flex w-full items-center gap-3">
            <div class="flex-grow">
              <FilterBuilder
                {networks}
                {protocols}
                on:filter={handleFilter}
                {projects}
                tokenParams={initialTokenParams}
                {onSwitch}
              />
            </div>
            <Button
              onclick={executeSearch}
              size="sm"
              aria-label="Run search (CMD+Enter/CTRL+Enter)"
              title="Run search (CMD+Enter/CTRL+Enter)"
            >
              <PlayIcon size={16} />
            </Button>
          </div>
        {/if}
      </div>
    {/if}
  </div>

  {#if showOverlay && selectedToken}
    <TokenDetails token={selectedToken} {showOverlay} on:close={closeOverlay} />
  {/if}
</div>
