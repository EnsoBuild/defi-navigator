<script lang="ts">
  import { onMount } from 'svelte';
  import { fly } from 'svelte/transition';
  import { filterService } from '$lib/services/filters/filterService';
  import { FilterKey } from '$lib/types';
  import {
    searchQuery,
    filterParams,
    updateQueryString,
    filterMode
  } from '$lib/stores/filterStore';
  import { handleKeyboardShortcuts } from '$lib/utils/keyboard';

  import ModeSwitchButton from '$lib/components/common/ModeSwitchButton.svelte';
  import ShareFiltersButton from '$lib/components/common/ShareFiltersButton.svelte';
  import QuestionIcon from '$lib/components/icons/QuestionIcon.svelte';
  import SuggestionList from '$lib/components/filters/shared/SuggestionList.svelte';
  import SearchHelpDialog from '$lib/components/filters/cli/SearchHelpDialog.svelte';
  import type { Suggestion } from '$lib/types';

  // Component state
  let showSearchHelp = $state(false);
  let focused = $state(false);
  let suggestionsVisible = $state(false);
  let activeIndex = $state(-1);
  let suggestions = $state<Suggestion[]>([]);
  let currentFilterKey: string | null = $state(null);
  let inputElement: HTMLInputElement;
  let localSearchQuery = $state('');

  // Initialize from store
  $effect(() => {
    localSearchQuery = $searchQuery;
  });

  // Lifecycle
  onMount(() => {
    // Set initial suggestions
    suggestions = filterService.getFilterKeySuggestions();

    // Focus input
    inputElement?.focus();

    // Set up keyboard shortcut for help
    window.addEventListener('keydown', handleGlobalKeydown);

    return () => {
      window.removeEventListener('keydown', handleGlobalKeydown);
    };
  });

  // Handle mode switch
  function onSwitch() {
    filterMode.set('ui');
  }

  // Handle input changes
  function handleInput() {
    // Update the store
    updateQueryString(localSearchQuery);

    // Update suggestions based on current input
    updateSuggestions();
  }

  // Update suggestions based on current input state
  function updateSuggestions() {
    // Get the last token from the input
    const tokens = localSearchQuery.split(/\s+/);
    const lastToken = tokens[tokens.length - 1] || '';

    // Parse the token to identify key, operator, and value
    const { key, operator, value } = filterService.parseFilterToken(lastToken);

    // If we have a key and an operator, suggest values for that key
    if (key && operator && filterService.isValidFilterKey(key)) {
      currentFilterKey = key;
      suggestions = filterService.getSuggestionsForKey(key as FilterKey, value || '');
      suggestionsVisible = suggestions.length > 0 && focused;
    }
    // If we have a partial key, suggest matching filter keys
    else if (key && !operator) {
      currentFilterKey = null;
      suggestions = filterService.getFilterKeySuggestions(key);
      suggestionsVisible = suggestions.length > 0 && focused;
    }
    // Otherwise, show all filter keys
    else {
      currentFilterKey = null;
      suggestions = filterService.getFilterKeySuggestions();
      suggestionsVisible = suggestions.length > 0 && focused;
    }

    // Reset active suggestion
    activeIndex = suggestions.length > 0 ? 0 : -1;
  }

  // Handle suggestion selection
  function handleSuggestionSelect(event: { suggestion: Suggestion }) {
    const suggestion = event.suggestion;

    // Get the last token position
    const tokens = localSearchQuery.split(/\s+/);
    const lastTokenIndex = tokens.length - 1;

    // If we're selecting a filter key
    if (!currentFilterKey && suggestion.metadata?.isFilterKey) {
      // Replace last token with the selected filter key and add a colon
      tokens[lastTokenIndex] = `${suggestion.value}:`;
      localSearchQuery = tokens.join(' ');
    }
    // If we're selecting a value for a filter key
    else if (currentFilterKey) {
      // Get the part of the last token before the colon
      const [prefix] = tokens[lastTokenIndex].split(/[:<>]/);
      const operator = tokens[lastTokenIndex].includes('>')
        ? '>'
        : tokens[lastTokenIndex].includes('<')
          ? '<'
          : ':';

      // Replace the token with the key, operator, and selected value
      tokens[lastTokenIndex] = `${prefix}${operator}${suggestion.value}`;
      localSearchQuery = tokens.join(' ') + ' ';

      // Reset current filter key
      currentFilterKey = null;
    }

    // Hide suggestions
    suggestionsVisible = false;

    // Focus the input
    inputElement.focus();

    // Update filters based on new input
    handleInput();
  }

  function handleSuggestionHover(event: CustomEvent) {
    activeIndex = event.detail.index;
  }

  // Handle keyboard navigation
  function handleKeydown(event: KeyboardEvent) {
    // If suggestions aren't visible, don't handle navigation
    if (!suggestionsVisible) return;

    const shortcuts = [
      {
        key: 'ArrowDown',
        preventDefault: true,
        callback: () => {
          activeIndex = (activeIndex + 1) % suggestions.length;
        }
      },
      {
        key: 'ArrowUp',
        preventDefault: true,
        callback: () => {
          activeIndex = (activeIndex - 1 + suggestions.length) % suggestions.length;
        }
      },
      {
        key: 'Enter',
        preventDefault: true,
        callback: () => {
          // If we have an active suggestion, select it
          if (activeIndex >= 0) {
            handleSuggestionSelect({ suggestion: suggestions[activeIndex] });
          }
        }
      },
      {
        key: 'Escape',
        preventDefault: true,
        callback: () => {
          suggestionsVisible = false;
        }
      },
      {
        key: 'Tab',
        preventDefault: true,
        callback: () => {
          // If we have an active suggestion, select it
          if (activeIndex >= 0) {
            handleSuggestionSelect({ suggestion: suggestions[activeIndex] });
          }
        }
      }
    ];

    handleKeyboardShortcuts(event, shortcuts);
  }

  // Handle input focus
  function handleFocus() {
    focused = true;
    updateSuggestions();
    suggestionsVisible = suggestions.length > 0;
  }

  // Handle input blur
  function handleBlur() {
    // Use timeout to allow click events to complete
    setTimeout(() => {
      focused = false;
      suggestionsVisible = false;
    }, 200);
  }

  // Global keyboard shortcut for help
  function handleGlobalKeydown(event: KeyboardEvent) {
    const shortcuts = [
      {
        key: '?',
        ctrl: true,
        preventDefault: true,
        callback: toggleSearchHelp
      },
      {
        key: '?',
        meta: true,
        preventDefault: true,
        callback: toggleSearchHelp
      }
    ];

    handleKeyboardShortcuts(event, shortcuts);
  }

  // Toggle search help dialog
  function toggleSearchHelp() {
    showSearchHelp = !showSearchHelp;
  }

  // Handle example from search help
  function handleUseExample(event: CustomEvent) {
    localSearchQuery = event.detail.query;
    handleInput();
    inputElement.focus();
  }
