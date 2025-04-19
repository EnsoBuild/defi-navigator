<script lang="ts">
  import { fade, fly } from 'svelte/transition';

  export let show: boolean = false;

  function closeDialog() {
    show = false;
  }

  function handleBackdropClick(event: MouseEvent) {
    if ((event.target as HTMLElement).classList.contains('dialog-backdrop')) {
      closeDialog();
    }
  }
</script>

{#if show}
  <div class="dialog-backdrop" on:click={handleBackdropClick} transition:fade={{ duration: 200 }}>
    <div class="dialog" transition:fly={{ y: -20, duration: 250 }}>
      <div class="dialog-header">
        <h2>Filters Syntax Help</h2>
        <button class="close-button" on:click={closeDialog} aria-label="Close dialog">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            ><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"
            ></line></svg
          >
        </button>
      </div>

      <div class="dialog-content">
        <p>You can filter tokens using the following syntax:</p>

        <div class="syntax-section">
          <h3>Basic Filter</h3>
          <p>Simply type any text to filter token names and symbols.</p>
          <div class="example">USDC Aave</div>
        </div>

        <div class="syntax-section">
          <h3>Property Filters</h3>
          <ul class="filter-list">
            <li><code>name:</code> - Filter by token name</li>
            <li><code>symbol:</code> - Filter by token symbol</li>
            <li><code>address:</code> - Filter by token address</li>
            <li><code>chain:</code> - Filter by chain ID</li>
            <li><code>primary:</code> - Filter by primary contract address</li>
            <li><code>underlying:</code> - Filter by underlying token address</li>
            <li><code>project:</code> - Filter by project (e.g., aave, uniswap)</li>
            <li><code>protocol:</code> - Filter by protocol slug (e.g., aave-v3)</li>
            <li><code>type:</code> - Filter by token type (defi or base)</li>
          </ul>
          <div class="example">symbol:AUSDC chain:1 project:aave</div>
        </div>

        <div class="syntax-section">
          <h3>Numeric Comparisons</h3>
          <ul class="filter-list">
            <li><code>apy&gt;5</code> - APY greater than 5%</li>
            <li><code>apy&lt;3</code> - APY less than 3%</li>
            <li><code>tvl&gt;1000000</code> - TVL greater than 1,000,000</li>
            <li><code>tvl&lt;500000</code> - TVL less than 500,000</li>
          </ul>
          <div class="example">apy&gt;3 apy&lt;10 tvl&gt;500000</div>
        </div>

        <div class="syntax-section">
          <h3>Sorting</h3>
          <ul class="filter-list">
            <li><code>apy:sort:asc</code> - Sort by APY, ascending (lowest first)</li>
            <li><code>apy:sort:desc</code> - Sort by APY, descending (highest first)</li>
            <li><code>tvl:sort:asc</code> - Sort by TVL, ascending (lowest first)</li>
            <li><code>tvl:sort:desc</code> - Sort by TVL, descending (highest first)</li>
          </ul>
          <div class="example">project:aave apy:sort:asc</div>
          <div class="example">chain:1 tvl:sort:desc</div>
        </div>

        <div class="syntax-section">
          <h3>Combined Queries</h3>
          <p>You can combine multiple filters and sorting in a single query:</p>
          <div class="example">symbol:a chain:1 apy&gt;5 tvl:sort:desc</div>
          <div class="example">project:compound type:defi apy:sort:asc</div>
        </div>
      </div>
    </div>
  </div>
{/if}

<style>
  .dialog-backdrop {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.7);
    backdrop-filter: blur(3px);
    z-index: 300;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
  }

  .dialog {
    background-color: #1a1a1a;
    border-radius: 12px;
    max-width: 600px;
    width: 100%;
    max-height: 80vh;
    overflow-y: auto;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.4);
  }

  .dialog-header {
    padding: 16px 20px;
    border-bottom: 1px solid #333;
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: sticky;
    top: 0;
    background-color: #1a1a1a;
    z-index: 1;
    border-radius: 12px 12px 0 0;
  }

  .dialog-header h2 {
    margin: 0;
    font-size: 18px;
    color: #f0f0f0;
  }

  .close-button {
    background: none;
    border: none;
    color: #a0a0a0;
    cursor: pointer;
    padding: 5px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    transition:
      background-color 0.2s ease,
      color 0.2s ease;
  }

  .close-button:hover {
    background-color: rgba(255, 255, 255, 0.1);
    color: #f0f0f0;
  }

  .dialog-content {
    padding: 20px;
  }

  .dialog-content p {
    margin-top: 0;
    color: #e0e0e0;
  }

  .syntax-section {
    margin-bottom: 24px;
  }

  .syntax-section h3 {
    font-size: 16px;
    margin-bottom: 8px;
    color: #ff3d87;
  }

  .filter-list {
    list-style: none;
    padding: 0;
    margin: 0 0 16px 0;
  }

  .filter-list li {
    margin-bottom: 8px;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  code {
    font-family: 'Roboto Mono', monospace;
    background-color: #252525;
    padding: 2px 6px;
    border-radius: 4px;
    color: #ff56a9;
    font-size: 13px;
  }

  .example {
    background-color: #252525;
    padding: 12px 16px;
    border-radius: 6px;
    font-family: 'Roboto Mono', monospace;
    font-size: 13px;
    color: #e0e0e0;
    border-left: 3px solid #ff3d87;
    overflow-x: auto;
    margin-bottom: 8px;
  }
</style>
