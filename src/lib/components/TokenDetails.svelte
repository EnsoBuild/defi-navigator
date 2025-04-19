<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import type { Token } from '../types';

  // Import our extracted components
  import Modal from './Modal.svelte';
  import TokenLogo from './TokenLogo.svelte';
  import AddressPill from './AddressPill.svelte';
  import MetricCard from './MetricCard.svelte';
  import UnderlyingTokenItem from './UnderlyingTokenItem.svelte';
  import CopyButton from './CopyButton.svelte';

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

<Modal show={showOverlay} closeOnBackdropClick={true} on:close={close} width="max-w-2xl">
  <div class="token-info" slot="header">
    <TokenLogo logoUri={token.logosUri?.[0]} symbol={token.symbol} size="md" />

    <div class="token-title">
      <h2 id="modal-title">{token.name || 'Unknown Token'}</h2>
      <div class="token-subtitle">
        <span class="token-symbol">{token.symbol || 'Unknown'}</span>
        <span class="chain-badge">Chain: {token.chainId}</span>
      </div>
    </div>
  </div>

  <div class="modal-content">
    <!-- APY and TVL Section -->
    <div class="key-metrics">
      {#if token.apy !== null && token.apy !== undefined}
        <MetricCard
          title="APY"
          value={token.apy}
          type="apy"
          subValues={token.apyBase !== null && token.apyReward !== null
            ? [
                { label: 'Base', value: token.apyBase },
                { label: 'Reward', value: token.apyReward }
              ]
            : []}
        />
      {/if}

      {#if token.tvl !== null && token.tvl !== undefined}
        <MetricCard title="TVL" value={formatTVL(token.tvl)} type="tvl" />
      {/if}
    </div>

    {#if token.project && token.protocolSlug}
      <div class="token-protocol">
        <h3>Protocol</h3>
        <div class="protocol-info">
          <span class="project">{token.project}</span>
          <span class="protocol-slug">{token.protocolSlug}</span>
        </div>
      </div>
    {/if}

    <div class="token-address">
      <h3>Token Address</h3>
      <AddressPill address={token.address} label="token address" />
    </div>

    {#if token.primaryAddress && token.primaryAddress !== token.address}
      <div class="token-address">
        <h3>Primary Contract</h3>
        <AddressPill address={token.primaryAddress} label="primary contract address" />
      </div>
    {/if}

    {#if token.underlyingTokens && token.underlyingTokens.length > 0}
      <div class="underlying-tokens">
        <h3>Underlying Tokens</h3>
        <div class="tokens-list">
          {#each token.underlyingTokens as underlyingToken}
            <UnderlyingTokenItem token={underlyingToken} />
          {/each}
        </div>
      </div>
    {/if}
  </div>

  <!-- <div slot="footer">
    <button class="close-modal-button" on:click={close}>Close</button>
    
     <a href={token.protocolSlug
        ? `https://app.enso.finance/route?chainId=${token.chainId}&tokenOut=${token.address}`
        : `https://etherscan.io/token/${token.address}`}
      target="_blank"
      rel="noopener noreferrer"
      class="view-button"
    >
      {token.protocolSlug ? 'Trade on Enso' : 'View on Etherscan'}
    </a>
  </div> -->
</Modal>

<style>
  .token-info {
    display: flex;
    align-items: center;
    gap: 16px;
  }

  .token-title h2 {
    margin: 0;
    font-size: 20px;
    color: #f0f0f0;
    font-weight: 600;
  }

  .token-subtitle {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-top: 4px;
  }

  .token-symbol {
    color: #a0a0a0;
    font-size: 14px;
  }

  /* Smaller chain badge */
  .chain-badge {
    background-color: #2a2a2a;
    color: #a0a0a0;
    padding: 2px 6px;
    border-radius: 4px;
    font-size: 11px;
    font-weight: 500;
  }

  .close-button {
    background: none;
    border: none;
    color: #a0a0a0;
    font-size: 28px;
    cursor: pointer;
    line-height: 1;
    padding: 0;
    transition: color 0.2s;
  }

  .close-button:hover {
    color: #f0f0f0;
  }

  .modal-content {
    padding: 24px;
    flex: 1;
    overflow-y: auto;
  }

  /* Layout for metrics cards */
  .key-metrics {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    gap: 20px;
    margin-bottom: 28px;
  }

  .token-protocol,
  .underlying-tokens,
  .token-address {
    margin-bottom: 28px;
  }

  .token-protocol h3,
  .underlying-tokens h3,
  .token-address h3 {
    font-size: 16px;
    color: #f0f0f0;
    margin: 0 0 12px 0;
    font-weight: 600;
  }

  .protocol-info {
    display: flex;
    gap: 10px;
    align-items: center;
  }

  .project {
    background-color: #242424;
    padding: 6px 12px;
    border-radius: 6px;
    font-size: 14px;
    font-weight: 500;
  }

  .protocol-slug {
    color: #a0a0a0;
    font-size: 14px;
  }

  .tokens-list {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .close-modal-button,
  .view-button {
    border-radius: 8px;
    padding: 10px 16px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
    border: none;
  }

  .close-modal-button {
    background-color: #2a2a2a;
    color: #f0f0f0;
  }

  .close-modal-button:hover {
    background-color: #333;
  }

  .view-button {
    background: linear-gradient(90deg, #ff3d87, #ff56a9);
    color: white;
    text-decoration: none;
    display: inline-block;
    text-align: center;
  }

  .view-button:hover {
    opacity: 0.9;
    transform: translateY(-1px);
  }

  /* For small devices */
  @media (max-width: 480px) {
    .key-metrics {
      grid-template-columns: 1fr;
    }
  }
</style>
