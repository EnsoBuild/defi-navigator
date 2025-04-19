<!-- Dropdown.svelte -->
<script lang="ts">
  import { createEventDispatcher, onMount } from 'svelte';
  import { fade } from 'svelte/transition';
  
  export let items: Array<{ id: string | number, name: string, icon?: string }> = [];
  export let selectedItemId: string | number | null = null;
  export let placeholder: string = 'Select an item';
  export let isOpen: boolean = false;
  
  const dispatch = createEventDispatcher();
  
  let selectedItem = items.find(item => item.id === selectedItemId);
  
  function toggleDropdown() {
    isOpen = !isOpen;
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

<div class="dropdown-container">
  <button class="dropdown-button" on:click={toggleDropdown}>
    <span>{selectedItem ? selectedItem.name : placeholder}</span>
    <svg 
      class="dropdown-icon" 
      class:open={isOpen}
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
    <div class="dropdown-menu" transition:fade={{ duration: 150 }}>
      {#each items as item}
        <button 
          class="dropdown-item" 
          class:active={selectedItemId === item.id}
          on:click={() => selectItem(item)}
        >
          {#if item.icon}
            <img src={item.icon} alt="" class="item-icon" />
          {/if}
          {item.name}
        </button>
      {/each}
    </div>
  {/if}
</div>

<style>
  .dropdown-container {
    position: relative;
    width: 100%;
  }
  
  .dropdown-button {
    width: 100%;
    padding: 12px 16px;
    border: 1px solid #333;
    border-radius: 8px;
    background-color: #1e1e1e;
    color: #f0f0f0;
    font-size: 14px;
    text-align: left;
    cursor: pointer;
    display: flex;
    justify-content: space-between;
    align-items: center;
    transition: border-color 0.2s;
  }
  
  .dropdown-button:hover {
    border-color: #444;
  }
  
  .dropdown-icon {
    transition: transform 0.2s;
  }
  
  .dropdown-icon.open {
    transform: rotate(180deg);
  }
  
  .dropdown-menu {
    position: absolute;
    top: calc(100% + 5px);
    left: 0;
    width: 100%;
    max-height: 300px;
    overflow-y: auto;
    background-color: #252525;
    border: 1px solid #333;
    border-radius: 8px;
    z-index: 100;
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
  }
  
  .dropdown-item {
    width: 100%;
    padding: 12px 16px;
    border: none;
    background: none;
    color: #f0f0f0;
    font-size: 14px;
    text-align: left;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 10px;
    border-bottom: 1px solid #333;
    transition: background-color 0.2s;
  }
  
  .dropdown-item:last-child {
    border-bottom: none;
  }
  
  .dropdown-item:hover {
    background-color: rgba(255, 61, 135, 0.1);
  }
  
  .dropdown-item.active {
    background-color: rgba(255, 61, 135, 0.15);
  }
  
  .item-icon {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    object-fit: cover;
  }
</style>