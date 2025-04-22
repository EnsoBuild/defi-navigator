<script lang="ts">
    import { createEventDispatcher } from 'svelte';
    
    // Props
    export let type: 'apy' | 'tvl' = 'apy';
    export let fromValue = '';
    export let toValue = '';
    
    const dispatch = createEventDispatcher();
    
    // Labels and placeholders based on type
    $: label = type === 'apy' ? 'APY Range (%)' : 'TVL Range ($)';
    $: fromPlaceholder = type === 'apy' ? 'Min %' : 'Min $';
    $: toPlaceholder = type === 'apy' ? 'Max %' : 'Max $';
    
    // Update values and dispatch change
    function updateValues() {
      dispatch('change', { from: fromValue, to: toValue });
    }
  </script>
  
  <div class="range-input">
    <label class="block text-text-secondary text-sm mb-2">{label}</label>
    
    <div class="flex items-center gap-2">
      <div class="flex-1">
        <input
          type="number"
          bind:value={fromValue}
          placeholder={fromPlaceholder}
          on:input={updateValues}
          class="form-input w-full"
          min="0"
        />
      </div>
      
      <div class="text-text-tertiary">to</div>
      
      <div class="flex-1">
        <input
          type="number"
          bind:value={toValue}
          placeholder={toPlaceholder}
          on:input={updateValues}
          class="form-input w-full"
          min="0"
        />
      </div>
    </div>
  </div>