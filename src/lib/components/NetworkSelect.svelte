<script lang="ts">
  import type { Network } from '../types';
  
  export let networks: Network[] = [];
  export let selectedNetwork: Network | null = null;
  
  function handleNetworkChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    const networkId = parseInt(target.value) || null;
    selectedNetwork = networks.find(n => n.id === networkId) || null;
    
    // Dispatch event when network changes
    const customEvent = new CustomEvent('networkChange', {
      detail: selectedNetwork
    });
    
    dispatchEvent(customEvent);
  }
  
  // Helper function to properly dispatch events
  function dispatchEvent(event: Event): void {
    const element = document.getElementById('network');
    if (element) {
      element.dispatchEvent(event);
    }
  }
</script>

<div class="select-wrapper">
  <!-- <label for="network">Network</label> -->
  <select id="network" on:change={handleNetworkChange}>
    {#each networks as network}
      <option value={network.id}>{network.name}</option>
    {/each}
  </select>
  <div class="select-icon">
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"/></svg>
  </div>
</div>

<style>
  .select-wrapper {
    flex: 1;
    min-width: 0; /* Prevents overflow issues */
    display: flex;
    flex-direction: column;
    /* width: 100%;
    max-width: 300px; */
    position: relative;
  }
  
  label {
    margin-bottom: 8px;
    font-size: 14px;
    color: #a0a0a0;
    font-weight: 500;
  }
  
  select {
    padding: 12px 16px;
    border: 1px solid #333;
    border-radius: 8px;
    background-color: #1e1e1e;
    font-size: 14px;
    color: #f0f0f0;
    transition: all 0.2s ease;
    appearance: none;
  }
  
  select:focus {
    outline: none;
    border-color: #ff3d87;
    box-shadow: 0 0 0 2px rgba(255, 61, 135, 0.2);
  }
  
  .select-icon {
    position: absolute;
    right: 16px;
    top: 12px;
    color: #a0a0a0;
    pointer-events: none;
  }
  
  @media (max-width: 768px) {
    .select-wrapper {
      max-width: 100%;
    }
  }
</style>