<script lang="ts">
  import { onMount } from 'svelte';
  import { fetchNetworks, fetchProtocols, fetchTokens } from '../api.ts';
  import type { Network, Protocol, Token } from '../types';

  // Import our extracted components
  import NetworkSelect from '../components/NetworkSelect.svelte';
  import ProtocolSearch from '../components/ProtocolSearch.svelte';
  import TokenSearch from '../components/TokenSearch.svelte';
  import SearchHelpDialog from '../components/SearchHelpDialog.svelte';
  import TokenCard from '../components/TokenCard.svelte';
  import TokenDetails from '../components/TokenDetails.svelte';
  import LoadingSpinner from '../components/LoadingSpinner.svelte';
  import FilterBar from '../components/FilterBar.svelte';
  import ResultStats from '../components/ResultsStats.svelte';
  import EmptyState from '../components/EmptyState.svelte';

  // State variables (unchanged)
  let networks: Network[] = [];
  let protocols: Protocol[] = [];
  let tokens: Token[] = [];
  let filteredTokens: Token[] = [];
  let isLoading: boolean = false;
  let error: string | null = null;

  // Selected values
  let selectedNetwork: Network | null = null;
  let selectedProtocol: Protocol | null = null;

  // Pagination
  let currentPage: number = 1;
  let totalPages: number = 1;
  let isLoadingMore: boolean = false;

  // Search state
  let searchQuery: string = '';
  let showSearchHelp: boolean = false;

  // Overlay state
  let selectedToken: Token | null = null;
  let showOverlay: boolean = false;

  // Handle network selection
  function handleNetworkChange(event: CustomEvent): void {
    selectedNetwork = event.detail;
    if (selectedProtocol) {
      currentPage = 1;
      loadTokens(1, false);
    }
  }

  // Handle protocol selection
  function handleProtocolSelect(event: CustomEvent): void {
    selectedProtocol = event.detail.protocol;
    currentPage = 1;
    loadTokens(1, false);
  }

  // Handle token search results
  function handleSearchResults(event: CustomEvent): void {
    const { results, query } = event.detail;
    searchQuery = query;
    filteredTokens = results;
  }

  // Toggle search help dialog
  function toggleSearchHelp(): void {
    showSearchHelp = !showSearchHelp;
  }

  // Open the overlay with token details
  function handleOpenDetails(event: CustomEvent): void {
    selectedToken = event.detail.token;
    console.log(selectedToken);
    showOverlay = true;
  }

  // Close the overlay
  function closeOverlay(): void {
    showOverlay = false;
    selectedToken = null;
  }

  // Handle key press
  function handleKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
      if (showOverlay) {
        closeOverlay();
      } else if (showSearchHelp) {
        showSearchHelp = false;
      }
    }
  }

  // Load networks from API
  async function loadNetworks(): Promise<void> {
    try {
      const data = await fetchNetworks();
      networks = [{ id: null, name: 'All Networks' }, ...data];
    } catch (err) {
      if (err instanceof Error) {
        error = err.message;
      } else {
        error = 'Unknown error occurred';
      }
      console.error('Failed to fetch networks:', err);
    }
  }

  // Load protocols from API
  async function loadProtocols(): Promise<void> {
    try {
      isLoading = true;
      protocols = await fetchProtocols();
    } catch (err) {
      if (err instanceof Error) {
        error = err.message;
      } else {
        error = 'Unknown error occurred';
      }
      console.error('Failed to fetch protocols:', err);
    } finally {
      isLoading = false;
    }
  }

  // Load tokens from API
  async function loadTokens(page: number = 1, append: boolean = false): Promise<void> {
    if (!selectedProtocol) return;

    try {
      if (page === 1) {
        isLoading = true;
      } else {
        isLoadingMore = true;
      }

      const chainId = selectedNetwork?.id || undefined;
      const result = await fetchTokens(selectedProtocol.slug, page, chainId);

      totalPages = result.meta.lastPage;
      currentPage = result.meta.currentPage;

      let newTokens = result.data;

      if (append) {
        tokens = [...tokens, ...newTokens];
      } else {
        tokens = newTokens;
      }

      // Update filtered tokens
      filteredTokens = tokens;
    } catch (err) {
      if (err instanceof Error) {
        error = err.message;
      } else {
        error = 'Unknown error occurred';
      }
      console.error('Failed to fetch tokens:', err);
    } finally {
      isLoading = false;
      isLoadingMore = false;
    }
  }

  // Handle intersection observer for infinite scrolling
  function handleIntersection(entries: IntersectionObserverEntry[]): void {
    const entry = entries[0];
    if (entry.isIntersecting && !isLoadingMore && currentPage < totalPages) {
      loadTokens(currentPage + 1, true);
    }
  }

  // Setup intersection observer for infinite scroll
  function setupIntersectionObserver(): () => void {
    const observer = new IntersectionObserver(handleIntersection, {
      rootMargin: '0px 0px 200px 0px'
    });

    const sentinel = document.querySelector('#scroll-sentinel');
    if (sentinel) observer.observe(sentinel);

    return () => {
      if (sentinel) observer.unobserve(sentinel);
    };
  }

  // Initialize component
  onMount(() => {
    loadNetworks();
    loadProtocols();

    // Add key down listener
    document.addEventListener('keydown', handleKeyDown);

    // Setup intersection observer for infinite scrolling
    const cleanup = setupIntersectionObserver();

    // Find and select Aave V3 protocol by default
    setTimeout(() => {
      const aaveV3 = protocols.find((p) => p.slug === 'aave-v3');
      if (aaveV3) {
        selectedProtocol = aaveV3;
        loadTokens(1, false);
      }
    }, 1000);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      cleanup();
    };
  });
