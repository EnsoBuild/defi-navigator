<script lang="ts">
  import type { FilterItem } from '$lib/types';
  import {
    ListFilterPlus,
    Trash2Icon
  } from '@lucide/svelte';
  import { fly } from 'svelte/transition';

  import Button from '$lib/components/common/Button.svelte';
  import FilterPill from '$lib/components/filters/shared/FilterPill.svelte';
  import FilterDropdown from '$lib/components/filters/ui/FilterDropdown.svelte';
  import { clearFilters } from '$lib/stores/filterStore';

  const { filters = [] } = $props<{
    filters: FilterItem[];
  }>();

  // Component state
  let isDropdownOpen = $state(false);

  // Toggle filter dropdown
  function toggleDropdown() {
    isDropdownOpen = !isDropdownOpen;
  }
</script>

<div class="filter-builder relative flex-1">
  <!-- Filter dropdown -->
  {#if isDropdownOpen}
    <div
      class="bg-opacity-50 fixed inset-0 z-40 h-full w-full bg-none"
      onclick={toggleDropdown}
    ></div>
    <div
      class="absolute right-0 bottom-0 left-0 z-10 z-50 flex h-[90vh] w-full -translate-y-20 items-end justify-between"
      transition:fly={{ y: -5, duration: 150 }}
    >
      <FilterDropdown onClose={toggleDropdown} />
    </div>
  {/if}

  <!-- Filter pills display -->
  <div class="inset-0 mt-2 flex items-end gap-2">
    <div>
      <div class="filter-pills mt-2 mb-2 ml-1 flex flex-wrap gap-2">
        {#if filters.length > 0}
          {#each filters as filter}
            <FilterPill key={filter.key} value={filter.value} />
          {/each}
          <Button
            size="sm"
            class="pt-2 pr-1 pb-1 pl-3 hover:cursor-pointer"
            on:click={() => clearFilters()}
          >
            <Trash2Icon size={16} />
          </Button>
        {/if}
      </div>

      <Button
        type="primary"
        size="sm"
        on:click={toggleDropdown}
        aria-haspopup="true"
        aria-expanded={isDropdownOpen}
      >
        <span class="mr-2">Filter</span>
        <ListFilterPlus class="transition-transform group-hover:translate-y-1" size={16} />
      </Button>
    </div>
  </div>
</div>
