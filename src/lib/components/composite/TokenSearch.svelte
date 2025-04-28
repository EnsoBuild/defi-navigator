<script lang="ts">
  import { createEventDispatcher, onMount } from 'svelte';
  import { FilterKey } from '../../search/filters';
  import { fade, fly } from 'svelte/transition';

  import type { Network, ProjectData, Protocol } from '$lib/types/api';
  import { deserializeTokenParams } from '$lib/search/parser';

  import type { TokenParams } from '../../types/api';
  import ShareFiltersButton from '../core/ShareFiltersButton.svelte';
  import SearchHelpDialog from './SearchHelpDialog.svelte';
  import ModeSwitchButton from '../ModeSwitchButton.svelte';
  import QuestionIcon from '../core/QuestionIcon.svelte';
  import SuggestionsList from './SuggestionsList.svelte';

  let showSearchHelp = $state(false);
  interface Props {
    placeholder?: string;
    protocols?: Protocol[]; // Protocols data passed from parent
    projects?: ProjectData[]; // Project data passed from parent
    networks?: Network[]; // Networks data passed from parent
    initialTokenParams?: TokenParams;
    tokenParams: TokenParams;
    onSwitch?: (other: 'ui' | 'cli') => void;
  }

  let {
    placeholder = 'Search tokens or filter (e.g. chain:1 apy>10)',
    protocols = [],
    projects = [],
    networks = [],
    initialTokenParams = {},
    tokenParams = {},
    onSwitch = () => {}
  }: Props = $props();
  interface Suggestion {
    value: string;
    displayText: string;
    description: string;
    logo?: string;
    metadata?: any;
  }

  let searchInput = $state('');
  let focused = false;
  let inputElement: HTMLInputElement | null | undefined = $state();
  let suggestionsVisible = $state(false);
  let activeSuggestion = $state(-1);
  let suggestions: Suggestion[] = $state([]);
  let currentFilterKey: string | null = null;

  const dispatch = createEventDispatcher();

  // Helper function to create filter key suggestions based on user input
  function generateSuggestions(input: string): Suggestion[] {
    if (!input || input.trim() === '') {
      return Object.values(FilterKey).map((key) => ({
        value: key,
        displayText: key,
        description: getFilterKeyDescription(key)
      }));
    }

    // Check if we're potentially entering a filter key or a value
    const dslTokens = input.split(/\s+/);
    const lastToken = dslTokens[dslTokens.length - 1] || '';

    // Check if we're entering a value for a specific filter
    const keyValueMatch = lastToken.match(/^(\w+):(.*)$/);

    if (keyValueMatch) {
      const [, key, value] = keyValueMatch;
      currentFilterKey = key;
      return generateValueSuggestions(key, value);
    }

    // If it contains other operators, don't suggest keys
    if (lastToken.includes('>') || lastToken.includes('<')) {
      return [];
    }

    // Return matching filter keys
    return Object.values(FilterKey)
      .filter((key) => key.toLowerCase().startsWith(lastToken.toLowerCase()))
      .map((key) => ({
        value: key,
        displayText: key,
        description: getFilterKeyDescription(key)
      }));
  }

  // Generate suggestions for values based on the current filter key
  function generateValueSuggestions(key: string, partialValue: string): Suggestion[] {
    // Convert to lowercase for case-insensitive matching
    const searchValue = partialValue.toLowerCase();
    console.debug(`Suggestions for ${key} with value ${searchValue}`);
    switch (key.toLowerCase()) {
      case FilterKey.PROTOCOL.toLowerCase():
        return protocols
          .filter(
            (protocol) =>
              protocol.slug.toLowerCase().includes(searchValue) ||
              protocol.name?.toLowerCase().includes(searchValue)
          )
          .map((protocol) => ({
            value: protocol.slug,
            displayText: protocol.name!,
            description: ``,
            logo: protocol.logosUri && protocol.logosUri[0],
            metadata: protocol
          }));

      case FilterKey.CHAIN_ID.toLowerCase():
        console.debug(networks);
        return networks
          .filter(
            (network) =>
              network.id.toString().includes(searchValue) ||
              network.name.toLowerCase().includes(searchValue)
          )
          .map((network) => ({
            value: network.id.toString(),
            displayText: `${network.name} (${network.id})`,
            description: ``,
            logo: '',
            metadata: network
          }));
      case FilterKey.PROJECT.toLowerCase():
        return projects
          .filter((project) => project.id.toLowerCase().includes(searchValue))
          .map((project) => ({
            value: project.id,
            displayText: project.id!,
            description: '',
            logo: '',
            metadata: project
          }));
      default:
        return [];
    }
  }

  // Descriptions for each filter key
  function getFilterKeyDescription(key: string): string {
    const descriptions = {
      [FilterKey.PROJECT]: 'Project name',
      [FilterKey.PROTOCOL]: 'Protocol name/slug',
      [FilterKey.ADDRESS]: 'Token address',
      [FilterKey.CHAIN_ID]: 'Blockchain network ID',
      [FilterKey.TYPE]: 'Token type (defi or base)',
      [FilterKey.PRIMARY_ADDRESS]: 'Underlying token address',
      [FilterKey.UNDERLYING_TOKENS]: 'Underlying token address',
      [FilterKey.UNDERLYING_TOKENS_EXACT]: 'Exact underlying token address',
      [FilterKey.APY]: 'Annual percentage yield',
      [FilterKey.TVL]: 'Total value locked'
    };

    return descriptions[key as keyof typeof descriptions] || key;
  }

  // Handle input changes
  function handleInput() {
    dispatch('input', { query: searchInput });

    // Update suggestions
    suggestions = generateSuggestions(searchInput);
    suggestionsVisible = suggestions.length > 0 && focused;
    activeSuggestion = -1;
  }

  // Handle suggestion selection
  function selectSuggestion(suggestion: Suggestion) {
    // If we're selecting a filter key
    if (!currentFilterKey) {
      // Replace the last token with the selected suggestion
      const dslTokens = searchInput.split(/\s+/);
      dslTokens.pop();
      dslTokens.push(suggestion.value + ':');
      searchInput = dslTokens.join(' ');
    } else {
      // We're selecting a value for a filter
      const dslTokens = searchInput.split(/\s+/);
      const lastTokenIndex = dslTokens.length - 1;

      // Replace the value part of the last token
      const [prefix] = dslTokens[lastTokenIndex].split(':');
      dslTokens[lastTokenIndex] = `${prefix}:${suggestion.value}`;
      searchInput = dslTokens.join(' ') + ' ';

      currentFilterKey = null;
    }

    suggestionsVisible = false;
    inputElement?.focus();
    handleInput();
  }

  // Handle keyboard navigation of suggestions
  function handleKeydown(event: KeyboardEvent) {
    if (!suggestionsVisible) return;

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        activeSuggestion = Math.min(activeSuggestion + 1, suggestions.length - 1);
        break;
      case 'ArrowUp':
        event.preventDefault();
        activeSuggestion = Math.max(activeSuggestion - 1, -1);
        break;
      case 'Enter':
        console.debug('TokenSearch ENTER');
        if (activeSuggestion >= 0) {
          event.preventDefault();
          selectSuggestion(suggestions[activeSuggestion]);
        }
        break;
      case 'Escape':
        event.preventDefault();
        suggestionsVisible = false;
        break;
      case 'Tab':
        if (activeSuggestion >= 0) {
          event.preventDefault();
          selectSuggestion(suggestions[activeSuggestion]);
        }
        break;
    }
  }

  // Focus and blur handlers
  function handleFocus() {
    focused = true;
    suggestionsVisible = suggestions.length > 0;
  }

  function handleBlur() {
    // Delay hiding suggestions to allow clicks to register
    setTimeout(() => {
      focused = false;
      suggestionsVisible = false;
      currentFilterKey = null;
    }, 200);
  }

  // Add this near the other event handlers
  function handleGlobalKeydown(event: KeyboardEvent) {
    if (event.key === '?' || event.key === 'Shift+?') {
      event.preventDefault();
      toggleSearchHelp();
    }
  }

  // Initialize suggestions
  onMount(() => {
    searchInput = deserializeTokenParams(initialTokenParams);
    suggestions = generateSuggestions('');
    inputElement?.focus();
    window.addEventListener('keydown', handleGlobalKeydown);

    // Don't forget to clean up
    return () => {
      window.removeEventListener('keydown', handleGlobalKeydown);
    };
  });

  function toggleSearchHelp() {
    showSearchHelp = !showSearchHelp;
  }
