<!-- ChainBadge.svelte -->
<script lang="ts">
  export let chainId: number;
  export let showLabel: boolean = true;
</script>

<div class="flex justify-between items-center text-sm">
  {#if showLabel}
    <span class="text-text-tertiary">Chain</span>
  {/if}
  <span class="bg-bg-hover py-0.75 px-2 rounded text-xs font-medium">{chainId}</span>
</div>
