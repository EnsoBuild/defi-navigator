<script lang="ts">
  import {
    activeFilters,
    filterMode,
    filterParams,
    addFilter as storeAddFilter,
    removeFilter as storeRemoveFilter
  } from '$lib/stores/filterStore';

  import FilterBuilder from '$lib/components/filters/ui/FilterBuilder.svelte';
  import ModeSwitchButton from '$lib/components/common/ModeSwitchButton.svelte';
  import ShareFiltersButton from '$lib/components/common/ShareFiltersButton.svelte';
  import type { FilterKey } from '$lib/types';

  // Handle UI mode switch to CLI
  function onSwitch() {
    filterMode.set('cli');
  }
</script>

<div class="flex w-full items-center gap-3">
  <div class="flex items-center gap-2">
    <ShareFiltersButton tokenParams={$filterParams} />
    <ModeSwitchButton current="ui" {onSwitch} />
  </div>

  <div class="flex-grow">
    <FilterBuilder
      filters={$activeFilters}
    />
  </div>
</div>
