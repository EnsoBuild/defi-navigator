<script lang="ts">
  import { createEventDispatcher } from 'svelte';

  interface Suggestion {
    value: string;
    displayText: string;
    description: string;
    logo?: string;
    metadata?: any;
  }

  export let suggestions: Suggestion[] = [];
  export let activeSuggestion: number = -1;

  const dispatch = createEventDispatcher();

  function handleSelect(suggestion: Suggestion) {
    dispatch('select', { suggestion });
  }
</script>

<ul class="suggestions-list scrollbar-thin max-h-60 overflow-y-auto py-1">
  {#each suggestions as suggestion, i}
    <li
      class="suggestion-item flex cursor-pointer items-center gap-2 px-4 py-2 transition-colors {i ===
      activeSuggestion
        ? 'bg-bg-hover'
        : 'hover:bg-bg-hover'}"
      onclick={() => handleSelect(suggestion)}
    >
      {#if suggestion.logo}
        <img src={suggestion.logo} alt="" class="h-6 w-6 rounded-full" />
      {/if}
      <div class="flex-1">
        <div class="text-text-primary font-medium">{suggestion.displayText}</div>
        <div class="text-text-tertiary text-xs">{suggestion.description}</div>
      </div>
    </li>
  {/each}
</ul>