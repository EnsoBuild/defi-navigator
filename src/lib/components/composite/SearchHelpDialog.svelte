<script lang="ts">
  import { createBubbler, stopPropagation } from 'svelte/legacy';

  const bubble = createBubbler();
  import { createEventDispatcher } from 'svelte';
  import { FilterKey } from '../../search/filters';
  import { fly, fade } from 'svelte/transition';

  const dispatcher = createEventDispatcher();
  
  interface Props {
    // Bind this value to control visibility from parent
    show?: boolean;
  }

  let { show = $bindable(false) }: Props = $props();

  // Example filters to display
  const examples = [
    {
      query: 'address:0x4C612E3B15b96Ff9A6faED838F8d07d479a8dD4c',
      description: 'Find token by address'
    },
    {
      query: 'chain:1 underlying:0x4C612E3B15b96Ff9A6faED838F8d07d479a8dD4c',
      description: 'Find tokens containing specific underlying token on Ethereum'
    },
    {
      query:
        'chain:1 underlying:0x4C612E3B15b96Ff9A6faED838F8d07d479a8dD4c underlying:0x6B175474E89094C44Da98b954EedeAC495271d0F',
      description: 'Find tokens containing any of several specific underlying token on Ethereum'
    },
    { query: 'apy>10 apy<20', description: 'Find tokens with APY between 10% and 20%' },
    { query: 'tvl>1000000', description: 'Find tokens with TVL greater than $1M' },
    { query: 'protocol:aave type:defi', description: 'Find Aave DeFi tokens' }
  ];

  function closeDialog() {
    show = false;
  }

  function useExample(example: string) {
    dispatcher('useExample', { query: example });
    closeDialog();
  }
</script>

{#if show}
  <div
    class="bg-bg-primary bg-opacity-75 fixed inset-0 z-50 flex items-center justify-center p-4"
    onclick={closeDialog}
    transition:fade={{ duration: 150 }}
  >
    <div
      class="bg-bg-elevated w-full max-w-2xl overflow-hidden rounded-lg shadow-lg"
      onclick={stopPropagation(bubble('click'))}
      transition:fly={{ y: 20, duration: 200 }}
    >
      <header class="border-brdr flex items-center justify-between border-b px-6 py-4">
        <h2 class="text-text-primary text-lg font-semibold">Search Syntax</h2>
        <button
          class="text-text-tertiary hover:text-text-primary transition-colors"
          onclick={closeDialog}
        >
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
          >
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </header>

      <div class="scrollbar-thin max-h-[70vh] overflow-y-auto px-6 py-5">
        <p class="text-text-secondary mb-4">
          You can use special filter syntax to find exactly what you're looking for. Combine
          multiple filters by separating them with spaces.
        </p>

        <div class="mb-6">
          <h3 class="text-md text-text-primary mb-2 font-medium">Available Filters</h3>
          <div class="bg-bg-tertiary border-brdr overflow-hidden rounded-md border">
            <table class="w-full border-collapse">
              <thead>
                <tr class="bg-bg-hover">
                  <th class="text-text-primary px-4 py-2 text-left text-sm font-medium">Filter</th>
                  <th class="text-text-primary px-4 py-2 text-left text-sm font-medium"
                    >Description</th
                  >
                  <th class="text-text-primary px-4 py-2 text-left text-sm font-medium">Syntax</th>
                </tr>
              </thead>
              <tbody class="divide-brdr divide-y">
                <tr>
                  <td class="text-primary px-4 py-2 font-mono text-sm">{FilterKey.ADDRESS}</td>
                  <td class="text-text-secondary px-4 py-2 text-sm">Token address</td>
                  <td class="text-text-secondary px-4 py-2 text-sm">address:0x123...</td>
                </tr>
                <tr>
                  <td class="text-primary px-4 py-2 font-mono text-sm"
                    >{FilterKey.UNDERLYING_TOKENS}</td
                  >
                  <td class="text-text-secondary px-4 py-2 text-sm">Underlying token</td>
                  <td class="text-text-secondary px-4 py-2 text-sm">underlying:0x456...</td>
                </tr>
                <tr>
                  <td class="text-primary px-4 py-2 font-mono text-sm">{FilterKey.APY}</td>
                  <td class="text-text-secondary px-4 py-2 text-sm">APY percentage</td>
                  <td class="text-text-secondary px-4 py-2 text-sm">apy>gt;5 apy>lt;20</td>
                </tr>
                <tr>
                  <td class="text-primary px-4 py-2 font-mono text-sm">{FilterKey.TVL}</td>
                  <td class="text-text-secondary px-4 py-2 text-sm">Total value locked</td>
                  <td class="text-text-secondary px-4 py-2 text-sm">tvl>gt;1000000</td>
                </tr>
                <tr>
                  <td class="text-primary px-4 py-2 font-mono text-sm">{FilterKey.PROTOCOL}</td>
                  <td class="text-text-secondary px-4 py-2 text-sm">Protocol name</td>
                  <td class="text-text-secondary px-4 py-2 text-sm">protocol:aave</td>
                </tr>
                <tr>
                  <td class="text-primary px-4 py-2 font-mono text-sm">{FilterKey.TYPE}</td>
                  <td class="text-text-secondary px-4 py-2 text-sm">Token type</td>
                  <td class="text-text-secondary px-4 py-2 text-sm">type:defi or type:base</td>
                </tr>
                <tr>
                  <td class="text-primary px-4 py-2 font-mono text-sm">{FilterKey.CHAIN_ID}</td>
                  <td class="text-text-secondary px-4 py-2 text-sm">Blockchain ID</td>
                  <td class="text-text-secondary px-4 py-2 text-sm">chain:1 (Ethereum)</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div>
          <h3 class="text-md text-text-primary mb-2 font-medium">Examples</h3>
          <div class="bg-bg-tertiary border-brdr overflow-hidden rounded-md border">
            <ul class="divide-brdr divide-y">
              {#each examples as example}
                <li class="hover:bg-bg-hover px-4 py-3 transition-colors">
                  <div class="flex justify-between">
                    <div>
                      <div class="text-primary mb-1 font-mono text-sm">{example.query}</div>
                      <div class="text-text-secondary text-sm">{example.description}</div>
                    </div>
                    <button
                      class="btn btn-ghost btn-sm self-center"
                      onclick={() => useExample(example.query)}
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

      <footer class="border-brdr bg-bg-tertiary border-t px-6 py-4">
        <p class="text-text-tertiary text-sm">Pro tip: Route does the job.</p>
      </footer>
    </div>
  </div>
{/if}

<style>
  /* Any component-specific styles would go here */
</style>
