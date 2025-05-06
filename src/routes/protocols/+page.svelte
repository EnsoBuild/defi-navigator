<script lang="ts">
  import Nav from '$lib/components/layout/Nav.svelte';
  import ProtocolExplorer from '$lib/components/protocols/ProtocolExplorer.svelte';
</script>

<section class="mx-auto max-w-screen-xl pb-2 px-8">
  <div class="container mx-auto">
    <div class="mb-4 flex justify-end justify-items-stretch gap-3">
      <Nav />
    </div>

    <ProtocolExplorer />
  </div>
</section>