<script lang="ts">
  import type { Keyboard } from '@lucide/svelte';
  import { createEventDispatcher } from 'svelte';
  import { on } from 'svelte/events';

  interface Props {
    value?: string;
    placeholder?: string;
    type?: string;
    onReturn: (e: CustomEvent<{ value: string }>) => void;
  }

  let { value = '', placeholder = 'Enter value...', type = 'text', onReturn }: Props = $props();

  const dispatch = createEventDispatcher();

  function handleInput(event: any) {
    dispatch('input', { value: event.target.value });
  }
  function onkeydown(event: KeyboardEvent) {
    // Add your keydown handling logic here
    if (event.key === 'Enter') {
      onReturn(new CustomEvent(value));
    }
  }
</script>

<input {type} {value} oninput={handleInput} class="form-input w-full" {onkeydown} />
