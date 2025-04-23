<script lang="ts">
  import { createEventDispatcher, onMount, afterUpdate } from 'svelte';
  
  // Props
  export let suggestions: Array<{
    value: string;
    displayText: string;
    logo?: string;
    description?: string;
    metadata?: any;
  }>;
  export let onDismiss: () => void = () => {}; // New prop for handling dismissal
  export let searchValue: string = ''; // New prop to track current search value

  const dispatch = createEventDispatcher();
  
  // Selected index state
  let selectedIndex = -1;
  let suggestionsContainer: HTMLElement;
  
  // on selectedIndex update, notify parent component
  $: {
    if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
      dispatch('update', { value: suggestions[selectedIndex].value });
    }
  }

  // Select suggestion
  function selectSuggestion(suggestion: any) {
    dispatch('select', suggestion);
  }

  // Handle keyboard navigation
  function handleKeydown(event: KeyboardEvent) {
    console.debug("Filter Suggestions KEYDOWN", event.key)
    if (suggestions.length === 0) return;

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        event.stopPropagation();
        selectedIndex = (selectedIndex + 1) % suggestions.length;
        break;
      case 'ArrowUp':
        event.preventDefault();
        event.stopPropagation();
        selectedIndex = selectedIndex <= 0 ? suggestions.length - 1 : selectedIndex - 1;
        break;
      case 'Enter':
        console.debug("Filter Suggestions ENTER")
        event.preventDefault();
        event.stopPropagation();
        if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
          selectSuggestion(suggestions[selectedIndex]);
        }else{
          // If no suggestion is selected, we can either clear the input or do nothing
          if (searchValue !== '') {
            //@ts-ignore
            selectSuggestion(event?.target?.value);
          }
        }
        break;
      case 'Escape':
        console.debug("Filter Suggestions ESCAPE")
        event.preventDefault();
        event.stopPropagation();
        if (searchValue === '') {
          // onDismiss();
        } else {
          searchValue = '';
        }
        break;
    }
  }

  // Reset selected index when suggestions change
  $: {
    if (suggestions) {
      selectedIndex = -1;
    }
  }

  // Scroll selected item into view after selectedIndex changes
  afterUpdate(() => {
    if (selectedIndex >= 0 && suggestionsContainer) {
      const selectedElement = suggestionsContainer.querySelector(`.option-${selectedIndex}`);
      if (selectedElement) {
        scrollItemIntoView(selectedElement as HTMLElement);
      }
    }
  });

  // Helper function to scroll item into view with smooth behavior
  function scrollItemIntoView(element: HTMLElement) {
    const containerRect = suggestionsContainer.getBoundingClientRect();
    const elementRect = element.getBoundingClientRect();
    
    // If element is not fully visible in the container
    if (elementRect.bottom > containerRect.bottom || elementRect.top < containerRect.top) {
      // Use scrollIntoView with smooth behavior for a nicer UX
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest'
      });
    }
  }

  onMount(() => {
    // Add global keyboard event listener
    window.addEventListener('keydown', handleKeydown);
    return () => {
      // Clean up event listener
      window.removeEventListener('keydown', handleKeydown);
    };
  });
</script>

<div class="suggestions scrollbar-thin w-full max-h-60 overflow-y-auto px-0" bind:this={suggestionsContainer}>
  <div class="flex flex-col gap-2 py-2">
    {#each suggestions as suggestion, index}
      <button 
        class="option-{index} hover:bg-bg-hover flex items-center rounded-md p-2 text-left transition-colors {
          index === selectedIndex 
            ? 'border-primary bg-bg-hover from-primary/10 to-secondary/5 bg-gradient-to-r' 
            : ''
        }"
        on:click={() => selectSuggestion(suggestion)}
        on:mouseover={() => selectedIndex = index}
      >
        {#if suggestion.logo}
          <div class="flex-shrink-0 w-5 h-5 mr-3">
            <img src={suggestion.logo} alt="" class="w-full h-full object-contain rounded-full" />
          </div>
        {:else}
          <div class="text-primary mr-2">
            <div class="bg-primary bg-opacity-20 flex h-6 w-6 items-center justify-center rounded-full">
              <span class="text-xs font-bold">{suggestion.displayText.slice(0, 1).toUpperCase()}</span>
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
  /* Ensure the scrollbar styling matches FilterDropdown */
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