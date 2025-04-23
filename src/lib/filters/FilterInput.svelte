<script lang="ts">
    import { createEventDispatcher } from 'svelte';
  import { on } from 'svelte/events';
    
  interface Props {
    value?: string;
    placeholder?: string;
    type?: string;
    onReturn: (value: string) => void;
  }

  let { value = '', placeholder = 'Enter value...', type = 'text', onReturn }: Props = $props();
    
    const dispatch = createEventDispatcher();
    
    function handleInput(event: Event) {
      dispatch('input', event);
    }
    function onkeydown(event: KeyboardEvent) {
      // Add your keydown handling logic here
      if (event.key === 'Enter') {
        onReturn(value);
      }
    }
  </script>
  
  <input
    {type}
    {value}
    oninput={handleInput}
    class="form-input w-full"
    {onkeydown}
  />