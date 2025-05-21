<!-- lib/components/common/ChainSearch.svelte -->
<script lang="ts">
  import SuggestionList from '$lib/components/filters/shared/SuggestionList.svelte';
  import type { Network, Suggestion } from '$lib/types';
  import { ChevronDownIcon, XIcon } from '@lucide/svelte';
  import { createEventDispatcher, onMount } from 'svelte';
  import { fade } from 'svelte/transition';

  type Props = {
    networks: Network[];
    selectedChainId?: string | null;
    placeholder?: string;
  };

  let { networks, selectedChainId = $bindable(''), placeholder }: Props = $props();

  const dispatch = createEventDispatcher();

  let isOpen = $state(false);
  let searchInput: HTMLInputElement;
  let searchQuery = $state('');
  let filteredNetworks = $state<Network[]>([]);
  let activeIndex = $state(0);

  // Format networks as suggestions
  $effect(() => {
    if (!searchQuery.trim()) {
      filteredNetworks = [...networks];
    } else {
      const query = searchQuery.toLowerCase();
      filteredNetworks = networks.filter(
        (network) =>
          network.name?.toLowerCase().includes(query) || network.id.toString().includes(query)
      );
    }
  });

  // Convert network to suggestion format for SuggestionList
  function networkToSuggestion(network: Network) {
    return {
      value: network.id.toString(),
      displayText: `${network.name} (${network.id})`,
      description: '',
      metadata: network
    };
  }

  function toggleDropdown() {
    isOpen = !isOpen;
    if (isOpen) {
      setTimeout(() => searchInput?.focus(), 0);
    }
  }

  function handleSuggestionSelect(event: { suggestion: Suggestion }) {
    const networkId = parseInt(event.suggestion.value, 10).toString();
    selectedChainId = networkId === selectedChainId ? null : networkId;
    dispatch('select', { chainId: selectedChainId });
    isOpen = false;
    searchQuery = '';
  }

  function handleClear() {
    selectedChainId = null;
    dispatch('select', { chainId: null });
  }

  function handleSuggestionHover(event: CustomEvent) {
    activeIndex = event.detail.index;
  }

  function handleClickOutside(event: MouseEvent) {
    if (isOpen && !event.target?.closest('.chain-search-container')) {
      isOpen = false;
    }
  }

  onMount(() => {
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  });

  // Get display text for selected network
  function getSelectedNetworkName() {
    if (selectedChainId === null) return 'All Chains';
    const network = networks.find((n) => n.id.toString() === selectedChainId);
    return network ? `${network.name} (${network.id})` : 'All Chains';
  }
</script>

<div class="chain-search-container relative">
  <button
    class="form-input flex w-full cursor-pointer items-center justify-between"
    onclick={toggleDropdown}
    aria-haspopup="listbox"
    aria-expanded={isOpen}
  >
    <div class="flex items-center gap-2">
      {#if selectedChainId !== null}
        <div class="bg-primary/10 h-3 w-3 rounded-full"></div>
      {/if}
      <span>{getSelectedNetworkName()}</span>
    </div>

    <div class="flex items-center gap-2">
      {#if selectedChainId !== null}
        <button
          class="text-text-tertiary hover:text-text-primary p-1"
          onclick={(e) => {
            e.stopPropagation();
            handleClear();
          }}
          aria-label="Clear selection"
        >
          <XIcon size={14} />
        </button>
      {/if}
      <ChevronDownIcon size={16} class={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
    </div>
  </button>

  {#if isOpen}
    <div
      class="bg-bg-elevated border-brdr absolute top-full left-0 z-20 mt-1 w-full overflow-hidden rounded-md border shadow-md"
      transition:fade={{ duration: 150 }}
    >
      <input
        type="text"
        bind:this={searchInput}
        bind:value={searchQuery}
        {placeholder}
        class="form-input w-full py-2 pl-10"
      />

      <SuggestionList
        suggestions={filteredNetworks.map(networkToSuggestion)}
        {activeIndex}
        onSelect={handleSuggestionSelect}
        on:hover={handleSuggestionHover}
        maxHeight="400px"
      />
    </div>
  {/if}
</div>
