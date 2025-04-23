<script lang="ts">
  import { createBubbler } from 'svelte/legacy';

  const bubble = createBubbler();
  import { fade } from 'svelte/transition';
  
  

  interface Props {
    interactive?: boolean;
    highlightBorder?: boolean;
    animate?: boolean;
    hoverEffect?: 'none' | 'lift' | 'glow' | 'scale';
    children?: import('svelte').Snippet;
    [key: string]: any
  }

  let {
    interactive = false,
    highlightBorder = false,
    animate = true,
    hoverEffect = 'none',
    children,
    ...rest
  }: Props = $props();


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
  onclick={bubble('click')}
  onkeydown={bubble('keydown')}
  {...rest}
>
  {@render children?.()}
</div>

