<script lang="ts">
    import { createEventDispatcher } from 'svelte';
    
    
  interface Props {
    // Props
    type?: 'apy' | 'tvl';
    fromValue?: string;
    toValue?: string;
  }

  let { type = 'apy', fromValue = $bindable(''), toValue = $bindable('') }: Props = $props();
    
    const dispatch = createEventDispatcher();
    
    // Labels and placeholders based on type
    let label = $derived(type === 'apy' ? 'APY Range (%)' : 'TVL Range ($)');
    let fromPlaceholder = $derived(type === 'apy' ? 'Min %' : 'Min $');
    let toPlaceholder = $derived(type === 'apy' ? 'Max %' : 'Max $');
    
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
          oninput={updateValues}
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
          oninput={updateValues}
          class="form-input w-full"
          min="0"
        />
      </div>
    </div>
  </div>