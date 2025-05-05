<script lang="ts">
  import { onMount } from 'svelte';
  
  import type { Protocol } from '$lib/types/api';
  import { getProtocols } from '$lib/services/api/tokens';
  import Nav from '$lib/components/layout/Nav.svelte';

  let protocols: Protocol[] = $state([]);
  let loading = $state(true);
  let error: string | null = $state(null);

  onMount(async () => {
    try {
      const data = await getProtocols();
      // Sort protocols by slug ascending
      protocols = data.sort((a, b) => a.slug.localeCompare(b.slug));
      loading = false;
    } catch (err) {
      error = err instanceof Error ? err.message : 'Failed to load protocols';
      loading = false;
    }
  });
</script>

<section class="mx-auto max-w-screen-xl pb-2 px-8">
  <div class="container mx-auto">
    <div class="mb-4 flex justify-end justify-items-stretch gap-3">
      <Nav />
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
        <p class="text-text-secondary text-xl">No protocols found</p>
      </div>
    {:else}
      <div class="mt-5 grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
        {#each protocols as protocol}
          <div class="card flex h-full flex-col p-6" aria-label="${protocol.name || protocol.slug}">
            <div class="mb-1 flex items-start">
              {#if protocol.logosUri && protocol.logosUri.length > 0}
                <img
                  src={protocol.logosUri[0]}
                  alt="{protocol.name || protocol.slug} logo"
                  class="bg-bg-secondary mr-4 h-12 w-12 rounded-lg p-1 shadow-sm"
                  loading="lazy"
                />
              {:else}
                <div
                  class="bg-bg-secondary mr-4 flex h-12 w-12 items-center justify-center rounded-lg"
                >
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
                  <!-- {#if !!protocol.chains}
                    {#each protocol.chains as chain}
                      <a
                        class="bg-bg-secondary text-text-tertiary hover-glow rounded-full px-2 py-1 text-xs"
                        href="/?chain={chain.id}&protocol={protocol.slug}"
                      >
                        {chain.name}
                      </a>
                    {/each}
                  {/if} -->
                </div>
              </div>
            </div>

            {#if protocol.description}
              <p class="text-text-secondary mb-4 line-clamp-3 text-sm">
                {protocol.description}
              </p>
            {/if}

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
  </div>
</section>
