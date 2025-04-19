<!-- SearchInput.svelte -->
<script lang="ts">
    import { createEventDispatcher } from 'svelte';
    
    export let value: string = '';
    export let placeholder: string = 'Search...';
    export let debounceTime: number = 300; // in ms
    export let showHelp: boolean = false;
    export let ariaLabel: string = 'Search';
    
    let isSearching: boolean = false;
    let timeoutId: ReturnType<typeof setTimeout> | null = null;
    
    const dispatch = createEventDispatcher();
    
    function handleInput(event: Event) {
      const target = event.target as HTMLInputElement;
      value = target.value;
      
      // Reset any existing timeout
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      
      // Set isSearching flag for showing spinner
      if (value) {
        isSearching = true;
      }
      
      // Create new debounced search timeout
      timeoutId = setTimeout(() => {
        dispatch('search', { value });
        isSearching = false;
      }, debounceTime);
    }
    
    function clearSearch() {
      value = '';
      dispatch('search', { value });
    }
    
    function toggleHelp() {
      dispatch('toggleHelp');
    }
  </script>
  
  <div class="search-wrapper">
    {#if showHelp}
      <div class="search-help">
        <button class="help-button" on:click={toggleHelp}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          ><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
          Filters
        </button>
      </div>
    {/if}
    
    <div class="search-input-wrapper">
      <input
        type="text"
        class="search-input"
        bind:value
        on:input={handleInput}
        {placeholder}
        aria-label={ariaLabel}
      />
  
      <div class="search-icon">
        {#if value.length > 0}
          <button class="clear-button" on:click={clearSearch} aria-label="Clear search">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            ><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        {:else}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          ><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
        {/if}
      </div>
  
      {#if isSearching}
        <div class="search-spinner"></div>
      {/if}
    </div>
  </div>
  
  <style>
    .search-wrapper {
      display: flex;
      flex-direction: column;
      width: 100%;
      position: relative;
    }
  
    .search-input-wrapper {
      position: relative;
      width: 100%;
    }
  
    .search-input {
      width: 100%;
      padding: 12px 40px 12px 16px;
      border: 1px solid #333;
      border-radius: 8px;
      background-color: #1e1e1e;
      font-size: 14px;
      color: #f0f0f0;
      transition: all 0.2s ease;
    }
  
    .search-input:focus {
      outline: none;
      border-color: #ff3d87;
      box-shadow: 0 0 0 2px rgba(255, 61, 135, 0.2);
    }
  
    .search-icon {
      position: absolute;
      right: 12px;
      top: 50%;
      transform: translateY(-50%);
      color: #a0a0a0;
      display: flex;
      align-items: center;
    }
  
    .clear-button {
      background: none;
      border: none;
      color: #a0a0a0;
      cursor: pointer;
      padding: 0;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  
    .clear-button:hover {
      color: #f0f0f0;
    }
  
    .search-spinner {
      position: absolute;
      right: 12px;
      top: 50%;
      transform: translateY(-50%);
      width: 18px;
      height: 18px;
      border: 2px solid rgba(255, 61, 135, 0.2);
      border-top-color: #ff3d87;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }
  
    @keyframes spin {
      to {
        transform: translateY(-50%) rotate(360deg);
      }
    }
  
    .search-help {
      margin-bottom: 8px;
      align-self: flex-end;
    }
  
    .help-button {
      background: none;
      border: none;
      color: #a0a0a0;
      font-size: 12px;
      cursor: pointer;
      padding: 4px 8px;
      display: flex;
      align-items: center;
      gap: 5px;
      transition: color 0.2s ease;
    }
  
    .help-button:hover {
      color: #f0f0f0;
    }
  </style>