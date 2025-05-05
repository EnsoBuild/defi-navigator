<script lang="ts">
  interface Props {
    totalCount?: number;
    filteredCount?: number | null;
    searchQuery?: string;
    children?: import('svelte').Snippet;
  }

  let {
    totalCount = 0,
    filteredCount = null,
    searchQuery = '',
    children
  }: Props = $props();
</script>

<div class="results-stats flex justify-between items-center mb-4 text-text-tertiary text-sm">
  {#if searchQuery && filteredCount !== null}
    <span>Showing <span class="text-text-primary font-medium">{filteredCount}</span> of {totalCount} tokens</span>
  {:else}
    <span>Showing <span class="text-text-primary font-medium">{totalCount}</span> tokens</span>
  {/if}
  
  {@render children?.()}
</div>

