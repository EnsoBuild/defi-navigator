<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import type { Token } from '$lib/types/api';

  import Modal from '$lib/components/layout/Modal.svelte';
  import TokenLogo from '$lib/components/tokens/TokenLogo.svelte';
  import AddressPill from '$lib/components/tokens/AddressPill.svelte';
  import CopyButton from '$lib/components/common/CopyButton.svelte';
  import ChainBadge from '$lib/components/tokens/ChainBadge.svelte';
  import UnderlyingTokenItem from '$lib/components/tokens/UnderlyingTokenItem.svelte';
  import { clearSelectedToken, selectToken } from '$lib/stores/tokenStore';

  interface Props {
    token: Token;
    showOverlay?: boolean;
  }

  let { token }: Props = $props();
  const showOverlay = $derived(selectToken != null);

  // Format TVL with appropriate suffix (K, M, B)
  function formatTVL(value: number): string {
    if (value >= 1000000000) {
      return `$${(value / 1000000000).toFixed(2)}B`;
    } else if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(2)}M`;
    } else if (value >= 1000) {
      return `$${(value / 1000).toFixed(2)}K`;
    } else {
      return `$${value.toFixed(4)}`;
    }
  }

  function handleClose() {
    clearSelectedToken();
  }
</script>

<Modal show={showOverlay} on:close={handleClose} maxWidth="720px">
  {#snippet header()}
    <div class="flex items-center gap-4">
      <TokenLogo logoUri={token.logosUri?.[0]} symbol={token.symbol} size="lg" />

      <div class="flex flex-col">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <h2 id="modal-title" class="text-text-primary m-0 text-xl font-semibold">
              {token.name || 'Unknown Token'}
            </h2>
            <span class="text-text-tertiary text-sm">{token.symbol || 'Unknown'}</span>
            <ChainBadge chainId={token.chainId} showLabel={false} />
          </div>
        </div>

        <!-- Metrics Pills -->
        <div class="mt-2 flex gap-3">
          {#if token.apy !== null && token.apy !== undefined}
            <div class="flex items-center gap-1.5">
              <div
                class="from-primary to-secondary rounded-full bg-gradient-to-r px-2.5 py-1 text-sm font-medium text-white"
              >
                {token.apy.toFixed(4)}% APY
              </div>
              {#if token.apyBase !== null && token.apyReward !== null}
                <div class="text-text-tertiary text-xs">
                  ({token.apyBase?.toFixed(1)}% + {token.apyReward?.toFixed(1)}%)
                </div>
              {/if}
            </div>
          {/if}

          {#if token.tvl !== null && token.tvl !== undefined}
            <div
              class="bg-bg-hover text-text-primary border-brdr-light rounded-full border px-2.5 py-1 text-sm font-medium"
            >
              {formatTVL(token.tvl)} TVL
            </div>
          {/if}
        </div>
      </div>
    </div>
  {/snippet}

  <div class="modal-content">
    {#if token.project && token.protocolSlug}
      <div class="mb-5">
        <h3 class="text-text-primary m-0 mb-2 text-base font-semibold">Protocol</h3>
        <div class="flex items-center gap-2.5">
          <span class="bg-bg-component rounded-md px-3 py-1.5 text-sm font-medium"
            >{token.project}</span
          >
          <span class="text-text-tertiary text-sm">{token.protocolSlug}</span>
        </div>
      </div>
    {/if}

    <div class="mb-5">
      <h3 class="text-text-primary m-0 mb-2 text-base font-semibold">Token Address</h3>
      <AddressPill address={token.address} label="token address" />
    </div>

    {#if token.primaryAddress && token.primaryAddress !== token.address}
      <div class="mb-5">
        <h3 class="text-text-primary m-0 mb-2 text-base font-semibold">Primary Contract</h3>
        <AddressPill address={token.primaryAddress} label="primary contract address" />
      </div>
    {/if}

    {#if token.underlyingTokens && token.underlyingTokens.length > 0}
      <div class="underlying-tokens">
        <h3 class="text-text-primary m-0 mb-2 flex items-center gap-2 text-sm font-medium">
          Underlying Tokens ({token.underlyingTokens.length})
          <CopyButton
            text={token.underlyingTokens.map((t) => t.address).join('\n')}
            small={true}
            label="all underlying token addresses"
          />
        </h3>
        <div class="grid grid-cols-2 gap-2">
          {#each token.underlyingTokens as underlyingToken}
            <UnderlyingTokenItem token={underlyingToken} />
          {/each}
        </div>
      </div>
    {/if}
  </div>
</Modal>
