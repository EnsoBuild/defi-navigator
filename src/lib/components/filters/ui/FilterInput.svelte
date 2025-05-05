<script lang="ts">
  import { createEventDispatcher } from 'svelte';

  
  interface Props {
    // Props
    value?: string;
    placeholder?: string;
    type?: string;
    onReturn: (e: CustomEvent<{ value: string }>) => void;
  }

  let {
    value = '',
    placeholder = 'Enter value...',
    type = 'text',
    onReturn
  }: Props = $props();

  // Event dispatcher
  const dispatch = createEventDispatcher();

  // Handle input changes
  function handleInput(event: any) {
    dispatch('input', { value: event.target.value });
  }
  
  // Handle keydown events
  function onkeydown(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      onReturn(new CustomEvent(value));
    }
  }
</script>

<input {type} {value} oninput={handleInput} class="form-input w-full" {onkeydown} {placeholder} />


