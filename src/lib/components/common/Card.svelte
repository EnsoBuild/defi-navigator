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
    [key: string]: any;
    size: 'sm' | 'md' | 'lg' | 'xl';
  }

  let {
    interactive = false,
    highlightBorder = false,
    animate = true,
    hoverEffect = 'none',
    children,
    size = 'md',
    ...rest
  }: Props = $props();

  let padding =
    size == 'sm'
      ? 'p-4'
      : size == 'md'
        ? 'p-5'
        : size == 'lg'
          ? 'p-6'
          : size == 'xl'
            ? 'p-8'
            : 'p-5';

  const hoverClasses = {
    none: '',
    lift: 'hover-lift hover:shadow-md',
    glow: 'hover-glow',
    scale: 'hover-scale'
  };
</script>

<div
  class="card {padding} {interactive ? 'card-interactive' : ''} 
  {hoverClasses[hoverEffect]}
  {highlightBorder ? 'border-l-secondary border-l-3' : ''}"
  in:fade={{ duration: animate ? 300 : 0 }}
  onclick={bubble('click')}
  onkeydown={bubble('keydown')}
  {...rest}
>
  {@render children?.()}
</div>
