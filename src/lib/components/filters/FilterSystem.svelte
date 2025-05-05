<script lang="ts">
  import { filterMode } from '../../stores/filterStore';
  
  import FilterUI from './ui/FilterUI.svelte';
  import FilterCLI from './cli/FilterCLI.svelte';
</script>

{#if $filterMode === 'ui'}
  <FilterUI />
{:else}
  <FilterCLI />
{/if}


