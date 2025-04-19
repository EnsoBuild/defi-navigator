<!-- FilterBar.svelte -->
<script lang="ts">
  // The FilterBar is just a layout component to organize filters
  export let direction: 'row' | 'column' = 'row';
</script>

<div class="filters" class:filters-column={direction === 'column'}>
  <slot></slot>
</div>

<style>
  .filters {
    display: flex;
    gap: 20px;
    margin-bottom: 20px;
    width: 100%;
    align-items: flex-end;
  }
  
  .filters-column {
    flex-direction: column;
    align-items: stretch;
    gap: 16px;
  }
  
  @media (max-width: 768px) {
    .filters {
      flex-direction: column;
      gap: 16px;
      align-items: stretch;
    }
  }
</style>