<script lang="ts">
  import { fade, scale } from 'svelte/transition';
  import { createEventDispatcher } from 'svelte';
  import type { Token } from '../types';

  export let token: Token;
  export let showOverlay: boolean = false;

  const dispatch = createEventDispatcher();

  function close() {
    dispatch('close');
  }

  // Close when clicking outside of the modal
  function handleBackdropClick(event: MouseEvent) {
    if (event.target === event.currentTarget) {
      close();
    }
  }

  // Copy address to clipboard
  function copyToClipboard(text: string) {
    navigator.clipboard.writeText(text);
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

{#if showOverlay}
  <div
    class="overlay"
    transition:fade={{ duration: 200 }}
    on:click={handleBackdropClick}
    on:keydown={(e) => e.key === 'Escape' && close()}
  >
    <div
      class="modal"
      transition:scale={{ duration: 300, start: 0.95 }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div class="modal-header">
        <div class="token-info">
          <div class="token-logo">
            {#if token.logosUri && token.logosUri.length > 0}
              <img src={token.logosUri[0]} alt={token.symbol || 'Token'} />
            {:else}
              <div class="placeholder-logo">{token.symbol?.substring(0, 2) || '??'}</div>
            {/if}
          </div>

          <div class="token-title">
            <h2 id="modal-title">{token.name || 'Unknown Token'}</h2>
            <div class="token-subtitle">
              <span class="token-symbol">{token.symbol || 'Unknown'}</span>
              <span class="chain-badge">Chain: {token.chainId}</span>
            </div>
          </div>
        </div>

        <button class="close-button" on:click={close} aria-label="Close details"> × </button>
      </div>

      <div class="modal-content">
        <!-- APY and TVL Section (Featured prominently) -->
        <div class="key-metrics">
          {#if token.apy !== null && token.apy !== undefined}
            <div class="key-metric apy-card" class:high-apy-card={token.apy > 5}>
              <div class="metric-header">Annual Percentage Yield</div>
              <div class="metric-value apy-value" class:high-apy={token.apy > 5}>
                {token.apy.toFixed(2)}%
              </div>
              {#if token.apyBase !== null && token.apyReward !== null}
                <div class="metric-breakdown">
                  <div class="breakdown-item">
                    <span>Base</span>
                    <span>{token.apyBase.toFixed(2)}%</span>
                  </div>
                  <div class="breakdown-item">
                    <span>Reward</span>
                    <span>{token.apyReward.toFixed(2)}%</span>
                  </div>
                </div>
              {/if}
            </div>
          {/if}

          {#if token.tvl !== null && token.tvl !== undefined}
            <div class="key-metric tvl-card">
              <div class="metric-header">Total Value Locked</div>
              <div class="metric-value tvl-value">
                {formatTVL(token.tvl)}
              </div>
            </div>
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
          <div class="address-container">
            <code class="address">{token.address}</code>
            <button
              class="copy-button"
              on:click={() => copyToClipboard(token.address)}
              aria-label="Copy token address"
            >
              Copy
            </button>
          </div>
        </div>

        {#if token.primaryAddress && token.primaryAddress !== token.address}
          <div class="token-address">
            <h3>Primary Contract</h3>
            <div class="address-container">
              <code class="address">{token.primaryAddress}</code>
              <button
                class="copy-button"
                on:click={() => copyToClipboard(token.primaryAddress)}
                aria-label="Copy primary contract address"
              >
                Copy
              </button>
            </div>
          </div>
        {/if}

        {#if token.underlyingTokens && token.underlyingTokens.length > 0}
          <div class="underlying-tokens">
            <h3>Underlying Tokens</h3>
            <div class="tokens-list">
              {#each token.underlyingTokens as underlyingToken}
                <div class="underlying-token">
                  <div class="underlying-token-header">
                    <div class="token-mini-logo">
                      {#if underlyingToken.logosUri && underlyingToken.logosUri.length > 0}
                        <img
                          src={underlyingToken.logosUri[0]}
                          alt={underlyingToken.symbol || 'Token'}
                        />
                      {:else}
                        <div class="placeholder-mini-logo">
                          {underlyingToken.symbol?.substring(0, 2) || '??'}
                        </div>
                      {/if}
                    </div>
                    <div class="underlying-token-info">
                      <span class="underlying-token-name">{underlyingToken.name || 'Unknown'}</span>
                      <span class="underlying-token-symbol"
                        >{underlyingToken.symbol || 'Unknown'}</span
                      >
                    </div>
                  </div>

                  <div class="underlying-address-container">
                    <code class="underlying-address">{underlyingToken.address}</code>
                    <button
                      class="copy-button underlying-copy"
                      on:click={() => copyToClipboard(underlyingToken.address)}
                      aria-label={`Copy ${underlyingToken.symbol || 'token'} address`}
                    >
                      Copy
                    </button>
                  </div>
                </div>
              {/each}
            </div>
          </div>
        {/if}
      </div>

      <div class="modal-footer">
        <button class="close-modal-button" on:click={close}>Close</button>
        <a
          href={token.protocolSlug
            ? `https://app.enso.finance/route?chainId=${token.chainId}&tokenOut=${token.address}`
            : `https://etherscan.io/token/${token.address}`}
          target="_blank"
          rel="noopener noreferrer"
          class="view-button"
        >
          {token.protocolSlug ? 'Trade on Enso' : 'View on Etherscan'}
        </a>
      </div>
    </div>
  </div>
{/if}

<style>
  .overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.7);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    backdrop-filter: blur(2px);
  }

  .modal {
    background-color: #1a1a1a;
    border-radius: 16px;
    width: 90%;
    max-width: 600px;
    max-height: 85vh;
    overflow-y: auto;
    box-shadow:
      0 20px 25px -5px rgba(0, 0, 0, 0.5),
      0 10px 10px -5px rgba(0, 0, 0, 0.4);
    border: 1px solid #2a2a2a;
    display: flex;
    flex-direction: column;
  }

  .modal-header {
    padding: 20px 24px;
    border-bottom: 1px solid #2a2a2a;
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: sticky;
    top: 0;
    background-color: #1a1a1a;
    z-index: 10;
    border-top-left-radius: 16px;
    border-top-right-radius: 16px;
  }

  .token-info {
    display: flex;
    align-items: center;
    gap: 16px;
  }

  .token-logo {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #2a2a2a;
    border: 1px solid #333;
  }

  .token-logo img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .placeholder-logo {
    font-weight: bold;
    color: #f0f0f0;
    font-size: 16px;
    background-color: #444;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
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

  /* Enhanced APY and TVL cards */
  .key-metrics {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    gap: 20px;
    margin-bottom: 28px;
  }

  .key-metric {
    padding: 14px;
    border-radius: 14px;
    display: flex;
    flex-direction: column;
    gap: 6px;
    position: relative;
    overflow: hidden;
  }

  .apy-card {
    background-color: rgba(74, 222, 128, 0.08);
    border: 1px solid rgba(74, 222, 128, 0.2);
  }

  .high-apy-card {
    background-color: rgba(255, 61, 135, 0.08);
    border: 1px solid rgba(255, 61, 135, 0.2);
  }

  .tvl-card {
    background-color: rgba(59, 130, 246, 0.08);
    border: 1px solid rgba(59, 130, 246, 0.2);
  }

  .metric-header {
    color: #a0a0a0;
    font-size: 14px;
    font-weight: 500;
  }

  .metric-value {
    font-size: 18px;
    font-weight: 700;
    margin: 6px 0;
  }

  .apy-value {
    color: #4ade80;
    background: linear-gradient(90deg, #4ade80, #34d399);
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  .high-apy {
    color: #ff3d87;
    background: linear-gradient(90deg, #ff3d87, #ff56a9);
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  .tvl-value {
    color: #60a5fa;
    background: linear-gradient(90deg, #60a5fa, #3b82f6);
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  .metric-breakdown {
    margin-top: 8px;
    display: flex;
    flex-direction: column;
    gap: 6px;
    padding-top: 10px;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
  }

  .breakdown-item {
    display: flex;
    justify-content: space-between;
    font-size: 13px;
    color: #d1d1d1;
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

  .underlying-token {
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding: 16px;
    background-color: #242424;
    border-radius: 10px;
  }

  .underlying-token-header {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .token-mini-logo {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #2a2a2a;
    flex-shrink: 0;
  }

  .token-mini-logo img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .placeholder-mini-logo {
    font-weight: bold;
    color: #f0f0f0;
    font-size: 12px;
    background-color: #444;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .underlying-token-info {
    display: flex;
    flex-direction: column;
    flex: 1;
  }

  .underlying-token-name {
    font-size: 14px;
    color: #f0f0f0;
    font-weight: 500;
  }

  .underlying-token-symbol {
    font-size: 12px;
    color: #a0a0a0;
  }

  /* Address containers for both main and underlying tokens */
  .address-container,
  .underlying-address-container {
    display: flex;
    background-color: #1a1a1a;
    border-radius: 8px;
    padding: 2px;
    align-items: center;
    font-family: 'Roboto Mono', monospace;
    overflow: hidden;
    border: 1px solid #333;
  }

  .underlying-address-container {
    margin-top: 4px;
  }

  .address,
  .underlying-address {
    padding: 8px 10px;
    font-size: 13px;
    color: #a0a0a0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    flex: 1;
  }

  .underlying-address {
    font-size: 12px;
    padding: 6px 8px;
  }

  .copy-button {
    background-color: #2a2a2a;
    border: none;
    color: #f0f0f0;
    padding: 8px 12px;
    border-radius: 6px;
    cursor: pointer;
    margin-right: 4px;
    font-size: 13px;
    transition: background-color 0.2s;
    white-space: nowrap;
  }

  .underlying-copy {
    padding: 6px 10px;
    font-size: 12px;
  }

  .copy-button:hover {
    background-color: #333;
  }

  .modal-footer {
    padding: 16px 24px;
    border-top: 1px solid #2a2a2a;
    display: flex;
    justify-content: space-between;
    position: sticky;
    bottom: 0;
    background-color: #1a1a1a;
    border-bottom-left-radius: 16px;
    border-bottom-right-radius: 16px;
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
    .modal {
      width: 95%;
      max-height: 95vh;
    }

    .key-metrics {
      grid-template-columns: 1fr;
    }

    .token-logo {
      width: 40px;
      height: 40px;
    }

    .token-title h2 {
      font-size: 18px;
    }

    .modal-header,
    .modal-content,
    .modal-footer {
      padding: 16px;
    }

    .metric-value {
      font-size: 24px;
    }
  }
</style>
