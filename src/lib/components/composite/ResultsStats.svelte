<script lang="ts">
  export let totalCount: number = 0;
  export let filteredCount: number | null = null;
  export let searchQuery: string = '';
</script>

<div class="results-stats flex justify-between items-center mb-4 text-text-tertiary text-sm">
  {#if searchQuery && filteredCount !== null}
    <span>Showing <span class="text-text-primary font-medium">{filteredCount}</span> of {totalCount} tokens</span>
  {:else}
    <span>Showing <span class="text-text-primary font-medium">{totalCount}</span> tokens</span>
  {/if}
  
  <slot></slot>
</div>

