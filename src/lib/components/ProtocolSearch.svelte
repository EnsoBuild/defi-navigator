<script lang="ts">
  import { fade } from 'svelte/transition';
  import { createEventDispatcher } from 'svelte';
  import type { Protocol } from '../types';
  import { debounce } from '../debounce';

  export let protocols: Protocol[] = [];
  export let selectedProtocol: Protocol | null = null;

  let filteredProtocols: Protocol[] = [];
  let protocolSearch: string = '';
  let showProtocolDropdown: boolean = false;
  let isSearching: boolean = false;
  let highlightedIndex: number = -1;
  let dropdownEl: HTMLDivElement;

  const dispatch = createEventDispatcher();

  $: if (selectedProtocol) {
    protocolSearch = selectedProtocol.name || selectedProtocol.slug;
  }

  // Create debounced search function
  const debouncedSearch: (searchTerm: string) => void = debounce((searchTerm: string) => {
    filterProtocols(searchTerm);
  }, 300);

  // Filter protocols based on search term
  function filterProtocols(searchTerm: string): void {
    if (!searchTerm) {
      filteredProtocols = protocols;
      return;
    }

    isSearching = true;
    const term = searchTerm.toLowerCase();
    filteredProtocols = protocols.filter((protocol) => {
      return (
        protocol.slug.toLowerCase().includes(term) ||
        (protocol.name && protocol.name.toLowerCase().includes(term))
      );
    });
    isSearching = false;

    // Reset highlighted index when search results change
    highlightedIndex = filteredProtocols.length > 0 ? 0 : -1;
  }

  // Handle protocol search input
  function handleProtocolSearchInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    protocolSearch = target.value;
    showProtocolDropdown = true;
    debouncedSearch(protocolSearch);
  }

  // Handle protocol selection from dropdown
  function selectProtocol(protocol: Protocol): void {
    selectedProtocol = protocol;
    protocolSearch = protocol.name || protocol.slug;
    showProtocolDropdown = false;
    dispatch('protocolSelect', { protocol });
  }

  // Handle keyboard navigation
  function handleKeydown(event: KeyboardEvent): void {
    if (!showProtocolDropdown || filteredProtocols.length === 0) return;

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        highlightedIndex = (highlightedIndex + 1) % filteredProtocols.length;
        scrollToHighlighted();
        break;
      case 'ArrowUp':
        event.preventDefault();
        highlightedIndex =
          (highlightedIndex - 1 + filteredProtocols.length) % filteredProtocols.length;
        scrollToHighlighted();
        break;
      case 'Enter':
        event.preventDefault();
        if (highlightedIndex >= 0 && highlightedIndex < filteredProtocols.length) {
          selectProtocol(filteredProtocols[highlightedIndex]);
        }
        break;
      case 'Escape':
        event.preventDefault();
        showProtocolDropdown = false;
        break;
    }
  }

  // Scroll highlighted item into view
  function scrollToHighlighted(): void {
    if (!dropdownEl) return;

    const highlightedEl = dropdownEl.querySelector(
      `.protocol-item:nth-child(${highlightedIndex + 1})`
    );
    if (highlightedEl) {
      const containerRect = dropdownEl.getBoundingClientRect();
      const elementRect = highlightedEl.getBoundingClientRect();

      const isAbove = elementRect.top < containerRect.top;
      const isBelow = elementRect.bottom > containerRect.bottom;

      if (isAbove) {
        dropdownEl.scrollTop += elementRect.top - containerRect.top;
      } else if (isBelow) {
        dropdownEl.scrollTop += elementRect.bottom - containerRect.bottom;
      }
    }
  }

  // Handle lost focus
  function handleBlur(event: FocusEvent): void {
    // Small delay to allow for item clicks to register before closing
    setTimeout(() => {
      const relatedTarget = event.relatedTarget as Node;
      if (!relatedTarget || !event.currentTarget.contains(relatedTarget)) {
        showProtocolDropdown = false;
      }
    }, 100);
  }

  // Initialize filtered protocols
  $: {
    filteredProtocols = protocols;
  }
</script>

