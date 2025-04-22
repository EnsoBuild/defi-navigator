<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import type { Token } from '../../types/api';

  // Import our extracted components
  import Modal from '../layout/Modal.svelte';
  import TokenLogo from './TokenLogo.svelte';
  import AddressPill from './AddressPill.svelte';
  import CopyButton from './CopyButton.svelte';
  import ChainBadge from './ChainBadge.svelte';
  import UnderlyingTokenItem from './UnderlyingTokenItem.svelte';

  export let token: Token;
  export let showOverlay: boolean = false;

  const dispatch = createEventDispatcher();

  function close() {
    dispatch('close');
  }

  // Format TVL with appropriate suffix (K, M, B)
  function formatTVL(value: number): string {
    if (value >= 1000000000) {
      return `$${(value / 1000000000).toFixed(2)}B`;
    } else if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(2)}M`;
    } else if (value >= 1000) {
      return `$${(value / 1000).toFixed(2)}K`;
    } else {
      return `$${value.toFixed(2)}`;
    }
  }
</script>

<Modal show={showOverlay} on:close={close} maxWidth="720px">
  <div class="flex items-center gap-4" slot="header">
    <TokenLogo logoUri={token.logosUri?.[0]} symbol={token.symbol} size="lg" />

    <div class="flex flex-col">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2">
          <h2 id="modal-title" class="text-text-primary m-0 text-xl font-semibold">
            {token.name || 'Unknown Token'}
          </h2>
          <span class="text-text-tertiary text-sm">{token.symbol || 'Unknown'}</span>
          <ChainBadge chainId={token.chainId} showLabel={false}/>
        </div>
      </div>

      <!-- Metrics Pills -->
      <div class="flex gap-3 mt-2">
        {#if token.apy !== null && token.apy !== undefined}
          <div class="flex items-center gap-1.5">
            <div class="px-2.5 py-1 rounded-full text-sm from-primary to-secondary bg-gradient-to-r font-medium text-white">
              {token.apy.toFixed(2)}% APY
            </div>
            {#if token.apyBase !== null && token.apyReward !== null}
              <div class="text-xs text-text-tertiary">
                ({token.apyBase?.toFixed(1)}% + {token.apyReward?.toFixed(1)}%)
              </div>
            {/if}
          </div>
        {/if}

        {#if token.tvl !== null && token.tvl !== undefined}
          <div class="px-2.5 py-1 rounded-full text-sm bg-bg-hover font-medium text-text-primary border border-brdr-light">
            {formatTVL(token.tvl)} TVL
          </div>
        {/if}
      </div>
    </div>
  </div>

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
        <h3 class="text-text-primary m-0 mb-2 text-sm font-medium flex items-center gap-2">
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