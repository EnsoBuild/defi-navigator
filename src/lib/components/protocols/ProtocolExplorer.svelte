<script lang="ts">
  import { onMount } from 'svelte';

  import type { Protocol } from '$lib/types';
  import { getProtocols } from '$lib/services/api/tokens';
  import Input from '$lib/components/common/Input.svelte';
  import _ from 'lodash';

  let protocols: Protocol[] = $state([]);
  let allProtocols: Protocol[] = $state([]);
  let loading = $state(true);
  let error: string | null = $state(null);
  let searchQuery = $state('');

  onMount(async () => {
    try {
      const data = await getProtocols();
      // Sort protocols by slug ascending
      allProtocols = data.sort((a, b) => a.slug.localeCompare(b.slug));
      protocols = [...allProtocols];
      loading = false;
    } catch (err) {
      error = err instanceof Error ? err.message : 'Failed to load protocols';
      loading = false;
    }
  });

  function handleSearch(e: Event) {
    const target = e.target as HTMLInputElement;
    searchQuery = target.value;
    filterProtocols();
  }

  function filterProtocols() {
    if (!searchQuery.trim()) {
      protocols = [...allProtocols];
      return;
    }

    const query = searchQuery.toLowerCase();
    protocols = allProtocols.filter(
      (protocol) =>
        protocol.name?.toLowerCase().includes(query) ||
        protocol.slug.toLowerCase().includes(query) ||
        protocol.description?.toLowerCase().includes(query)
    );
  }
  $effect(()=>{
    if (protocols.length > 0) {
      protocols = _.orderBy(protocols, ['chains.length', 'name'], ['desc', 'asc']);
    } 
  })
</script>

<div class="mb-6 flex items-center justify-between">
  <h1 class="text-2xl font-bold">DeFi Protocols</h1>
  <div class="w-64">
    <Input placeholder="Search protocols..." value={searchQuery} oninput={handleSearch} />
  </div>
</div>

{#if loading}
  <div class="flex items-center justify-center py-16">
    <div class="spinner spinner-secondary h-12 w-12"></div>
  </div>
{:else if error}
  <div class="card border-error-border bg-error-light p-6">
    <p class="text-error">Error: {error}</p>
    <button class="btn btn-primary mt-4" onclick={() => window.location.reload()}>
      Try Again
    </button>
  </div>
{:else if protocols.length === 0}
  <div class="card p-8 text-center">
    <p class="text-text-secondary text-xl">
      {searchQuery ? `No protocols found matching "${searchQuery}"` : 'No protocols found'}
    </p>
    {#if searchQuery}
      <button
        class="btn btn-primary mt-4"
        onclick={() => {
          searchQuery = '';
          filterProtocols();
        }}
      >
        Clear Search
      </button>
    {/if}
  </div>
{:else}
  <div class="mb-4">
    <p class="text-text-secondary">
      Showing {protocols.length}
      {protocols.length === 1 ? 'protocol' : 'protocols'}
      {searchQuery ? `matching "${searchQuery}"` : ''}
    </p>
  </div>
  <div class="mt-5 grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
    {#each protocols as protocol}
      <div class="card flex h-full flex-col p-6" aria-label="${protocol.name || protocol.slug}">
        <div class="mb-1 flex items-end">
          {#if protocol.logosUri && protocol.logosUri.length > 0}
            <img
              src={protocol.logosUri[0]}
              alt="{protocol.name || protocol.slug} logo"
              class="bg-bg-secondary mr-4 h-12 w-12 rounded-lg p-1 shadow-sm"
              loading="lazy"
            />
          {:else}
            <div class="bg-bg-secondary mr-4 flex h-12 w-12 items-center justify-center rounded-lg">
              <span class="text-secondary text-2xl font-bold">
                {protocol.slug.charAt(0).toUpperCase()}
              </span>
            </div>
          {/if}
          <h2 class="text-text-primary text-lg font-bold">
            {protocol.name || protocol.slug}
          </h2>
        </div>
        <div class="mb-4 flex items-center">
          <div>
            <div class="mt-1 flex flex-wrap gap-2">
              {#if !!protocol.chains}
                {#each _.orderBy(protocol.chains, "name.length") as chain}
                  <a
                    class="bg-bg-secondary text-text-tertiary hover-glow rounded-full px-2 py-1 text-xxs"
                    href="/?chainId={chain.id}&protocolSlug={protocol.slug}"
                  >
                    {chain.name}
                  </a>
                {/each}
              {/if}
            </div>
          </div>
        </div>

        <!-- Spacer to push content to bottom -->
        <div class="flex-grow"></div>

        <div class="flex w-full items-center justify-between">
          <a
            href="/?protocol={protocol.slug}"
            class="btn btn-sm bg-bg-secondary text-text-secondary hover-glow text-xs"
          >
            Explore tokens
          </a>

          {#if protocol.url}
            <a
              href={protocol.url}
              target="_blank"
              rel="noopener noreferrer"
              class="btn btn-sm btn-secondary"
            >
              Visit
            </a>
          {/if}
        </div>
      </div>
    {/each}
  </div>
{/if}
