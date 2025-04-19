<!-- ResultStats.svelte -->
<script lang="ts">
  export let totalCount: number = 0;
  export let filteredCount: number | null = null;
  export let searchQuery: string = '';
</script>

<div class="results-info">
  {#if searchQuery && filteredCount !== null}
    <span>Showing {filteredCount} of {totalCount} tokens</span>
  {:else}
    <span>Showing {totalCount} tokens</span>
  {/if}
  
  <slot></slot>
</div>

<style>
  .results-info {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
    color: #a0a0a0;
    font-size: 14px;
  }
</style>