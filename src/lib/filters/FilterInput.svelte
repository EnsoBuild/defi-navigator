<script lang="ts">
    import { createEventDispatcher } from 'svelte';
    
  interface Props {
    value?: string;
    placeholder?: string;
    type?: string;
  }

  let { value = '', placeholder = 'Enter value...', type = 'text' }: Props = $props();
    
    const dispatch = createEventDispatcher();
    
    function handleInput(event: Event) {
      dispatch('input', event);
    }
  </script>
  
  <input
    {type}
    {placeholder}
    {value}
    oninput={handleInput}
    class="form-input w-full"
  />