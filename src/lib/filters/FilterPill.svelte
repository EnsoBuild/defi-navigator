<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { FilterKey, type FilterValue } from '../types/index';

  interface Props {
    // Props
    key: string;
    value: FilterValue;
  }

  let { key, value }: Props = $props();

  const dispatch = createEventDispatcher();

  // Format display value based on filter type
  let displayValue = $derived(() => {
    if (typeof value === 'object') {
      if (key.includes('apy')) {
        return `${value.from || '0'}% - ${value.to || '∞'}%`;
      } else if (key.includes('tvl')) {
        return `$${value.from || '0'} - $${value.to || '∞'}`;
      }
      return JSON.stringify(value);
    }

    return value.toString();
  });

  // Get shortened version for address values
  function getShortValue(): string {
    const _displayValue = displayValue();

    // Shorten addresses
    if (
      (key === FilterKey.ADDRESS ||
        key === FilterKey.UNDERLYING_TOKENS ||
        key === FilterKey.UNDERLYING_TOKENS_EXACT) &&
      _displayValue.startsWith('0x') &&
      _displayValue.length > 10
    ) {
      return `${_displayValue.substring(0, 6)}...${_displayValue.substring(_displayValue.length - 4)}`;
    }

    return _displayValue;
  }

  // Remove this filter
  function handleRemove() {
    dispatch('remove');
  }
</script>

<div
  class="filter-pill border-brdr-light hover:border-primary flex items-center rounded border py-1 pr-1 pl-3 transition-colors"
>
  <div class="flex items-center">
    <span class="text-text-secondary mr-2 text-xs">{key}:</span>
    <span class="text-text-primary text-sm font-medium">{getShortValue()}</span>
  </div>

  <button
    class="hover:bg-primary/40 hover:bg-opacity-20 ml-2 flex h-5 w-5 items-center justify-center rounded transition-colors"
    onclick={handleRemove}
    aria-label="Remove filter"
  >
    <svg class="h-3 w-3" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M18 6L6 18M6 6L18 18"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
      />
    </svg>
  </button>
</div>
