<script lang="ts">
  import { createEventDispatcher, onMount } from 'svelte';
  import { fade } from 'svelte/transition';
  
  interface Props {
    items?: Array<{ id: string | number, name: string, icon?: string }>;
    selectedItemId?: string | number | null;
    placeholder?: string;
    label?: string;
    error?: string;
    disabled?: boolean;
  }

  let {
    items = [],
    selectedItemId = $bindable(null),
    placeholder = 'Select an item',
    label = '',
    error = '',
    disabled = false
  }: Props = $props();
  
  let isOpen: boolean = $state(false);
  let selectedItem = $state(items.find(item => item.id === selectedItemId));
  
  const dispatch = createEventDispatcher();
  
  function toggleDropdown() {
    if (!disabled) {
      isOpen = !isOpen;
    }
  }
  
  function selectItem(item) {
    selectedItem = item;
    selectedItemId = item.id;
    isOpen = false;
    dispatch('select', { item });
  }
  
  function handleClickOutside(event: MouseEvent) {
    if (isOpen && !event.target.closest('.dropdown-container')) {
      isOpen = false;
    }
  }
  
  onMount(() => {
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  });
</script>

<div class="flex flex-col gap-2 w-full">
  {#if label}
    <label class="text-sm text-text-secondary font-medium">{label}</label>
  {/if}
  
  <div class="dropdown-container relative w-full">
    <button 
      class="w-full py-3 px-4 border border-brdr rounded-lg bg-bg-tertiary text-sm text-text-primary text-left cursor-pointer flex justify-between items-center transition-colors hover:border-brdr-light {disabled ? 'opacity-50 cursor-not-allowed' : ''} {error ? 'border-error' : ''}"
      onclick={toggleDropdown}
      type="button"
      aria-haspopup="listbox"
      aria-expanded={isOpen}
      disabled={disabled}
    >
      <span>{selectedItem ? selectedItem.name : placeholder}</span>
      <svg 
        class={`transition-transform ${isOpen ? 'rotate-180' : ''}`}
        xmlns="http://www.w3.org/2000/svg" 
        width="16" 
        height="16" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        stroke-width="2" 
        stroke-linecap="round" 
        stroke-linejoin="round"
      >
        <path d="M6 9l6 6 6-6"/>
      </svg>
    </button>
    
    {#if isOpen}
      <div 
        class="absolute top-[calc(100%+5px)] left-0 w-full max-h-[300px] overflow-y-auto bg-bg-elevated border border-brdr rounded-lg shadow-md z-20 scrollbar-thin"
        transition:fade={{ duration: 150 }}
        role="listbox"
      >
        {#each items as item}
          <button 
            class="w-full py-3 px-4 border-none bg-transparent text-text-primary text-sm text-left cursor-pointer flex items-center gap-2.5 border-b border-brdr last:border-b-0 transition-colors hover:bg-primary/10 
            {selectedItemId === item.id ? 'bg-primary/15' : ''}"
            onclick={() => selectItem(item)}
            role="option"
            aria-selected={selectedItemId === item.id}
          >
            {#if item.icon}
              <img src={item.icon} alt="" class="w-5 h-5 rounded-full object-cover" />
            {/if}
            {item.name}
          </button>
        {/each}
      </div>
    {/if}
  </div>
  
  {#if error}
    <p class="text-xs text-error mt-1">{error}</p>
  {/if}
</div>

