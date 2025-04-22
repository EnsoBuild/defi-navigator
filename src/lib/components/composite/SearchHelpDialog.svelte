<script lang="ts">
    import { FilterKey } from '../../search/filters';
    import { fly, fade } from 'svelte/transition';
    
    // Bind this value to control visibility from parent
    export let show = false;
    
    // Example filters to display
    const examples = [
      { query: 'address:0x4C612E3B15b96Ff9A6faED838F8d07d479a8dD4c', description: 'Find token by address' },
      { query: 'chain:1 underlying:0x4C612E3B15b96Ff9A6faED838F8d07d479a8dD4c', description: 'Find tokens containing specific underlying token on Ethereum' },
      { query: 'apy>gt;10 apy>lt;20', description: 'Find tokens with APY between 10% and 20%' },
      { query: 'tvl>gt;1000000', description: 'Find tokens with TVL greater than $1M' },
      { query: 'protocol:aave type:defi', description: 'Find Aave DeFi tokens' }
    ];
    
    function closeDialog() {
      show = false;
    }
    
    function useExample(example: string) {
      // Dispatch an event that the parent can listen for to update the search
      const event = new CustomEvent('useExample', { detail: { query: example } });
      window.dispatchEvent(event);
      closeDialog();
    }
  </script>
  
  {#if show}
    <div 
      class="fixed inset-0 z-50 bg-bg-primary bg-opacity-75 flex items-center justify-center p-4"
      on:click={closeDialog}
      transition:fade={{ duration: 150 }}
    >
      <div 
        class="bg-bg-elevated w-full max-w-2xl rounded-lg shadow-lg overflow-hidden"
        on:click|stopPropagation
        transition:fly={{ y: 20, duration: 200 }}
      >
        <header class="border-b border-brdr px-6 py-4 flex justify-between items-center">
          <h2 class="text-lg font-semibold text-text-primary">Advanced Search Syntax</h2>
          <button 
            class="text-text-tertiary hover:text-text-primary transition-colors" 
            on:click={closeDialog}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </header>
        
        <div class="px-6 py-5 max-h-[70vh] overflow-y-auto scrollbar-thin">
          <p class="mb-4 text-text-secondary">
            You can use special filter syntax to find exactly what you're looking for. 
            Combine multiple filters by separating them with spaces.
          </p>
          
          <div class="mb-6">
            <h3 class="text-md font-medium mb-2 text-text-primary">Available Filters</h3>
            <div class="bg-bg-tertiary border border-brdr rounded-md overflow-hidden">
              <table class="w-full border-collapse">
                <thead>
                  <tr class="bg-bg-hover">
                    <th class="px-4 py-2 text-left text-sm font-medium text-text-primary">Filter</th>
                    <th class="px-4 py-2 text-left text-sm font-medium text-text-primary">Description</th>
                    <th class="px-4 py-2 text-left text-sm font-medium text-text-primary">Syntax</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-brdr">
                  <tr>
                    <td class="px-4 py-2 font-mono text-sm text-primary">{FilterKey.ADDRESS}</td>
                    <td class="px-4 py-2 text-sm text-text-secondary">Token address</td>
                    <td class="px-4 py-2 text-sm text-text-secondary">address:0x123...</td>
                  </tr>
                  <tr>
                    <td class="px-4 py-2 font-mono text-sm text-primary">{FilterKey.UNDERLYING_TOKENS}</td>
                    <td class="px-4 py-2 text-sm text-text-secondary">Underlying token</td>
                    <td class="px-4 py-2 text-sm text-text-secondary">underlying:0x456...</td>
                  </tr>
                  <tr>
                    <td class="px-4 py-2 font-mono text-sm text-primary">{FilterKey.APY}</td>
                    <td class="px-4 py-2 text-sm text-text-secondary">APY percentage</td>
                    <td class="px-4 py-2 text-sm text-text-secondary">apy>gt;5 apy>lt;20</td>
                  </tr>
                  <tr>
                    <td class="px-4 py-2 font-mono text-sm text-primary">{FilterKey.TVL}</td>
                    <td class="px-4 py-2 text-sm text-text-secondary">Total value locked</td>
                    <td class="px-4 py-2 text-sm text-text-secondary">tvl>gt;1000000</td>
                  </tr>
                  <tr>
                    <td class="px-4 py-2 font-mono text-sm text-primary">{FilterKey.PROTOCOL}</td>
                    <td class="px-4 py-2 text-sm text-text-secondary">Protocol name</td>
                    <td class="px-4 py-2 text-sm text-text-secondary">protocol:aave</td>
                  </tr>
                  <tr>
                    <td class="px-4 py-2 font-mono text-sm text-primary">{FilterKey.TYPE}</td>
                    <td class="px-4 py-2 text-sm text-text-secondary">Token type</td>
                    <td class="px-4 py-2 text-sm text-text-secondary">type:defi or type:base</td>
                  </tr>
                  <tr>
                    <td class="px-4 py-2 font-mono text-sm text-primary">{FilterKey.CHAIN_ID}</td>
                    <td class="px-4 py-2 text-sm text-text-secondary">Blockchain ID</td>
                    <td class="px-4 py-2 text-sm text-text-secondary">chain:1 (Ethereum)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          
          <div>
            <h3 class="text-md font-medium mb-2 text-text-primary">Examples</h3>
            <div class="bg-bg-tertiary border border-brdr rounded-md overflow-hidden">
              <ul class="divide-y divide-brdr">
                {#each examples as example}
                  <li class="px-4 py-3 hover:bg-bg-hover transition-colors">
                    <div class="flex justify-between">
                      <div>
                        <div class="font-mono text-sm text-primary mb-1">{example.query}</div>
                        <div class="text-sm text-text-secondary">{example.description}</div>
                      </div>
                      <button 
                        class="self-center btn btn-ghost btn-sm"
                        on:click={() => useExample(example.query)}
                      >
                        Use
                      </button>
                    </div>
                  </li>
                {/each}
              </ul>
            </div>
          </div>
        </div>
        
        <footer class="border-t border-brdr px-6 py-4 bg-bg-tertiary">
          <p class="text-sm text-text-tertiary">
            Pro tip: You can combine multiple filters together to narrow down your search results.
          </p>
        </footer>
      </div>
    </div>
  {/if}
  
  <style>
    /* Any component-specific styles would go here */
  </style>