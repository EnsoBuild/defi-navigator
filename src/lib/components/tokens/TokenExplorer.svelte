<script lang="ts">
  import { page } from '$app/state';
  import { setupSearchExecuteShortcut } from '$lib/utils/keyboard';
  import { parseShareableUrl } from '$lib/utils/url';
  import { onMount } from 'svelte';
  // Import stores
  import { executeSearch, initializeFilters } from '$lib/stores/filterStore';
  import { clearSelectedToken, error, selectedToken } from '$lib/stores/tokenStore';
  // Import components
  import FilterBar from '$lib/components/layout/FilterBar.svelte';
  import Nav from '$lib/components/layout/Nav.svelte';
  import type { TokenData } from '$lib/types/api';
  import TokenDetails from './TokenDetails.svelte';
  import TokenList from './TokenList.svelte';
  // Import services
  import { getNetworks, getProjects, getProtocols } from '$lib/services/api/tokens';
  import { filterService } from '$lib/services/filters/filterService';

  // Component state
  let didMount = $state(false);
  const showOverlay = $derived($selectedToken != null);
  // Initialize and load data
  onMount(() => {
    try {
      // Load reference data
      Promise.all([getNetworks(), getProtocols(), getProjects()]).then(
        ([networks, protocols, projects]) => {
          // Update filter service with reference data
          filterService.updateDataSources(networks, protocols, projects);
        }
      );

      // Parse URL params
      const initialParams = parseShareableUrl(page.url.toString());

      // Initialize store with these params
      initializeFilters(initialParams);

      // Load tokens with initial params
      executeSearch();

      // Setup keyboard shortcuts
      const cleanupShortcuts = setupSearchExecuteShortcut(executeSearch);
      didMount = true;

      // Store cleanup function for onDestroy
      return () => {
        cleanupShortcuts();
      };

      didMount = true;
    } catch (err) {
      error.set(`Failed to initialize: ${(err as Error).message}`);
    }
  });
</script>

<svelte:head>
  <title>Enso DeFi Explorer</title>
  <link
    href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Roboto+Mono&display=swap"
    rel="stylesheet"
  />
</svelte:head>

<div class="token-explorer relative mx-auto max-w-screen-xl px-8">
  <header class="explorer-header mb-7">
    <Nav />
    {#if $error}
      <div
        class="error-message bg-error-light text-error border-error-border mb-5 flex items-center gap-2.5 rounded-lg border p-3 px-4 before:text-base before:content-['⚠️']"
      >
        {$error}
      </div>
    {/if}
  </header>

  <div class="relative">
    <div class="pb-30">
      <TokenList />
    </div>

    {#if didMount}
      <FilterBar />
    {/if}
  </div>

  {#if showOverlay && $selectedToken}
    <TokenDetails token={$selectedToken} {showOverlay} />
  {/if}
</div>
