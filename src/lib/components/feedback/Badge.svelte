<script lang="ts">
  export let type: 'apy' | 'tvl' | 'default' | 'chain' = 'default';
  export let variant: 'normal' | 'success' | 'highlight' | 'info' = 'normal';
  export let value: string | number;
  export let label: string | null = null;
  export let size: 'sm' | 'md' = 'md';
  
  // Determine appropriate CSS classes based on type and variant
  $: typeClass = (() => {
    if (type === 'apy') {
      if (variant === 'highlight') return 'bg-primary/10 border-primary/20';
      return 'bg-success-light border-success-border';
    }
    if (type === 'tvl') return 'bg-blue-500/10 border-blue-500/20';
    if (type === 'chain') return 'bg-bg-hover';
    return 'bg-white/5 border-white/10';
  })();
  
  // Get appropriate value class for text gradient
  $: valueClass = (() => {
    if (type === 'apy') {
      if (variant === 'highlight') return 'bg-gradient-to-r from-primary to-primary-hover';
      return 'bg-gradient-to-r from-success to-green-400';
    }
    if (type === 'tvl') return 'bg-gradient-to-r from-blue-400 to-blue-500';
    return '';
  })();
  
  // Format value based on type
  $: formattedValue = (() => {
    if (type === 'apy' && typeof value === 'number') {
      return `${value.toFixed(2)}%`;
    }
    return value;
  })();
  
  // Size classes
  $: sizeClass = size === 'sm' ? 'py-1 px-2 text-xs' : 'py-2 px-3 text-sm';
</script>

<div class={`rounded-md ${typeClass} ${sizeClass} inline-flex items-center`}>
  {#if label}
    <span class="text-text-tertiary mr-2">{label}</span>
  {/if}
  
  <span class={`font-medium ${valueClass ? 'bg-clip-text text-transparent' : 'text-text-primary'}`}>
    {formattedValue}
  </span>
</div>

