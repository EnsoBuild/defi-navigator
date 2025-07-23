<script lang="ts">
  import type { ProjectData } from '$lib/types';
  import { CoinsIcon } from '@lucide/svelte';
  import Button from '../common/Button.svelte';
  import { goto } from '$app/navigation';

  const { project, chainId }: { project: ProjectData; chainId: string | null } = $props();
</script>

<div class="card flex h-full flex-col p-6">
  <div class="mb-4 flex items-start">
    {#if project.logo}
      <img
        src={project.logo}
        alt="{project.name} logo"
        class="bg-bg-secondary mr-4 h-12 w-12 rounded-lg p-1 shadow-sm"
        loading="lazy"
      />
    {:else}
      <div class="bg-bg-secondary mr-4 flex h-12 w-12 items-center justify-center rounded-lg">
        <span class="text-secondary text-2xl font-bold">
          {project.id.charAt(0).toUpperCase()}
        </span>
      </div>
    {/if}
    <div class="flex-1">
      <h2 class="text-text-primary text-lg font-bold">
        {project.id}
      </h2>
      <div class="text-text-tertiary text-sm">
        {project.protocols.length} protocol{project.protocols.length === 1 ? '' : 's'}
      </div>
    </div>
  </div>

  {#if project.protocols.length > 0}
    <div class="mb-4">
      <h3 class="text-text-secondary mb-2 text-xs font-medium">Protocols</h3>
      <div class="flex flex-wrap gap-1">
        {#each project.protocols as protocol}
          <a
            href="tokens/?protocolSlug={protocol.slug}"
            class="bg-bg-secondary text-text-tertiary hover:bg-bg-hover hover:text-text-primary cursor-pointer rounded-full px-2 py-1 text-xs transition-colors"
          >
            {protocol.name || protocol.slug}
          </a>
        {/each}
      </div>
    </div>
  {/if}

  {#if project.chains.length > 0}
    <div class="mb-4">
      <h3 class="text-text-secondary mb-2 text-xs font-medium">Available on</h3>
      <div class="flex flex-wrap gap-1">
        {#each project.chains as chain}
          <a
            href="/tokens?project={project.id}&chainId={chain.id}"
            class="bg-bg-secondary text-text-tertiary hover:bg-bg-hover hover:text-text-primary cursor-pointer rounded-full px-2 py-1 text-xs transition-colors"
          >
            {chain.name} ({chain.id})
          </a>
        {/each}
      </div>
    </div>
  {/if}

  <!-- Spacer to push buttons to bottom -->
  <div class="flex-grow"></div>

  <div class="flex flex-col">
    <Button
      onclick={() => goto(`/tokens?project=${project.id}${chainId ? `&chainId=${chainId}` : ''}`)}
      variant="secondary"
      size="md"
    >
      <CoinsIcon size={16} class="ml-1 inline" /> Tokens
    </Button>
  </div>

  <!-- TODO: add Standards button
  <div class="flex">
    <a
      href="/tokens?project={project.id}{!!chainId ? `&chainId=${chainId}` : ''}"
      class="btn btn-primary btn-sm text-center"
    >
      <CoinsIcon size={16} class="ml-1 inline" /> Tokens
    </a>
  </div> -->
</div>