</script>

<div class="token-search relative flex-1">
  <div class="search-input-wrapper relative">
    <div class="inset-0 flex items-end gap-2">
      <ModeSwitchButton current="cli" {onSwitch} />

      <div class="relative w-full">
        {#if suggestionsVisible}
          <div
            class="bg-bg-elevated border-brdr absolute right-0 bottom-full left-0 z-10 mb-1 flex w-full overflow-hidden rounded-md border shadow-md"
            transition:fly={{ y: 15, duration: 150 }}
          >
            <SuggestionList
              {suggestions}
              {activeIndex}
              onSelect={handleSuggestionSelect}
              on:hover={handleSuggestionHover}
            />
          </div>
        {/if}

        <input
          type="text"
          class="form-input pt-[16.5px]! pr-10 pb-2! font-mono"
          placeholder="CMD/CTRL + return to filter (e.g. chain:1 apy>10) "
          bind:value={localSearchQuery}
          bind:this={inputElement}
          oninput={handleInput}
          onfocus={handleFocus}
          onblur={handleBlur}
          onkeydown={handleKeydown}
        />

        <button
          class="text-text-tertiary hover:text-text-primary absolute top-1/2 right-3 -translate-y-1/2 transition-colors"
          onclick={toggleSearchHelp}
          title="Search Help"
        >
          <QuestionIcon />
        </button>
      </div>
    </div>
  </div>

  <SearchHelpDialog bind:show={showSearchHelp} on:useExample={handleUseExample} />
</div>
