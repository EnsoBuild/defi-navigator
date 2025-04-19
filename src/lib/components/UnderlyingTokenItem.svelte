<!-- UnderlyingTokenItem.svelte -->
<script lang="ts">
  import type { UnderlyingToken } from '../types';
  import TokenLogo from './TokenLogo.svelte';
  import AddressPill from './AddressPill.svelte';
  
  export let token: UnderlyingToken;
</script>

<div class="underlying-token">
  <div class="underlying-token-header">
    <TokenLogo logoUri={token.logosUri?.[0]} symbol={token.symbol} size="sm" />
    
    <div class="underlying-token-info">
      <span class="underlying-token-name">{token.name || 'Unknown'}</span>
      <span class="underlying-token-symbol">{token.symbol || 'Unknown'}</span>
    </div>
  </div>

  <AddressPill address={token.address} small={true} label="token address" />
</div>

<style>
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
</style>