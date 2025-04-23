<script lang="ts">
  import type { Address, Network, ProjectData, Protocol } from '$lib/types/api';
  import { createEventDispatcher, onMount, tick } from 'svelte';
  import { FilterKey } from '../types/index';
  import FilterDropdown from './FilterDropdown.svelte';
  import FilterPill from './FilterPill.svelte';
  import type { TokenParams } from '../types/api';
  import { unpackTokenParams } from '$lib/search/web';
  import ShareFiltersButton from '$lib/components/core/ShareFiltersButton.svelte';
  import { ListFilterPlus } from '@lucide/svelte';
  import ModeSwitchButton from '$lib/components/ModeSwitchButton.svelte';
  // Props
  export let networks: Network[] = [];
  export let protocols: Protocol[] = [];
  export let projects: ProjectData[] = [];
  export let tokenParams: TokenParams = {};
  export let onSwitch: (other: 'ui' | 'cli') => void = () => {};
  // TODO: Deduplicate this with the one in TokenSearch
  type FilterValue = { key: string; value: string | { from: number; to: number } };

  // Component state
  let isDropdownOpen = false;
  let filters: FilterValue[] = [];

  const dispatch = createEventDispatcher();

  onMount(() => {
    filters = unpackTokenParams(tokenParams);
    console.debug('Unpacked filters:', filters);

    if (filters.length > 0) {
      tick().then(() => {
        isDropdownOpen = true;
      });
    }
  });

  // Toggle dropdown
  function toggleDropdown() {
    isDropdownOpen = !isDropdownOpen;
  }

  // Add new filter
  function addFilter(event: CustomEvent) {
    console.debug('Add filter', event);
    const { filterKey, filterValue } = event.detail;
    filters = [...filters, { key: filterKey, value: filterValue }];
    updateTokenParams();
  }

  // Remove filter
  function removeFilter(index: number) {
    filters = filters.filter((_, i) => i !== index);
    updateTokenParams();
  }

  // Update filter
  function updateFilter(index: number, value: any) {
    filters[index].value = value;
    filters = [...filters]; // Trigger reactivity
    updateTokenParams();
  }

  // Transform filters to TokenParams and dispatch
  function updateTokenParams() {
    tokenParams = {};
    console.debug('Fitlers for update', filters);
    filters.forEach((filter: FilterValue) => {
      const { key, value } = filter;

      // Handle range filters (TVL, APY)
      if (typeof value === 'object' && (value.from || value.to)) {
        if (key === FilterKey.APY_FROM || key === FilterKey.APY_TO) {
          if (value.from) tokenParams[FilterKey.APY_FROM] = Number(value.from);
          if (value.to) tokenParams[FilterKey.APY_TO] = Number(value.to);
        } else if (key === FilterKey.TVL_FROM || key === FilterKey.TVL_TO) {
          if (value.from) tokenParams[FilterKey.TVL_FROM] = Number(value.from);
          if (value.to) tokenParams[FilterKey.TVL_TO] = Number(value.to);
        }
        return;
      }

      // Handle multiple underlying tokens
      if (key === FilterKey.UNDERLYING_TOKENS || key === FilterKey.UNDERLYING_TOKENS_EXACT) {
        // Problematic for Address | Address[]
        //@ts-ignore TODO
        tokenParams[key]!.push(value as Address);
      } else {
        //@ts-ignore TODO
        tokenParams[key] = value;
      }
    });

    dispatch('filter', tokenParams);
  }
</script>

<div class="filter-builder relative">
  <!-- Filter pills -->

  <div class="inset-0 mt-2 flex items-end gap-2">
    <div class="flex items-center gap-2">
      <ShareFiltersButton {tokenParams} />
      <ModeSwitchButton current="ui" {onSwitch} className="p-1 px-3" />
    </div>
    <div>
      <div class="filter-pills mt-2 mb-2 ml-1 flex flex-wrap gap-2">
        {#if filters.length > 0}
          {#each filters as filter, index}
            <FilterPill
              key={filter.key}
              value={filter.value}
              on:remove={() => removeFilter(index)}
              on:update={(e) => updateFilter(index, e.detail)}
            />
          {/each}
        {/if}
      </div>

      <button
        class="btn btn-primary btn-sm group p-1 px-3"
        on:click={toggleDropdown}
        aria-haspopup="true"
        aria-expanded={isDropdownOpen}
      >
        <span class="mr-2">Filter</span>
        <ListFilterPlus class="transition-transform group-hover:translate-y-1" size={16} />
      </button>
      {#if isDropdownOpen}
        <div
          class="bg-opacity-50 fixed inset-0 z-40 bg-black md:hidden"
          on:click={toggleDropdown}
        ></div>
        <div class="relative top-full left-0 z-50 mt-2 w-full md:absolute md:w-96">
          <FilterDropdown
            {networks}
            {protocols}
            {projects}
            on:close={toggleDropdown}
            on:add={addFilter}
            onDismiss={() => (isDropdownOpen = false)}
          />
        </div>
      {/if}
    </div>
  </div>
</div>
