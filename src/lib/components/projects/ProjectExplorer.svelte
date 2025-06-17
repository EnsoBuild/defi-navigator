<script lang="ts">
  import Input from '$lib/components/common/Input.svelte';
  import SkeletonLoader from '$lib/components/feedback/SkeletonLoader.svelte';
  import { getNetworks, getProjectsData } from '$lib/services/api/tokens';
  import { searchService } from '$lib/services/searchService';
  import type { Network, ProjectData } from '$lib/types';
  import { onMount } from 'svelte';
  import ResultsStats from '../tokens/ResultsStats.svelte';
  import ProjectCard from './ProjectCard.svelte';
  import { goto } from '$app/navigation';
  import ChainSearch from './ChainSearch.svelte';
  import debounce from 'just-debounce-it';

  let projects: ProjectData[] = $state([]);
  let filteredProjects: ProjectData[] = $state([]);
  let loading = $state(true);
  let error: string | null = $state(null);
  let searchQuery = $state('');
  let selectedChainId: string | null = $state(null);
  let availableChains: Network[] = $state([]);

  onMount(async () => {
    try {
      const parsedUrl = new URL(window.location.href);
      const urlChainId = parsedUrl.searchParams.get('chainId');
      const protocol = parsedUrl.searchParams.get('protocol');
      if (!!urlChainId) {
        selectedChainId = urlChainId;
      }
      if (!!protocol) {
        searchQuery = protocol;
      }

      availableChains = await getNetworks();

      const data = await getProjectsData();
      projects = data;
      filteredProjects = [...projects];
      // Initialize Fuse search for projects
      searchService.initializeProjectDataSearch(projects);
      filterProjects();
      loading = false;
    } catch (err) {
      error = err instanceof Error ? err.message : 'Failed to load projects';
      loading = false;
    }
  });

  const handleSearch = debounce((e: Event) => {
    searchQuery = (e.target as HTMLInputElement).value;
    filterProjects();
  }, 300);

  function handleChainFilter(chainId: string | null) {
    console.log('Selected chain ID:', chainId);
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
        project.chains.some((chain) => chain.id?.toString() === selectedChainId)
      );
    }

    filteredProjects = filtered;
    const q = searchQuery.trim();
    if (selectedChainId || q) {
      const params = [];

      if (selectedChainId) params.push(`chainId=${selectedChainId}`);
      if (q) params.push(`protocol=${q}`);

      goto(`/projects?${params.join('&')}`, {
        replaceState: true,
        keepFocus: true
      });
    }
  }
</script>

<div class="mb-6 flex items-center justify-between gap-4">
  <div class="flex items-center gap-4">
    <div class="w-64">
      <ChainSearch
        networks={availableChains}
        bind:selectedChainId
        placeholder="Search a chain"
        on:select={(e: CustomEvent<{ chainId: string }>) => handleChainFilter(e.detail.chainId)}
      />
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
    <ResultsStats
      totalCount={projects.length}
      filteredCount={filteredProjects.length}
      searchQuery={searchQuery + selectedChainId}
      whats="projects"
    />
  </div>
  <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
    {#each filteredProjects as project}
      <ProjectCard {project} chainId={selectedChainId} />
    {/each}
  </div>
{/if}
