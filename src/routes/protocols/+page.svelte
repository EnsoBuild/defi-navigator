<script lang="ts">
  import Nav from '$lib/components/layout/Nav.svelte';
  import ProtocolExplorer from '$lib/components/protocols/ProtocolExplorer.svelte';
</script>

<section class="min-h-screen bg-bg-primary pb-2 px-8 mx-auto">
  <div>
    <div class="mb-4 flex justify-end justify-items-stretch gap-3">
      <Nav />
    </div>
    <ProtocolExplorer />
  </div>
</section>