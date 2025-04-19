<script lang="ts">
  import { fade } from 'svelte/transition';
  import { createEventDispatcher } from 'svelte';
  import type { Token } from '../types';
  import TokenLogo from './TokenLogo.svelte';
  import APYBadge from './APYBadge.svelte';
  import ChainBadge from './ChainBadge.svelte';

  export let token: Token;

  // Use Svelte's event dispatcher instead of DOM events
  const dispatch = createEventDispatcher();

  function openDetails() {
    // Dispatch event using Svelte's mechanism
    dispatch('openDetails', { token });
  }
</script>

<div
  id={`token-${token.address}-${token.chainId}`}
  class="token-card"
  transition:fade
  on:click={openDetails}
  on:keydown={(e) => e.key === 'Enter' && openDetails()}
  tabindex="0"
  role="button"
  aria-label={`View details for ${token.name || 'Unknown Token'}`}
>
  <div class="token-header">
    <TokenLogo logoUri={token.logosUri?.[0]} symbol={token.symbol} />

    <div class="token-info">
      <h3>{token.name || 'Unknown Token'}</h3>
      <span class="token-symbol">{token.symbol || 'Unknown'}</span>
    </div>
  </div>

  <APYBadge apy={token.apy} />
  
  <ChainBadge chainId={token.chainId} />
</div>

<style>
  .token-card {
    border: 1px solid #333;
    border-radius: 12px;
    padding: 20px;
    background-color: #1e1e1e;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    transition:
      transform 0.2s ease,
      box-shadow 0.2s ease,
      border-color 0.2s ease;
    position: relative;
    overflow: hidden;
    cursor: pointer;
  }

  .token-card::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(90deg, #ff3d87, #ff56a9);
    transform: scaleX(0);
    transform-origin: left;
    transition: transform 0.3s ease;
    opacity: 0;
  }

  .token-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
    border-color: #444;
  }

  .token-card:hover::before {
    transform: scaleX(1);
    opacity: 1;
  }

  .token-header {
    display: flex;
    gap: 15px;
    margin-bottom: 15px;
    align-items: center;
  }

  .token-info h3 {
    margin: 0;
    font-size: 18px;
    color: #f0f0f0;
    font-weight: 600;
  }

  .token-symbol {
    color: #a0a0a0;
    font-size: 14px;
    font-weight: 500;
  }
</style>