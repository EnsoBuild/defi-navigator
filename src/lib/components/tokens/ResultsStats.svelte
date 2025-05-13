<script lang="ts">
  interface Props {
    totalCount?: number;
    filteredCount?: number | null;
    searchQuery?: string;
    children?: import('svelte').Snippet;
    whats: 'tokens' | 'projects' | 'protocols';
  }

  let { totalCount = 0, filteredCount = null, searchQuery = '', children, whats }: Props = $props();
</script>

<div class="results-stats text-text-tertiary mb-4 flex items-center justify-between text-sm">
  {#if searchQuery && filteredCount !== null}
    <span
      >Showing <span class="text-text-primary font-medium">{filteredCount}</span> of {totalCount} {whats}</span
    >
  {:else}
    <span>Showing <span class="text-text-primary font-medium">{totalCount}</span> {whats}</span>
  {/if}

  {@render children?.()}
</div>
