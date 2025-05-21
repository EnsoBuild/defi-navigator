<script lang="ts">
  import { createEventDispatcher } from 'svelte';

  interface Suggestion {
    value: string;
    displayText: string;
    description?: string;
    logo?: string;
    metadata?: any;
  }

  const {
    suggestions = [],
    activeIndex = -1,
    maxHeight = '300px',
    onSelect
  }: {
    suggestions: Suggestion[];
    activeIndex: number;
    maxHeight?: string;
    onSelect: (event: { suggestion: Suggestion }) => void;
  } = $props();

  const dispatch = createEventDispatcher();

  // Handle suggestion selection
  function selectSuggestion(suggestion: Suggestion) {
    onSelect({ suggestion });
  }
</script>

<div
  onwheel={(e) => e.stopPropagation()}
  class="suggestions-list scrollbar-thin flex-1 overflow-y-auto py-1"
  style={`max-height: ${maxHeight}`}
>
  {#each suggestions as suggestion, i}
    <button
      class="suggestion-item flex w-full cursor-pointer items-center gap-2 px-4 py-2 text-left transition-colors
      {i === activeIndex ? 'bg-bg-hover' : 'hover:bg-bg-hover'}"
      onclick={() => selectSuggestion(suggestion)}
      onmouseenter={() => dispatch('hover', { index: i })}
    >
      {#if suggestion.logo}
        <img src={suggestion.logo} alt="" class="h-6 w-6 rounded-full" />
      {:else}
        <div
          class="bg-primary/20 text-primary flex h-6 w-6 items-center justify-center rounded-full"
        >
          <span class="text-xs font-bold"
            >{suggestion.displayText.substring(0, 1).toUpperCase()}</span
          >
        </div>
      {/if}
      <div class="flex-1">
        <div class="text-text-primary font-medium">{suggestion.displayText}</div>
        {#if suggestion.description}
          <div class="text-text-tertiary text-xs">{suggestion.description}</div>
        {/if}
      </div>
    </button>
  {/each}
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
