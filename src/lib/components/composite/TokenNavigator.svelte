<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import type { Token, TokenData, TokenParams } from '../../types';
  import { getTokenData, getNetworks, getProtocols } from '../../api/tokens';
  import { parseFilterQuery } from '../../search/parser';

  import TokenSearch from './TokenSearch.svelte';
  import TokenCard from './TokenCard.svelte';
  import TokenDetails from './TokenDetails.svelte';
  import EmptyState from '../feedback/EmptyState.svelte';
  import LoadingSpinner from '../feedback/LoadingSpinner.svelte';
  import SkeletonLoader from '../feedback/SkeletonLoader.svelte';
  import SearchHelpDialog from './SearchHelpDialog.svelte';
  import ResultsStats from './ResultsStats.svelte';
  import { writable, derived } from 'svelte/store';
  import { debounce } from '$lib/utils/debounce';
  import type { Network, Protocol } from '$lib/types';
  import * as _ from 'lodash';
  import { copyShareableUrlToClipboard, createShareableUrl } from '$lib/search/url';
  import Button from '../core/Button.svelte';

  // State
  let tokens: TokenData[] = [];
  let protocols: Protocol[] = [];
  let networks: Network[] = [];
  let isLoading = true;
  let isLoadingMore = false;
  let error: string | null = null;
  let showOverlay = false;
  let selectedToken: TokenData | null = null;
  let showSearchHelp = false;

  // Search and filter state
  let searchQuery = writable('');
  let tokenParams = writable<TokenParams>({});
  let selectedProtocol = '';
  let selectedNetwork = 1; // Default to Ethereum Mainnet

  // Initialize and load tokens
  onMount(() => {
    let observer: IntersectionObserver | null = null;

    // Start loading immediately, but don't await inside the function that's returned
    Promise.all([loadTokens($tokenParams), loadProtocols(), loadNetworks()])
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
      console.debug("Load", $tokenParams, params)
      const result = await getTokenData(params);
      tokens = result;
    } catch (err) {
      error = `Failed to load tokens: ${(err as Error).message}`;
      tokens = [];
    } finally {
      isLoading = false;
    }
  }, 500);

  async function loadProtocols() {
    try {
      protocols = await getProtocols(selectedNetwork);
    } catch (err) {
      console.error('Failed to load protocols:', err);
      protocols = [];
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
    searchQuery.set(query);

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
        if(_.isEqual(params, $tokenParams)) {
          return;
          
        }
        tokenParams.set(params);
        console.debug('API filtering', params);
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

  function toggleSearchHelp() {
    showSearchHelp = !showSearchHelp;
  }
</script>

<svelte:head>
  <title>Enso DeFi Explorer</title>
  <link
    href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Roboto+Mono&display=swap"
    rel="stylesheet"
  />
</svelte:head>

<div class="token-explorer p10 mx-auto max-w-screen-xl">
  <header class="explorer-header mb-7"
    <h1 class="text-text-primary mb-5 text-2xl font-bold tracking-tight">
      Enso <span
        class="accent from-primary to-primary-hover bg-gradient-to-r bg-clip-text text-transparent"
        >DeFi</span
      > Explorer
    </h1>
    {#if error}
      <div
        class="error-message bg-error-light text-error border-error-border mb-5 flex items-center gap-2.5 rounded-lg border p-3 px-4 before:text-base before:content-['⚠️']"
      >
        {error}
      </div>
    {/if}
    <!-- Uncomment these when implementation is complete -->
    <!-- <ProtocolSearch {protocols} {selectedProtocol} on:protocolSelect={handleProtocolSelect} /> -->
    <TokenSearch
      on:input={handleSearchInput}
      on:searchResults={handleSearchResults}
      on:showHelp={toggleSearchHelp}
      {protocols}
      {networks}
    />
    <!-- <NetworkSelect {networks} {selectedNetwork} on:networkChange={handleNetworkChange} /> -->
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
  {:else if tokens.length === 0 && selectedProtocol}
    <EmptyState
      message="No tokens found"
      description="No tokens found for the selected criteria"
      illustration="empty"
    />
  {:else if tokens.length === 0 && $searchQuery}
    <EmptyState
      message="No matching tokens"
      description="No tokens match your search criteria"
      actionText="Clear search"
      illustration="no-results"
      on:action={() => searchQuery.set('')}
    />
  {:else if tokens.length > 0}
    <ResultsStats
      totalCount={tokens.length}
      filteredCount={tokens.length}
      searchQuery={$searchQuery}
    />

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

  <SearchHelpDialog bind:show={showSearchHelp} />
</div>
