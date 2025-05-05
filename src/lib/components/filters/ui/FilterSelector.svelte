<script lang="ts">
  import { createEventDispatcher, onMount } from 'svelte';
  import { filterService } from '$lib/services/filters/filterService';
  import { FilterKey } from '$lib/types';
  import { handleKeyboardShortcuts } from '$lib/utils/keyboard';
  
  // Component state
  let searchQuery = $state('');
  let filteredOptions: FilterKeyPres[] = $state([]);
  let activeOptionIndex = $state(-1);
  let selectorElement: HTMLElement | undefined = $state();
  
  type FilterKeyPres = {
    key: FilterKey;
    description: string;
  };

  // Event dispatcher
  const dispatch = createEventDispatcher();

  // Filter options to display
  const filterOptions: FilterKeyPres[] = Object.values(FilterKey).map((key) => ({
    key,
    description: getFilterKeyDescription(key)
  }));

  // Keep filter options updated when search changes
  $effect(() => {
    filteredOptions = filterOptions.filter(
      (option) =>
        option.key.toLowerCase().includes(searchQuery.toLowerCase()) ||
        option.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  // Reset active index when filtered options change
  $effect(() => {
    if (filteredOptions) {
      activeOptionIndex = filteredOptions.length > 0 ? 0 : -1;
    }
  });

  onMount(() => {
    // Focus the search input when component mounts
    const searchInput = selectorElement?.querySelector('input');
    if (searchInput) {
      searchInput.focus();
    }
  });

  // Get filter description 
  function getFilterKeyDescription(key: string): string {
    return filterService.getFilterKeyDescription(key);
  }

  // Select a filter type
  function selectFilter(key: string) {
    dispatch('select', key);
  }

  // Handle search input change
  function handleSearchChange(event: any) {
    searchQuery = event.target.value;
  }

  // Keyboard navigation
  function handleKeydown(event: KeyboardEvent) {
    const shortcuts = [
      {
        key: 'ArrowDown',
        preventDefault: true,
        callback: () => {
          if (filteredOptions.length > 0) {
            activeOptionIndex = (activeOptionIndex + 1) % filteredOptions.length;
            scrollActiveOptionIntoView();
          }
        }
      },
      {
        key: 'ArrowUp',
        preventDefault: true,
        callback: () => {
          if (filteredOptions.length > 0) {
            activeOptionIndex =
              (activeOptionIndex - 1 + filteredOptions.length) % filteredOptions.length;
            scrollActiveOptionIntoView();
          }
        }
      },
      {
        key: 'Enter',
        preventDefault: true,
        stopPropagation: true,
        callback: () => {
          if (activeOptionIndex >= 0 && activeOptionIndex < filteredOptions.length) {
            selectFilter(filteredOptions[activeOptionIndex].key);
          }
        }
      },
      {
        key: 'Escape',
        preventDefault: true,
        callback: () => {
          if (searchQuery) {
            // Clear search if there is any
            searchQuery = '';
          } else {
            // Close dropdown if search is already empty
            dispatch('close');
          }
        }
      }
    ];

    handleKeyboardShortcuts(event, shortcuts);
  }

  // Scroll active option into view
  function scrollActiveOptionIntoView() {
    setTimeout(() => {
      const activeElement = selectorElement?.querySelector(`.option-${activeOptionIndex}`);
      if (activeElement) {
        activeElement.scrollIntoView({ block: 'nearest' });
      }
    }, 0);
  }
</script>

<div bind:this={selectorElement} onkeydown={handleKeydown}>
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
        class="form-input py-2 pl-10!"
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

  <!-- Filter selection list -->
  <div class="scrollbar-thin h-[300px] overflow-y-auto px-4 md:max-h-[300px]">
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
</div>

<style>
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

