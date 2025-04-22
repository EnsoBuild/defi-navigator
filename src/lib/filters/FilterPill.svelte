<script lang="ts">
    import { createEventDispatcher } from 'svelte';
    import { FilterKey, type FilterValue } from '../types/index';
    
    // Props
    export let key: string;
    export let value: FilterValue;
    
    const dispatch = createEventDispatcher();
    
    // Format display value based on filter type
    function getDisplayValue(): string {
      if (typeof value === 'object') {
        if (key.includes('apy')) {
          return `${value.from || '0'}% - ${value.to || '∞'}%`;
        } else if (key.includes('tvl')) {
          return `$${value.from || '0'} - $${value.to || '∞'}`;
        }
        return JSON.stringify(value);
      }
      
      return value.toString();
    }
    
    // Get shortened version for address values
    function getShortValue(): string {
      const displayValue = getDisplayValue();
      
      // Shorten addresses
      if (
        (key === FilterKey.ADDRESS || 
         key === FilterKey.UNDERLYING_TOKENS || 
         key === FilterKey.UNDERLYING_TOKENS_EXACT) && 
        displayValue.startsWith('0x') && 
        displayValue.length > 10
      ) {
        return `${displayValue.substring(0, 6)}...${displayValue.substring(displayValue.length - 4)}`;
      }
      
      return displayValue;
    }
    
    // Remove this filter
    function handleRemove() {
      dispatch('remove');
    }
  </script>
  
  <div class="filter-pill flex items-center rounded py-1 pl-3 pr-1 border border-brdr-light hover:border-primary transition-colors">
    <div class="flex items-center">
      <span class="text-text-secondary text-xs mr-2">{key}:</span>
      <span class="text-text-primary text-sm font-medium">{getShortValue()}</span>
    </div>
    
    <button 
      class="ml-2 flex items-center justify-center w-5 h-5 rounded hover:bg-primary/40 hover:bg-opacity-20 transition-colors"
      on:click={handleRemove}
      aria-label="Remove filter"
    >
      <svg class="w-3 h-3" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
      </svg>
    </button>
  </div>