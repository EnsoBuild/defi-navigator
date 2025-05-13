<script lang="ts">
  import type { TokenData } from '$lib/types';
  import Card from '$lib/components/common/Card.svelte';

  import ChainBadge from '$lib/components/tokens/ChainBadge.svelte';
  import TokenLogo from '$lib/components/tokens/TokenLogo.svelte';

  interface Props {
    token: TokenData;
    hoverEffect?: 'lift' | 'glow' | 'scale';
    onOpenDetails: (token: TokenData) => void;
  }

  let { token, hoverEffect = 'lift', onOpenDetails }: Props = $props();

  function openDetails() {
    onOpenDetails(token as TokenData);
  }

  // Determine if APY should be highlighted
  let hasHighAPY = $derived(token.apy !== null && token.apy !== undefined && Number(token.apy) > 5);

  // Format TVL with appropriate suffix (K, M, B)
  function formatTVL(value: string | number): string {
    value = Number(value);
    if (!value && value !== 0) return 'N/A';
    if (value >= 1000000000) {
      return `$${(value / 1000000000).toFixed(1)}B`;
    } else if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(1)}M`;
    } else if (value >= 1000) {
      return `$${(value / 1000).toFixed(1)}K`;
    } else {
      return `$${value.toFixed(4)}`;
    }
  }
</script>

<Card
  id={`token-${token.address}-${token.chainId}`}
  interactive={true}
  hoverable={true}
  highlightBorder={hasHighAPY}
  {hoverEffect}
  on:click={openDetails}
  on:keydown={(e) => e.key === 'Enter' && openDetails()}
  tabindex="0"
  role="button"
  aria-label={`View details for ${token.name || 'Unknown Token'}`}
  title="{token.name} ({token.symbol})"
  size="sm"
>
  <div class="flex items-center gap-3">
    <TokenLogo logoUri={token.logosUri?.[0]} symbol={token.symbol} size="md" />

    <div class="flex-1">
      <div class="mb-1 flex items-center gap-2">
        <h3 class="text-text-primary m-0 max-w-[150px] truncate text-lg font-semibold">
          {token.name || 'Unknown Token'}
        </h3>
        <ChainBadge chainId={token.chainId} showLabel={false} />
      </div>
      <span class="text-text-tertiary text-sm">{token.symbol || 'Unknown'}</span>
    </div>
  </div>

  <!-- Metrics row -->
  <div class="mt-4 flex gap-2">
    <div class="bg-bg-component border-brdr-light flex-1 rounded-md border px-3 py-2 text-sm">
      <div class="flex items-center justify-between">
        <span class="text-text-tertiary text-xs">APY</span>

        {#if token.apy !== null && token.apy !== undefined}
          <span
            class={`font-semibold ${hasHighAPY ? 'from-primary to-primary-hover bg-gradient-to-r' : 'from-success bg-gradient-to-r to-green-400'} bg-clip-text text-transparent`}
          >
            {Number(token.apy).toFixed(2)}%
          </span>
        {:else}
          <span class="text-text-tertiary">N/A</span>
        {/if}
      </div>
    </div>

    {#if token.tvl !== null && token.tvl !== undefined}
      <div class="bg-bg-component border-brdr-light flex-1 rounded-md border px-3 py-2 text-sm">
        <div class="flex items-center justify-between">
          <span class="text-text-tertiary text-xs">TVL</span>
          <span class="text-text-primary font-semibold">{formatTVL(token.tvl)}</span>
        </div>
      </div>
    {/if}
  </div>

  <!-- Protocol row -->
  <!-- <div class="mt-2 flex items-center justify-between text-xs">
    {#if token.project}
      <span class="text-text-tertiary">{token.project} {!!token.protocolSlug ? `(${token.protocolSlug})`: ''}</span>
    {:else}
      
    {/if}
    <span class="text-text-tertiary">{token.type}</span>
  </div> -->
</Card>
