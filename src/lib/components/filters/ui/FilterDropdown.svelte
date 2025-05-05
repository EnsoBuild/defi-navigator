<script lang="ts">
  import { addFilter } from '$lib/stores/filterStore';
  import { FilterKey, type FilterValue } from '$lib/types';
  import { onMount } from 'svelte';
  import FilterSelector from './FilterSelector.svelte';
  import FilterValueInput from './FilterValueInput.svelte';

  // Component props
  const {
    onClose
  }: {
    onClose: () => void;
  } = $props();

  // Component state
  let selectedFilter: string | null = $state(null);
  let filterValue: FilterValue = $state('');
  let dropdownElement: HTMLElement | undefined = $state();

  onMount(() => {
    // Focus the search input when component mounts
    setTimeout(() => {
      const searchInput = dropdownElement?.querySelector('input');
      if (searchInput) {
        searchInput.focus();
      }
    }, 0);
  });

  // Handle filter selection
  function handleFilterSelect(event: CustomEvent<string>) {
    selectedFilter = event.detail;
    filterValue = '';
  }

  // Add the filter
  function handleAddFilter() {
    if (!selectedFilter || !filterValue) return;

    addFilter(selectedFilter as FilterKey, filterValue);

    // Reset after adding
    selectedFilter = null;
    filterValue = '';

    // Focus the search input after adding filter
    setTimeout(() => {
      const searchInput = dropdownElement?.querySelector('input');
      if (searchInput) {
        searchInput.focus();
      }
    }, 0);
  }

  // Back to filter selection
  function handleBackToFilterSelection() {
    selectedFilter = null;
  }

  // Close dropdown
  function closeDropdown() {
    onClose();
  }
</script>

<div
  class="filter-dropdown card shadow-lg"
  onwheel={(e) => {
    e.stopPropagation();
  }}
  bind:this={dropdownElement}
  tabindex="-1"
>
  <div class="bg-bg-tertiary sticky top-0 z-10 mb-2 flex items-center justify-between p-4 pb-2"> 
    <h3 class="text-lg font-medium">Filter Options</h3>
    <button class="btn btn-ghost p-1" onclick={closeDropdown} aria-label="Close dropdown">
      <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M18 6L6 18M6 6L18 18"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
        />
      </svg>
    </button>
  </div>

  {#if !selectedFilter}
    <!-- Filter Selection View -->
    <FilterSelector on:select={handleFilterSelect} on:close={closeDropdown} />
  {:else}
    <!-- Filter Value Input View -->
    <FilterValueInput
      filterKey={selectedFilter}
      bind:value={filterValue}
      on:back={handleBackToFilterSelection}
      on:add={handleAddFilter}
    />
  {/if}
</div>

<style>
  .filter-dropdown {
    z-index: 50;
    width: 100%;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    outline: none;
  }
</style>
