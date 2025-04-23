<script lang="ts">
  import { run, createBubbler, stopPropagation } from 'svelte/legacy';

  const bubble = createBubbler();
  import { createEventDispatcher, onMount, tick } from 'svelte';
  import { FilterKey, type FilterValue } from '../types';
  import FilterInput from './FilterInput.svelte';
  import FilterSuggestions from './FilterSuggestions.svelte';
  import FilterRangeInput from './FilterRangeInput.svelte';

  import type { Network, ProjectData, Protocol } from '$lib/types/api';

  
  interface Props {
    // Props
    networks?: Network[];
    protocols?: Protocol[];
    projects?: ProjectData[];
    onDismiss?: () => void; // New prop for dismissing dropdown
  }

  let {
    networks = [],
    protocols = [],
    projects = [],
    onDismiss = () => {}
  }: Props = $props();

  // Component state
  let selectedFilter: string | null = $state(null);
  let filterValue: FilterValue = $state('');
  let filterValueSelected: FilterValue = '';
  let showSuggestions = $state(false);
  let suggestions: any[] = $state([]);
  let searchQuery = $state('');
  let filteredOptions: FilterKeyPres[] = $state([]);
  type FilterKeyPres = {
    key: FilterKey;
    description: string;
  };

  // Keyboard navigation state
  let activeOptionIndex = $state(-1);
  let dropdownElement: HTMLElement = $state();

  const dispatch = createEventDispatcher();

  // Filter options to display
  const filterOptions: FilterKeyPres[] = Object.values(FilterKey).map((key) => ({
    key,
    description: getFilterKeyDescription(key)
  }));

  // Keep filter options updated when search changes
  run(() => {
    filteredOptions = filterOptions.filter(
      (option) =>
        option.key.toLowerCase().includes(searchQuery.toLowerCase()) ||
        option.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  // Reset active index when filtered options change
  run(() => {
    if (filteredOptions) {
      activeOptionIndex = filteredOptions.length > 0 ? 0 : -1;
    }
  });

  onMount(() => {
    // Focus the search input when component mounts
    const searchInput = dropdownElement?.querySelector('input');

    if (searchInput) {
      tick().then(() => {
        searchInput.focus();
      });
    }
  });

  // Function to get filter description
  function getFilterKeyDescription(key: string): string {
    const descriptions: Record<string, string> = {
      [FilterKey.ADDRESS]: 'Token address',
      [FilterKey.UNDERLYING_TOKENS]: 'Underlying token address',
      [FilterKey.UNDERLYING_TOKENS_EXACT]: 'Exact underlying token address',
      [FilterKey.APY_FROM]: 'Annual percentage yield',
      [FilterKey.APY_TO]: 'Annual percentage yield',
      [FilterKey.TVL_FROM]: 'Total value locked',
      [FilterKey.TVL_TO]: 'Total value locked',
      [FilterKey.PROTOCOL]: 'Protocol slug',
      [FilterKey.PROJECT]: 'Project name',
      [FilterKey.TYPE]: 'Token type (defi or base)',
      [FilterKey.CHAIN_ID]: 'Blockchain network ID'
    };

    return descriptions[key] || key;
  }

  // Select a filter type
  function selectFilter(key: string) {
    selectedFilter = key;
    filterValue = '';
    showSuggestions = false;

    // Focus the filter value input after selection
    setTimeout(() => {
      const valueInput = dropdownElement?.querySelector('input');
      if (valueInput) {
        valueInput.focus();
      }
    }, 0);
  }

  // Get icon component for filter
  function getFilterIcon(key: string) {
    // Placeholder for icons, will be replaced with actual SVGs
    return '';
  }

  // Handle suggestion select
  function handleSuggestionSelect(event: CustomEvent) {
    filterValue = event.detail.value;
    showSuggestions = false;
    addFilter();
  }
  function handleSuggestionUpdate(event: CustomEvent) {
    filterValueSelected = event.detail.value;
  }

  // Handle input change
  function handleInputChange(event: CustomEvent) {
    const target = event.detail.target as HTMLInputElement;
    filterValue = target.value;

    // Generate suggestions for protocol and chain
    if (selectedFilter === FilterKey.PROTOCOL || selectedFilter === FilterKey.CHAIN_ID || selectedFilter === FilterKey.PROJECT) {
      generateSuggestions(selectedFilter, filterValue as string);
      showSuggestions = true;
    }
  }

  // Handle search input change
  function handleSearchChange(event: any) {
    searchQuery = event.target.value;
  }

  // Generate suggestions based on input
  function generateSuggestions(key: string, value: string) {
    const searchValue = value.toLowerCase();

    switch (key) {
      case FilterKey.PROTOCOL:
        suggestions = protocols
          .filter(
            (protocol) =>
              protocol.slug?.toLowerCase().includes(searchValue) ||
              protocol.name?.toLowerCase().includes(searchValue)
          )
          .map((protocol) => ({
            value: protocol.slug,
            displayText: protocol.name || protocol.slug,
            logo: protocol.logosUri && protocol.logosUri[0],
            metadata: protocol
          }));
        break;
      case FilterKey.PROJECT:
        suggestions = projects
          .filter((project) => project.id?.toLowerCase().includes(searchValue))
          .map((project) => ({
            project: project,
            protocol: protocols.filter((protocol) => protocol.slug === project.id)[0]
          }))
          .map(({ project, protocol }) => ({
            value: project.id,
            displayText: protocol?.name || protocol?.slug || project.id,
            logo: protocol?.logosUri && protocol.logosUri[0],
            metadata: protocol
          }));
        break;

      case FilterKey.CHAIN_ID:
        suggestions = networks
          .filter(
            (network) =>
              network.id.toString().includes(searchValue) ||
              network.name?.toLowerCase().includes(searchValue)
          )
          .map((network) => ({
            value: network.id.toString(),
            displayText: `${network.name} (${network.id})`,
            logo: '',
            metadata: network
          }));
        break;

      default:
        suggestions = [];
    }
  }

  // Add the filter
  function addFilter() {
    if (!selectedFilter || !filterValue) return;
    dispatch('add', {
      filterKey: selectedFilter,
      filterValue
    });

    // Reset after adding
    selectedFilter = null;
    filterValue = '';
    showSuggestions = false;
    searchQuery = '';

    // Focus the search input after adding filter
    setTimeout(() => {
      const searchInput = dropdownElement?.querySelector('input');
      if (searchInput) {
        searchInput.focus();
      }
    }, 0);
  }

  // Close dropdown
  function closeDropdown() {
    dispatch('close');
    dropdownElement?.querySelector('input')?.focus();
    onDismiss(); // Call the onDismiss function prop
  }

  // Check if filter is range type (APY, TVL)
  function isRangeFilter(key: string): boolean {
    return (
      key === FilterKey.APY_FROM ||
      key === FilterKey.APY_TO ||
      key === FilterKey.TVL_FROM ||
      key === FilterKey.TVL_TO
    );
  }

  // Handle range filter changes
  function handleRangeChange(event: CustomEvent) {
    filterValue = event.detail;
  }

  // Keyboard navigation handlers
  function handleKeydown(event: KeyboardEvent) {
    // Handle keyboard navigation in filter selection view
    console.debug('Filter Dropdown KEYDOWN', event.key);
    if (!selectedFilter) {
      switch (event.key) {
        case 'ArrowDown':
          event.preventDefault();
          if (filteredOptions.length > 0) {
            activeOptionIndex = (activeOptionIndex + 1) % filteredOptions.length;
            scrollActiveOptionIntoView();
          }
          break;

        case 'ArrowUp':
          event.preventDefault();
          if (filteredOptions.length > 0) {
            activeOptionIndex =
              (activeOptionIndex - 1 + filteredOptions.length) % filteredOptions.length;
            scrollActiveOptionIntoView();
          }
          break;

        case 'Enter':
          console.debug('Filter Dropdown ENTER');
          event.preventDefault();
          event.stopPropagation();
          if (activeOptionIndex >= 0 && activeOptionIndex < filteredOptions.length) {
            selectFilter(filteredOptions[activeOptionIndex].key);
          }
          break;

        case 'Escape':
          event.preventDefault();
          if (searchQuery) {
            // Clear search if there is any
            searchQuery = '';
          } else {
            // Close dropdown if search is already empty
            closeDropdown();
          }
          break;
      }
    } else {
      // Handle keyboard in filter value view
      if (event.key === 'Escape') {
        event.preventDefault();
        selectedFilter = null; // Go back to filter selection screen
        filterValueSelected = '';
        searchQuery = '';

        // Focus the search input after going back, must be done on next tick
        setTimeout(() => {
          const searchInput = dropdownElement?.querySelector('input');
          if (searchInput) {
            searchInput.focus();
          }
        }, 0);
      } else if (event.key === 'Enter' && filterValueSelected) {
        event.preventDefault();
        filterValue = filterValueSelected;
        filterValueSelected = '';
        addFilter();
      }
    }
  }

  // Scroll active option into view
  function scrollActiveOptionIntoView() {
    setTimeout(() => {
      const activeElement = dropdownElement?.querySelector(`.option-${activeOptionIndex}`);
      if (activeElement) {
        activeElement.scrollIntoView({ block: 'nearest' });
      }
    }, 0);
  }
</script>

<div
  class="filter-dropdown card shadow-lg"
  onwheel={stopPropagation(bubble('wheel'))}
  onkeydown={handleKeydown}
  bind:this={dropdownElement}
  tabindex="-1"
>
  <div class="bg-bg-tertiary sticky top-0 z-10 mb-2 flex items-center justify-between p-4 pb-2">
    <h3 class="text-lg font-medium">Filter Options</h3>
    <button class="btn btn-ghost p-1" onclick={closeDropdown}>
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
    <!-- Search input for filters -->
    <div class="mb-3 px-4">
      <div class="relative">
        <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          <svg
            class="text-text-tertiary h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <circle cx="11" cy="11" r="8"></circle>
            <path d="M21 21l-4.35-4.35"></path>
          </svg>
        </div>
        <input
          type="text"
          placeholder="Search filters..."
          class="form-input py-2 pl-10! border border-brdr-light border"
          bind:value={searchQuery}
          oninput={handleSearchChange}
        />
        {#if searchQuery}
          <button
            class="text-text-tertiary hover:text-text-primary absolute inset-y-0 right-0 flex items-center pr-3"
            onclick={() => (searchQuery = '')}
          >
            <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M18 6L6 18M6 6L18 18"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
              />
            </svg>
          </button>
        {/if}
      </div>
    </div>

    <!-- Filter selection list - fixed height with scrolling -->
    <div class="scrollbar-thin max-h-[60vh] overflow-y-auto px-4 md:max-h-[310px]">
      <div class="flex flex-col gap-2 pb-4">
        {#if filteredOptions.length === 0}
          <div class="text-text-tertiary py-4 text-center">No filters match your search</div>
        {:else}
          {#each filteredOptions as option, index}
            <button
              class="option-{index} hover:bg-bg-hover flex items-center rounded-md border border-none px-2 text-left transition-colors {index ===
              activeOptionIndex
                ? 'border-primary bg-bg-hover from-primary/10 to-secondary/5 bg-gradient-to-r'
                : ''}"
              onclick={() => selectFilter(option.key)}
              onmouseenter={() => (activeOptionIndex = index)}
              aria-selected={index === activeOptionIndex}
            >
              <div class="text-primary mr-2">
                <div
                  class="bg-primary bg-opacity-20 flex h-6 w-6 items-center justify-center rounded-full"
                >
                  <span class="text-xs font-bold">{option.key.slice(0, 1).toUpperCase()}</span>
                </div>
              </div>
              <div class="flex flex-col">
                <div class="text-sm font-medium">{option.key}</div>
                <div class="text-text-tertiary text-xs">{option.description}</div>
              </div>
            </button>
          {/each}
        {/if}
      </div>
    </div>
  {:else}
    <!-- Filter value input -->
    <div class="px-0 pb-4">
      <div class="mb-2 flex items-center">
        <button class="btn btn-ghost mr-2 p-1" onclick={() => selectFilter(null)}>
          <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M15 18L9 12L15 6"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
            />
          </svg>
        </button>
        <h4 class="font-medium">{selectedFilter}</h4>
      </div>

      {#if isRangeFilter(selectedFilter)}
        <!-- Range input for APY or TVL -->
        <FilterRangeInput
          type={selectedFilter.includes('apy') ? 'apy' : 'tvl'}
          on:change={handleRangeChange}
        />
      {:else}
        <!-- Regular input -->
        <div class="relative px-4">
          <FilterInput
            value={filterValue as string}
            placeholder={`Enter ${getFilterKeyDescription(selectedFilter)}...`}
            on:input={handleInputChange}
          />
        </div>

        {#if showSuggestions && suggestions.length > 0}
          <div class="relative mt-1">
            <FilterSuggestions
              {suggestions}
              on:select={handleSuggestionSelect}
              on:update={handleSuggestionUpdate}
            />
          </div>
        {/if}
      {/if}

      <div class="mt-4 px-4">
        <button class="btn btn-primary w-full" onclick={addFilter} disabled={!filterValue}>
          Add Filter
        </button>
      </div>
    </div>
  {/if}
</div>

<style>
  .filter-dropdown {
    position: absolute;
    z-index: 50;
    width: 100%;
    max-width: 32rem;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    max-height: 90vh;
    outline: none; /* Remove outline for tab focus */
  }

  /* Ensure the scrollbar is visible and functional */
  .scrollbar-thin::-webkit-scrollbar {
    width: 4px;
    height: 4px;
  }

  .scrollbar-thin::-webkit-scrollbar-track {
    background: transparent;
  }

  .scrollbar-thin::-webkit-scrollbar-thumb {
    background: var(--color-secondary);
    border-radius: 4px;
  }
</style>
