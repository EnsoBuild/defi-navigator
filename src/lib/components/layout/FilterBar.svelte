<script lang="ts">
  export let direction: 'row' | 'column' = 'row';
  export let spacing: 'sm' | 'md' | 'lg' = 'md';
  
  const spacingClasses = {
    sm: 'gap-3',
    md: 'gap-5',
    lg: 'gap-7'
  };
</script>

<div class={`filter-bar flex ${direction === 'column' ? 'flex-col items-stretch' : 'items-end w-full'} ${spacingClasses[spacing]} mb-5`}>
  <slot></slot>
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