</script>

<div class="token-search relative flex-1">
  <div class="search-input-wrapper relative">
    <div class="inset-0 flex items-end gap-2">
      <ShareFiltersButton {tokenParams} moreRoom={true} />
      <ModeSwitchButton current="cli" {onSwitch} />
      <div class="relative w-full">
        {#if suggestionsVisible}
          <div
            class="bg-bg-elevated border-brdr absolute absolute right-0 bottom-full left-0 z-10 z-10 mb-1 flex w-full overflow-hidden rounded-md border shadow-md"
            transition:fly={{ y: 15, duration: 150 }}
          >
            <SuggestionsList
              {suggestions}
              {activeSuggestion}
              on:select={(event) => selectSuggestion(event.detail.suggestion)}
            />
          </div>
        {/if}
        <input
          type="text"
          class="form-input pt-[16.5px]! pr-10 pb-2! font-mono"
          {placeholder}
          bind:value={searchInput}
          bind:this={inputElement}
          oninput={handleInput}
          onfocus={handleFocus}
          onblur={handleBlur}
          onkeydown={handleKeydown}
        />

        <button
          class="text-text-tertiary hover:text-text-primary absolute top-1/2 right-3 -translate-y-1/2 transition-colors"
          onclick={() => {
            showSearchHelp = true;
          }}
          title="Search Help"
        >
          <QuestionIcon />
        </button>
      </div>
    </div>
  </div>
  <SearchHelpDialog
    bind:show={showSearchHelp}
    on:useExample={(p) => {
      console.debug('Use example', p);
      searchInput = p.detail.query;
    }}
  />
</div>
