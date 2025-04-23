<script lang="ts">
  import type { UnderlyingToken } from '../../types';
  import TokenLogo from './TokenLogo.svelte';
  import AddressPill from './AddressPill.svelte';
  
  interface Props {
    token: UnderlyingToken;
  }

  let { token }: Props = $props();
</script>

<div class="bg-surface-overlay rounded p-2 hover:bg-surface-overlay-hover transition-colors">
  <div class="flex items-center gap-2 mb-1">
    <TokenLogo logoUri={token.logosUri?.[0]} symbol={token.symbol} size="xs" fallbackBg="gradient" />
    <div class="flex-1 overflow-hidden">
      <div class="flex items-center gap-1">
        <span class="text-xs font-medium text-text-primary truncate">{token.symbol || 'Unknown'}</span>
        <!-- <span class="text-2xs text-text-tertiary truncate">{token.name || 'Unknown'}</span> -->
      </div>
    </div>
  </div>
  <AddressPill address={token.address} small={true} copyable={true} label="token" />
</div>