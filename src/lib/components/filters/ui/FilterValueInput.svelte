<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { filterService } from '$lib/services/filters/filterService';
  import { FilterKey, type FilterValue } from '$lib/types';
  import { handleKeyboardShortcuts } from '$lib/utils/keyboard';

  import FilterInput from './FilterInput.svelte';
  import FilterRangeInput from './FilterRangeInput.svelte';
  import FilterSuggestions from './FilterSuggestions.svelte';

  // Component props
  let {
    filterKey,
    value = $bindable('')
  }: {
    filterKey: string;
    value: FilterValue;
  } = $props();

  // Component state
  let showSuggestions = $state(false);
  let suggestions: any[] = $state([]);
  let filterValueSelected: FilterValue = '';

  // Event dispatcher
  const dispatch = createEventDispatcher();

  // Check if filter is range type (APY, TVL)
  function isRangeFilter(key: string): boolean {
    return filterService.supportsRangeValues(key as FilterKey);
  }

  // Get filter description
  function getFilterKeyDescription(key: string): string {
    return filterService.getFilterKeyDescription(key);
  }

  // Handle suggestion select
  function handleSuggestionSelectEvent(event: CustomEvent<{ value: string }>) {
    console.log(event);
    value = event.detail.value;
    handleSuggestionSelect(value);
  }

  // Handle suggestion select
  function handleSuggestionSelect(val: string) {
    value = val;
    showSuggestions = false;
    dispatch('add');
  }

  function handleSuggestionUpdate(event: CustomEvent) {
    filterValueSelected = event.detail.value;
  }

  // Handle input change
  function handleInputChange(event: CustomEvent<{ value: string }>) {
    const inputValue = event.detail.value;
    value = inputValue;

    // Generate suggestions for protocol and chain
    if (
      filterKey === FilterKey.PROTOCOL_SLUG ||
      filterKey === FilterKey.CHAIN_ID ||
      filterKey === FilterKey.PROJECT ||
      filterKey === FilterKey.TYPE
    ) {
      // Use the suggestion service
      suggestions = filterService.getSuggestionsForKey(
        filterKey as FilterKey,
        inputValue as string
      );
      showSuggestions = suggestions.length > 0;
    }
  }

  // Handle range filter changes
  function handleRangeChange(event: CustomEvent) {
    value = event.detail;
  }

  // Go back to filter selection
  function goBack() {
    dispatch('back');
  }

  // Add the filter
  function addFilter() {
    if (!value) return;
    dispatch('add');
  }

  // Keyboard event handler
  function handleKeydown(event: KeyboardEvent) {
    // Handle keyboard in filter value view
    const shortcuts = [
      {
        key: 'Escape',
        preventDefault: true,
        callback: goBack
      },
      {
        key: 'Enter',
        preventDefault: filterValueSelected ? true : false,
        callback: () => {
          if (filterValueSelected) {
            value = filterValueSelected;
            filterValueSelected = '';
            handleSuggestionSelect(value);
          }
        }
      }
    ];

    handleKeyboardShortcuts(event, shortcuts);
  }
</script>

<div onkeydown={handleKeydown} class="px-0 pb-4">
  <div class="mb-2 flex items-center">
    <button class="btn btn-ghost mr-2 p-1" onclick={goBack}>
      <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M15 18L9 12L15 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
      </svg>
    </button>
    <h4 class="font-medium">{filterKey}</h4>
  </div>
  <div class="px-4">
    {#if isRangeFilter(filterKey)}
      <!-- Range input for APY or TVL -->
      <FilterRangeInput
        type={filterKey.includes('apy') ? 'apy' : 'tvl'}
        on:change={handleRangeChange}
        onReturn={addFilter}
        fromValue={value.from}
        toValue={value.to}
      />
    {:else}
      <!-- Regular input -->
      <div class="relative">
        <FilterInput
          value={value as string}
          placeholder={`Enter ${getFilterKeyDescription(filterKey)}...`}
          on:input={handleInputChange}
          onReturn={(e) => {!showSuggestions && handleSuggestionSelectEvent(e)}}
        />
      </div>

      {#if showSuggestions && suggestions.length > 0}
        <div class="bottom-full mb-1 w-full">
          <FilterSuggestions
            {suggestions}
            on:select={handleSuggestionSelectEvent}
            on:update={handleSuggestionUpdate}
            onDismiss={() => {}}
            searchValue=""
          />
        </div>
      {/if}
    {/if}

    <div class="mt-4">
      <button class="btn btn-primary w-full" onclick={addFilter} disabled={!value}>
        Add Filter
      </button>
    </div>
  </div>
</div>
