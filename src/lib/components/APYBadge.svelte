<!-- APYBadge.svelte -->
<script lang="ts">
  export let apy: number | null = null;
  export let compact: boolean = false;
  
  $: isHighAPY = apy !== null && apy > 5;
</script>

{#if apy !== null && apy !== undefined}
  <div class="token-apy" class:high-apy={isHighAPY}>
    {#if !compact}
      <span>APY</span>
    {/if}
    <span class="apy-value">{apy.toFixed(2)}%</span>
  </div>
{/if}

<style>
  .token-apy {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 12px;
    background-color: rgba(72, 187, 120, 0.1);
    border-radius: 6px;
    margin: 12px 0;
    font-size: 14px;
  }

  .token-apy.high-apy {
    background-color: rgba(255, 61, 135, 0.1);
  }

  .token-apy span {
    color: #a0a0a0;
  }

  .apy-value {
    font-weight: 600;
    color: #4ade80 !important;
  }

  .high-apy .apy-value {
    color: #ff3d87 !important;
  }
</style>