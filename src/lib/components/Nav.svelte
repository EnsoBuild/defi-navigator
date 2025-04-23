<script lang="ts">
  import { run } from 'svelte/legacy';

  import { onMount } from 'svelte';
  import { page } from '$app/state';

  let currentPage = $state('tokens');

  run(() => {
    currentPage = page.url.pathname.indexOf('/protocols') !== -1 ? 'protocols' : 'tokens';
  });

  onMount(() => {});
</script>

<div class="flex w-full items-center justify-between gap-4 py-2 pb-5">
  <h1 class="text-text-primary text-2xl font-bold tracking-tight">
    Enso <span
      class="accent from-primary to-primary-hover bg-gradient-to-r bg-clip-text text-transparent"
      >DeFi</span
    > Explorer
  </h1>
  <div class="bg-bg-tertiary flex overflow-hidden rounded-md">
    <a
      class="btn {currentPage === 'tokens'
        ? 'btn-primary'
        : 'btn-ghost'} btn-md no-translate rounded-none! border-0 px-4"
      href="/"
    >
      Tokens
    </a>
    <a
      class="btn {currentPage === 'protocols'
        ? 'btn-primary'
        : 'btn-ghost'} btn-md no-translate rounded-none! border-0 px-4"
      href="/protocols"
    >
      Protocols
    </a>
  </div>
</div>
<!-- <button class="btn btn-secondary btn-md no-translate" on:click={share}> Share </button> -->