<div class="search-wrapper" on:click|stopPropagation>
  <div class="protocol-search-container">
    <!-- <label for="protocol-search">Network</label> -->
    <input
      id="protocol-search"
      class="protocol-search"
      type="text"
      placeholder="Search protocols..."
      bind:value={protocolSearch}
      on:input={handleProtocolSearchInput}
      on:focus={() => (showProtocolDropdown = true)}
      on:keydown={handleKeydown}
      on:blur={handleBlur}
      autocomplete="off"
    />

    {#if showProtocolDropdown}
      <div class="protocol-dropdown" transition:fade={{ duration: 150 }} bind:this={dropdownEl}>
        {#if isSearching}
          <div class="dropdown-loading">
            <div class="spinner"></div>
            Searching...
          </div>
        {:else if filteredProtocols.length === 0}
          <div class="no-results">No protocols found</div>
        {:else}
          {#each filteredProtocols as protocol, index}
            <div
              class="protocol-item"
              on:click={() => selectProtocol(protocol)}
              class:active={selectedProtocol?.slug === protocol.slug}
              class:highlighted={index === highlightedIndex}
              tabindex="-1"
            >
              <div class="protocol-item-content">
                {#if protocol.logosUri && protocol.logosUri.length > 0}
                  <img
                    class="protocol-logo"
                    src={protocol.logosUri[0]}
                    alt={protocol.name || protocol.slug}
                  />
                {:else}
                  <div class="placeholder-logo">
                    {(protocol.name || protocol.slug).substring(0, 2).toUpperCase()}
                  </div>
                {/if}
                <span>{protocol.name || protocol.slug}</span>
              </div>
            </div>
          {/each}
        {/if}
      </div>
    {/if}
  </div>
</div>

<style>
  .search-wrapper {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    /* width: 100%; */
    /* max-width: 300px; */
    position: relative;
  }

  .protocol-search {
    width: 100%;
    padding: 12px 16px;
    border: 1px solid #333;
    border-radius: 8px;
    background-color: #1e1e1e;
    font-size: 14px;
    color: #f0f0f0;
    transition: all 0.2s ease;
  }

  .protocol-search:focus {
    outline: none;
    border-color: #ff3d87;
    box-shadow: 0 0 0 2px rgba(255, 61, 135, 0.2);
  }

  .protocol-search-container {
    flex: 1;
    position: relative;
  }

  .search-icon {
    position: absolute;
    right: 16px;
    bottom: 12px;
    color: #a0a0a0;
    pointer-events: none;
  }

  .protocol-dropdown {
    position: absolute;
    top: calc(100% + 5px);
    left: 0;
    right: 0;
    max-height: 300px;
    overflow-y: auto;
    background-color: #252525;
    border: 1px solid #333;
    border-radius: 8px;
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
    z-index: 100;
    scrollbar-width: thin;
    scrollbar-color: #ea3ef7 #333;
  }

  .protocol-dropdown::-webkit-scrollbar {
    width: 6px;
  }

  .protocol-dropdown::-webkit-scrollbar-track {
    background: #333;
    border-radius: 3px;
  }

  .protocol-dropdown::-webkit-scrollbar-thumb {
    background-color: #ea3ef7;
    border-radius: 3px;
  }

  .protocol-item {
    padding: 12px 16px;
    cursor: pointer;
    border-bottom: 1px solid #333;
    transition: background-color 0.15s ease;
  }

  .protocol-item:last-child {
    border-bottom: none;
  }

  .protocol-item:hover {
    background-color: rgba(234, 62, 247, 0.1);
  }

  .protocol-item.active {
    background-color: rgba(234, 62, 247, 0.15);
  }

  .protocol-item.highlighted {
    background-color: rgba(234, 62, 247, 0.2);
    border-left: 3px solid #ea3ef7;
  }

  .protocol-item-content {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .protocol-logo {
    width: 24px;
    height: 24px;
    border-radius: 50%;
    object-fit: cover;
  }

  .placeholder-logo {
    font-weight: bold;
    color: #f0f0f0;
    font-size: 14px;
    background-color: #444;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .dropdown-loading,
  .no-results {
    padding: 16px;
    text-align: center;
    color: #a0a0a0;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
  }

  .spinner {
    width: 16px;
    height: 16px;
    border: 2px solid rgba(234, 62, 247, 0.2);
    border-top-color: #ea3ef7;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }

  @media (max-width: 768px) {
    .search-wrapper {
      max-width: 100%;
    }
  }
</style>
