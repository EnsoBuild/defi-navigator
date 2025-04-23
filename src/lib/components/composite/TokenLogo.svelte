<script lang="ts">
  interface Props {
    logoUri?: string | null;
    symbol?: string | null;
    size?: 'xs' | 'sm' | 'md' | 'lg';
    fallbackBg?: 'gradient' | 'solid';
  }

  let {
    logoUri = null,
    symbol = null,
    size = 'md',
    fallbackBg = 'solid'
  }: Props = $props();
  
  const sizeMap = {
    xs: 'w-5 h-5 text-2xs',
    sm: 'w-8 h-8 text-xs',
    md: 'w-12 h-12 text-sm',
    lg: 'w-16 h-16 text-base'
  };
  
  // Format symbol for fallback display
  let displaySymbol = $derived(symbol ? 
    symbol.substring(0, 2).toUpperCase() : 
    '??');
  
  // Handle image loading error
  let hasError = $state(false);
  function handleError() {
    hasError = true;
  }
</script>

<div class={`token-logo rounded-full overflow-hidden flex items-center justify-center ${hasError || !logoUri ? (fallbackBg === 'gradient' ? 'bg-gradient-to-r from-primary/20 to-secondary/20' : 'bg-bg-hover border border-brdr') : ''} ${sizeMap[size]}`}>
  {#if logoUri && !hasError}
    <img 
      src={logoUri} 
      alt={symbol || 'Token'} 
      class="w-full h-full object-cover"
      onerror={handleError}
    />
  {:else}
    <div class="font-bold text-text-primary w-full h-full flex items-center justify-center">
      {displaySymbol}
    </div>
  {/if}
</div>