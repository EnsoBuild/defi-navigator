<script lang="ts">
  interface Props {
    title: string;
    value: string | number;
    type?: 'apy' | 'tvl' | 'default';
    subValues?: {label: string, value: string | number}[];
    highlightThreshold?: number; // For APY
  }

  let {
    title,
    value,
    type = 'default',
    subValues = [],
    highlightThreshold = 5
  }: Props = $props();
  
  // Determine if high APY for styling
  let isHighAPY = $derived(type === 'apy' && typeof value === 'number' && value > highlightThreshold);
  
  // Simplified type classes
  let cardClass = $derived(type === 'apy' 
    ? isHighAPY ? 'bg-pink-500/10' : 'bg-success-light' 
    : type === 'tvl' ? 'bg-blue-500/10' : 'bg-bg-secondary');
    
  // Simplified text gradient
  let textClass = $derived(type === 'apy'
    ? isHighAPY ? 'text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary' 
    : 'text-success'
    : type === 'tvl' ? 'text-blue-400' : 'text-text-primary');
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