<script lang="ts">
  export let title: string;
  export let value: string | number;
  export let type: 'apy' | 'tvl' | 'default' = 'default';
  export let subValues: {label: string, value: string | number}[] = [];
  export let highlightThreshold: number = 5; // For APY
  
  // Determine if high APY for styling
  $: isHighAPY = type === 'apy' && typeof value === 'number' && value > highlightThreshold;
  
  // Simplified type classes
  $: cardClass = type === 'apy' 
    ? isHighAPY ? 'bg-pink-500/10' : 'bg-success-light' 
    : type === 'tvl' ? 'bg-blue-500/10' : 'bg-bg-secondary';
    
  // Simplified text gradient
  $: textClass = type === 'apy'
    ? isHighAPY ? 'text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary' 
    : 'text-success'
    : type === 'tvl' ? 'text-blue-400' : 'text-text-primary';
</script>

<div class={`p-4 rounded-lg ${cardClass} border border-brdr-light shadow-sm hover:shadow-md transition-all`}>
  <div class="text-text-tertiary text-sm mb-1">{title}</div>
  
  <div class={`text-lg font-bold ${textClass}`}>
    {#if typeof value === 'number'}
      {type === 'apy' ? `${value.toFixed(2)}%` : value}
    {:else}
      {value}
    {/if}
  </div>
  
  {#if subValues.length > 0}
    <div class="mt-3 space-y-1 pt-2 border-t border-brdr-light">
      {#each subValues as { label, value }}
        <div class="flex justify-between text-xs text-text-secondary">
          <span>{label}</span>
          <span>
            {#if typeof value === 'number'}
              {type === 'apy' ? `${value.toFixed(2)}%` : value}
            {:else}
              {value}
            {/if}
          </span>
        </div>
      {/each}
    </div>
  {/if}
</div>