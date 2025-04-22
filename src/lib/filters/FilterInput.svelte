<script lang="ts">
    import { createEventDispatcher } from 'svelte';
    
    export let value = '';
    export let placeholder = 'Enter value...';
    export let type = 'text';
    
    const dispatch = createEventDispatcher();
    
    function handleInput(event: Event) {
      dispatch('input', event);
    }
  </script>
  
  <input
    {type}
    {placeholder}
    {value}
    on:input={handleInput}
    class="form-input w-full"
  />