<script lang="ts">
  interface Props {
    direction?: 'row' | 'column';
    spacing?: 'sm' | 'md' | 'lg';
    children?: import('svelte').Snippet;
  }

  let { direction = 'row', spacing = 'md', children }: Props = $props();
  
  const spacingClasses = {
    sm: 'gap-3',
    md: 'gap-5',
    lg: 'gap-7'
  };
</script>

<div class={`filter-bar flex ${direction === 'column' ? 'flex-col items-stretch' : 'items-end w-full'} ${spacingClasses[spacing]} mb-5`}>
  {@render children?.()}
</div>

<style>
  @media (max-width: 768px) {
    .filter-bar {
      flex-direction: column !important;
      gap: 1rem !important;
      align-items: stretch !important;
    }
  }
</style>

