<script lang="ts">
  import { clearFilters } from '$lib/stores/filterStore';
  import { isLoading, selectToken, tokens } from '$lib/stores/tokenStore';
  import type { TokenData } from '$lib/types/api';

  import EmptyState from '$lib/components/feedback/EmptyState.svelte';
  import LoadingSpinner from '$lib/components/feedback/LoadingSpinner.svelte';
  import SkeletonLoader from '$lib/components/feedback/SkeletonLoader.svelte';
  import ResultsStats from '$lib/components/tokens/ResultsStats.svelte';
  import TokenCard from '$lib/components/tokens/TokenCard.svelte';

  // State
  let isLoadingMore = $state(false);

  // Handle opening token details
  function handleOpenDetails(token: TokenData) {
    selectToken(token);
  }

  // Handle clearing filters
  function handleClearFilters() {
    clearFilters();
  }

  // Derived values
  const totalCount = $derived($tokens.length);
  const hasTokens = $derived($tokens.length > 0);
</script>

{#if $isLoading && !hasTokens}
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
{:else if !hasTokens}
  <EmptyState
    message="No matching tokens"
    description="No tokens match your search criteria. Try adjusting your filters."
    actionText="Clear search"
    illustration="no-results"
    on:action={handleClearFilters}
  />
{:else if hasTokens}
  <ResultsStats {totalCount} filteredCount={totalCount} />

  <div class="tokens-grid mt-5 grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
    {#each $tokens as token (token.address + token.chainId)}
      <TokenCard {token} onOpenDetails={handleOpenDetails} />
    {/each}
  </div>

  {#if isLoadingMore}
    <div class="loading-more text-text-tertiary flex flex-col items-center py-10 text-center">
      <LoadingSpinner text="Loading more tokens..." />
    </div>
  {/if}

  <div id="scroll-sentinel" class="h-5"></div>
{/if}