</script>

<svelte:head>
  <title>Enso DeFi Explorer</title>
  <link
    href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Roboto+Mono&display=swap"
    rel="stylesheet"
  />
</svelte:head>

<div class="token-explorer">
  <header class="explorer-header">
    <h1>Enso <span class="accent">DeFi</span> Explorer!</h1>

    {#if error}
      <div class="error-message">
        {error}
      </div>
    {/if}

    <FilterBar>
      <ProtocolSearch {protocols} {selectedProtocol} on:protocolSelect={handleProtocolSelect} />
      <TokenSearch {tokens} on:searchResults={handleSearchResults} on:showHelp={toggleSearchHelp} />
      <NetworkSelect {networks} {selectedNetwork} on:networkChange={handleNetworkChange} />
    </FilterBar>
  </header>

  {#if isLoading && tokens.length === 0}
    <div class="loading-indicator">
      <LoadingSpinner size="32px" text="Loading tokens..." />
    </div>
  {:else if tokens.length === 0 && selectedProtocol}
    <EmptyState
      message="No tokens found"
      description="No tokens found for the selected criteria"
      icon="search"
    />
  {:else if filteredTokens.length === 0 && searchQuery}
    <EmptyState
      message="No matching tokens"
      description="No tokens match your search criteria"
      actionText="Clear search"
      icon="search"
      on:action={() => (searchQuery = '')}
    />
  {:else if tokens.length > 0}
    <ResultStats totalCount={tokens.length} filteredCount={filteredTokens.length} {searchQuery} />

    <div class="tokens-grid">
      {#each filteredTokens as token (token.address + token.chainId)}
        <TokenCard {token} on:openDetails={handleOpenDetails} />
      {/each}
    </div>

    {#if isLoadingMore}
      <div class="loading-more">
        <LoadingSpinner text="Loading more tokens..." />
      </div>
    {/if}

    <div id="scroll-sentinel"></div>
  {/if}

  {#if showOverlay && selectedToken}
    <TokenDetails token={selectedToken} {showOverlay} on:close={closeOverlay} />
  {/if}

  <SearchHelpDialog bind:show={showSearchHelp} />
</div>

<style>
  :global(body) {
    background-color: #121212;
    color: #f0f0f0;
    margin: 0;
    padding: 0;
    font-family:
      'Inter',
      -apple-system,
      BlinkMacSystemFont,
      'Segoe UI',
      Roboto,
      Oxygen,
      Ubuntu,
      Cantarell,
      'Open Sans',
      'Helvetica Neue',
      sans-serif;
  }

  .token-explorer {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
  }

  .explorer-header {
    margin-bottom: 30px;
  }

  .explorer-header h1 {
    margin-bottom: 20px;
    color: #f0f0f0;
    font-size: 28px;
    font-weight: 700;
    letter-spacing: -0.5px;
  }

  .accent {
    color: #ff3d87;
    background: linear-gradient(90deg, #ff3d87, #ff56a9);
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  .filters {
    display: flex;
    gap: 50px; /* This creates 20px of space between each child div */
    margin-bottom: 20px;
    width: 100%;
    align-items: self-end;
  }

  .results-info {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
    color: #a0a0a0;
    font-size: 14px;
  }

  .error-message {
    background-color: rgba(254, 178, 178, 0.1);
    color: #fc8181;
    padding: 12px 16px;
    border-radius: 8px;
    margin-bottom: 20px;
    border: 1px solid rgba(254, 178, 178, 0.2);
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .error-message::before {
    content: '⚠️';
    font-size: 16px;
  }

  .loading-indicator,
  .no-results,
  .loading-more {
    text-align: center;
    padding: 60px 0;
    color: #a0a0a0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 16px;
  }

  .clear-search-button {
    margin-top: 8px;
    background-color: #252525;
    border: 1px solid #333;
    border-radius: 4px;
    color: #f0f0f0;
    padding: 8px 16px;
    cursor: pointer;
    font-size: 14px;
    transition: background-color 0.2s ease;
  }

  .clear-search-button:hover {
    background-color: #333;
  }

  .tokens-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
    gap: 24px;
    margin-top: 20px;
  }

  #scroll-sentinel {
    height: 20px;
  }

  @media (max-width: 768px) {
    .filters {
      flex-direction: column;
      gap: 16px;
    }

    .tokens-grid {
      grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
      gap: 16px;
    }
  }
</style>
