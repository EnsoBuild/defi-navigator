<script lang="ts">
  import SkeletonLoader from './feedback/SkeletonLoader.svelte';
  import EmptyState from './feedback/EmptyState.svelte';
  import ResultsStats from './composite/ResultsStats.svelte';
  import TokenCard from './composite/TokenCard.svelte';
  import LoadingSpinner from './feedback/LoadingSpinner.svelte';

  export let isLoading: boolean;
  export let isLoadingMore: boolean;
  export let tokens: any[] = [];
  export let tokenParams: any;
  export let searchQuery: string;
  export let handleOpenDetails: (event: CustomEvent<{ token: any }>) => void;

  let loadMoreTokens: () => void;
</script>

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