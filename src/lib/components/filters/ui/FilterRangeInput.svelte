<script lang="ts">
  import { createEventDispatcher } from 'svelte';

  // Props
  let {
    type = 'apy',
    fromValue = $bindable(''),
    toValue = $bindable(''),
    onReturn = () => {}
  }: { type: 'apy' | 'tvl'; fromValue: string; toValue: string; onReturn: () => void } = $props();

  // Event dispatcher
  const dispatch = createEventDispatcher();

  // Dynamic labels and placeholders
  let label = $derived(type === 'apy' ? 'APY Range (%)' : 'TVL Range ($)');
  let fromPlaceholder = $derived(type === 'apy' ? 'Min %' : 'Min $');
  let toPlaceholder = $derived(type === 'apy' ? 'Max %' : 'Max $');

  // Update values and dispatch
  function updateValues() {
    dispatch('change', { from: fromValue, to: toValue });
  }

  // Handle return key
  const returnHit = (e: KeyboardEvent) => {
    if (e.key === 'Enter') {
      updateValues();
      onReturn();
    }
  };
</script>

<div class="range-input">
  <label class="text-text-secondary mb-2 block text-sm">{label}</label>

  <div class="flex items-center gap-2">
    <div class="flex-1">
      <input
        type="number"
        bind:value={fromValue}
        placeholder={fromPlaceholder}
        oninput={updateValues}
        class="form-input w-full"
        min="0"
        onkeydown={returnHit}
        onblur={updateValues}
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
        onkeydown={returnHit}
      />
    </div>
  </div>
</div>
