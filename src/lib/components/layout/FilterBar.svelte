<script lang="ts">
  import { PlayIcon } from '@lucide/svelte';
  import { fade } from 'svelte/transition';
  import { executeSearch } from '$lib/stores/filterStore';
  import { isLoading, loadingProgress } from '$lib/stores/tokenStore';
  import FilterSystem from '$lib/components/filters/FilterSystem.svelte';
  import Button from '$lib/components/common/Button.svelte';
</script>

<div
  class="bg-bg-secondary border-brdr-light fixed right-0 bottom-0 left-0 z-10 mx-auto flex w-full items-center justify-between border-t px-6 py-4 pb-5"
>
  {#if $isLoading || $loadingProgress > 0}
    <div
      class="bg-primary shadow-primary/50 absolute top-0 left-0 h-[1px] py-[1px] transition-all duration-300 ease-out"
      style="width: {$loadingProgress}%;"
      transition:fade={{ duration: 300 }}
    ></div>
  {/if}
  
  <div class="flex w-full items-center gap-3">
    <div class="flex-grow">
      <FilterSystem />
    </div>
    <Button
      on:click={executeSearch}
      size="sm"
      aria-label="Run search (CMD+Enter/CTRL+Enter)"
      title="Run search (CMD+Enter/CTRL+Enter)"
      disabled={$isLoading}
    >
      <PlayIcon size={16} />
    </Button>
  </div>
</div>


