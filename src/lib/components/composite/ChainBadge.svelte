<!-- ChainBadge.svelte -->
<script lang="ts">
  interface Props {
    chainId: number;
    showLabel?: boolean;
  }

  let { chainId, showLabel = true }: Props = $props();
</script>

<div class="flex justify-between items-center text-sm">
  {#if showLabel}
    <span class="text-text-tertiary">Chain</span>
  {/if}
  <span class="bg-bg-hover py-0.75 px-2 rounded text-xs font-medium">{chainId}</span>
</div>
