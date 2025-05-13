<script lang="ts">
  import { onMount } from 'svelte';
  import type { ProjectData } from '$lib/types';
  import { getProjectsData } from '$lib/services/api/tokens';
  import { searchService } from '$lib/services/searchService';
  import Input from '$lib/components/common/Input.svelte';
  import ProjectCard from './ProjectCard.svelte';
  import SkeletonLoader from '$lib/components/feedback/SkeletonLoader.svelte';

  let projects: ProjectData[] = $state([]);
  let filteredProjects: ProjectData[] = $state([]);
  let loading = $state(true);
  let error: string | null = $state(null);
  let searchQuery = $state('');
  let selectedChainId: number | null = $state(null);
  let availableChains: { id: number; name: string }[] = $state([]);

  onMount(async () => {
    try {
      const data = await getProjectsData();
      projects = data;
      filteredProjects = [...projects];

      // Initialize Fuse search for projects
      searchService.initializeProjectDataSearch(projects);

      // Get all unique chains
      const chainSet = new Set<string>();
      projects.forEach((project) => {
        project.chains.forEach((chain) => {
          chainSet.add(JSON.stringify({ id: chain.id, name: chain.name }));
        });
      });

      availableChains = Array.from(chainSet)
        .map((str) => JSON.parse(str))
        .sort((a, b) => a.name.localeCompare(b.name));

      loading = false;
    } catch (err) {
      error = err instanceof Error ? err.message : 'Failed to load projects';
      loading = false;
    }
  });

  function handleSearch(e: Event) {
    const target = e.target as HTMLInputElement;
    searchQuery = target.value;
    filterProjects();
  }

  function handleChainFilter(chainId: number | null) {
    selectedChainId = chainId;
    filterProjects();
  }

  function filterProjects() {
    let filtered = [...projects];

    // Use Fuse for search if query exists
    if (searchQuery.trim()) {
      filtered = searchService.searchProjectData(searchQuery);
    }

    // Apply chain filter
    if (selectedChainId !== null) {
      filtered = filtered.filter((project) =>
        project.chains.some((chain) => chain.id === selectedChainId)
      );
    }

    filteredProjects = filtered;
  }
</script>

<div class="mb-6 flex items-center justify-between gap-4">
  <div class="flex items-center gap-4">
    <div class="relative">
      <select
        class="form-input appearance-none pr-8"
        onchange={(e) =>
          handleChainFilter(e.currentTarget.value ? Number(e.currentTarget.value) : null)}
      >
        <option value="">All Chains</option>
        {#each availableChains as chain}
          <option value={chain.id}>{chain.name} ({chain.id})</option>
        {/each}
      </select>
      <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2">
        <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </div>
    </div>

    <div class="w-64">
      <Input placeholder="Search projects..." value={searchQuery} oninput={handleSearch} />
    </div>
  </div>
</div>

{#if loading}
  <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
    {#each Array(8) as _, i}
      <SkeletonLoader type="card" height="250px" />
    {/each}
  </div>
{:else if error}
  <div class="card border-error-border bg-error-light p-6">
    <p class="text-error">Error: {error}</p>
    <button class="btn btn-primary mt-4" onclick={() => window.location.reload()}>
      Try Again
    </button>
  </div>
{:else if filteredProjects.length === 0}
  <div class="card p-8 text-center">
    <p class="text-text-secondary text-xl">
      {searchQuery || selectedChainId
        ? `No projects found matching your filters`
        : 'No projects found'}
    </p>
    {#if searchQuery || selectedChainId}
      <button
        class="btn btn-primary mt-4"
        onclick={() => {
          searchQuery = '';
          selectedChainId = null;
          filterProjects();
        }}
      >
        Clear Filters
      </button>
    {/if}
  </div>
{:else}
  <div class="mb-4">
    <p class="text-text-secondary">
      Showing {filteredProjects.length}
      {filteredProjects.length === 1 ? 'project' : 'projects'}
      {searchQuery || selectedChainId ? ' (filtered)' : ''}
    </p>
  </div>
  <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
    {#each filteredProjects as project}
      <ProjectCard {project} />
    {/each}
  </div>
{/if}
