<script lang="ts">
  import Nav from '$lib/components/layout/Nav.svelte';
  import ProjectExplorer from '$lib/components/projects/ProjectExplorer.svelte';
</script>

<section class="min-h-screen bg-bg-primary pb-2 px-8 mx-auto">
  <div>
    <div class="mb-4 flex justify-end justify-items-stretch gap-3">
      <Nav />
    </div>
    <ProjectExplorer />
  </div>
</section>

