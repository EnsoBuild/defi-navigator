<script lang="ts">
  import { createEventDispatcher } from 'svelte';

  interface Props {
    // Props
    type?: 'apy' | 'tvl';
    fromValue?: string;
    toValue?: string;
    onReturn: () => void;
  }

  let {
    type = 'apy',
    fromValue = $bindable(''),
    toValue = $bindable(''),
    onReturn = () => {}
  }: Props = $props();

  const dispatch = createEventDispatcher();

  // Labels and placeholders based on type
  let label = $derived(type === 'apy' ? 'APY Range (%)' : 'TVL Range ($)');
  let fromPlaceholder = $derived(type === 'apy' ? 'Min %' : 'Min $');
  let toPlaceholder = $derived(type === 'apy' ? 'Max %' : 'Max $');

  // Update values and dispatch change
  function updateValues() {
    console.debug('Update Values', { fromValue, toValue });
    dispatch('change', { from: fromValue, to: toValue });
  }

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
