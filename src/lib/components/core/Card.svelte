<script lang="ts">
  import { fade } from 'svelte/transition';
  
  export let interactive: boolean = false;
  
  export let highlightBorder: boolean = false;

  export let animate: boolean = true;
  export let hoverEffect: 'none' | 'lift' | 'glow' | 'scale' = 'none';


  const hoverClasses = {
    'none': '',
    'lift': 'hover-lift hover:shadow-md',
    'glow': 'hover-glow',
    'scale': 'hover-scale'
  };
</script>

<div 
  class="card p-5 {interactive ? 'card-interactive' : ''} 
  {hoverClasses[hoverEffect]}
  {highlightBorder ? 'border-l-3 border-l-secondary' : ''}"
  in:fade={{ duration: animate ? 300 : 0 }}
  on:click
  on:keydown
  {...$$restProps}
>
  <slot />
</div>

