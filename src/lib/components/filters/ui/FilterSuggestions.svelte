<script lang="ts">
  import { createEventDispatcher, onMount } from 'svelte';
  import { handleKeyboardShortcuts } from '$lib/utils/keyboard';

  // Props
  let {
    suggestions = [],
    onDismiss,
    searchValue
  }: {
    suggestions: Array<{
      value: string;
      displayText: string;
      logo?: string;
      description?: string;
      metadata?: any;
    }>;
    onDismiss: () => void;
    searchValue: string;
  } = $props();

  // Event dispatcher
  const dispatch = createEventDispatcher();

  // Selected index state
  let selectedIndex = $state(-1);
  let suggestionsContainer: HTMLElement;

  // Update parent on selection change
  $effect(() => {
    if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
      dispatch('update', { value: suggestions[selectedIndex].value });
    }
  });

  // Select suggestion
  function selectSuggestion(suggestion: any) {
    dispatch('select', { value: suggestion.value });
  }

  // Handle keyboard navigation
  function handleKeydown(event: KeyboardEvent) {
    if (suggestions.length === 0) return;

    const shortcuts = [
      {
        key: 'ArrowDown',
        preventDefault: true,
        stopPropagation: true,
        callback: () => {
          selectedIndex = (selectedIndex + 1) % suggestions.length;
        }
      },
      {
        key: 'ArrowUp',
        preventDefault: true,
        stopPropagation: true,
        callback: () => {
          selectedIndex = selectedIndex <= 0 ? suggestions.length - 1 : selectedIndex - 1;
        }
      },
      {
        key: 'Enter',
        preventDefault: true,
        stopPropagation: true,
        callback: () => {
          console.log("FilterSuggestions", selectedIndex);
          if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
            selectSuggestion(suggestions[selectedIndex]);
          } else {
            // If no suggestion is selected, try to use current value
            if (searchValue !== '') {
              selectSuggestion({ value: event?.target?.value || searchValue });
            }
          }
        }
      },
      {
        key: 'Escape',
        preventDefault: true,
        stopPropagation: true,
        callback: () => {
          if (searchValue === '') {
            onDismiss();
          } else {
            searchValue = '';
          }
        }
      }
    ];

    handleKeyboardShortcuts(event, shortcuts);
  }

  // Reset selected index when suggestions change
  $effect(() => {
    if (suggestions.length > 0) {
      selectedIndex = 0;
    } else {
      selectedIndex = -1;
    }
  });

  // Scroll selected item into view
  $effect(() => {
    if (selectedIndex >= 0 && suggestionsContainer) {
      const selectedElement = suggestionsContainer.querySelector(`.option-${selectedIndex}`);
      if (selectedElement) {
        scrollItemIntoView(selectedElement as HTMLElement);
      }
    }
  });

  // Helper to scroll item into view
  function scrollItemIntoView(element: HTMLElement) {
    const containerRect = suggestionsContainer.getBoundingClientRect();
    const elementRect = element.getBoundingClientRect();

    if (elementRect.bottom > containerRect.bottom || elementRect.top < containerRect.top) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest'
      });
    }
  }

  // Set up keyboard handlers
  onMount(() => {
    window.addEventListener('keydown', handleKeydown);
    return () => {
      window.removeEventListener('keydown', handleKeydown);
    };
  });
</script>

<div
  class="suggestions scrollbar-thin h-[300px] w-full overflow-y-auto px-0 md:max-h-[300px]"
  bind:this={suggestionsContainer}
>
  <div class="flex flex-col gap-2 py-2">
    {#each suggestions as suggestion, index}
      <button
        class="option-{index} hover:bg-bg-hover flex items-center rounded-md p-2 text-left transition-colors {index ===
        selectedIndex
          ? 'border-primary bg-bg-hover from-primary/10 to-secondary/5 bg-gradient-to-r'
          : ''}"
        onclick={() => selectSuggestion(suggestion)}
        onmouseover={() => (selectedIndex = index)}
      >
        {#if suggestion.logo}
          <div class="mr-3 h-5 w-5 flex-shrink-0">
            <img src={suggestion.logo} alt="" class="h-full w-full rounded-full object-contain" />
          </div>
        {:else}
          <div class="text-primary mr-2">
            <div
              class="bg-primary bg-opacity-20 flex h-6 w-6 items-center justify-center rounded-full"
            >
              <span class="text-xs font-bold"
                >{suggestion.displayText.slice(0, 1).toUpperCase()}</span
              >
            </div>
          </div>
        {/if}
        <div class="flex flex-col">
          <div class="text-sm font-medium">{suggestion.displayText}</div>
          {#if suggestion.description}
            <div class="text-text-tertiary text-xs">{suggestion.description}</div>
          {/if}
        </div>
      </button>
    {/each}
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

