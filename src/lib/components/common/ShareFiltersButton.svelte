<script lang="ts">
  import { createShareableUrl } from '$lib/utils/url';
  import type { TokenParams } from '$lib/types';
  import { fade } from 'svelte/transition';
  import { Share } from '@lucide/svelte';
  import Button from '$lib/components/common/Button.svelte';

  let isActive = $state(false);
  interface Props {
    tokenParams?: TokenParams;
    moreRoom?: boolean;
  }

  let { tokenParams = {}, moreRoom = false }: Props = $props();

  function handleClick() {
    isActive = true;
    console.debug('tokenParams', tokenParams);
    const it = createShareableUrl(tokenParams);
    console.debug("tps", it);
    navigator.clipboard
      .writeText(createShareableUrl(tokenParams))
      .then(() => {
        isActive = true;
      })
      .catch((err: any) => {
        console.error('Failed to copy:', err);
      });
    setTimeout(() => {
      isActive = false;
    }, 3000);
  }
</script>

<div class="relative">
  <Button
    class="btn btn-sm border-brdr-light group flex items-center gap-1.5 border! text-white"
    on:click={handleClick}
  >
    <div class="flex flex-col text-xs items-center gap-1">
      <Share color="#ffffff" size={14} class="transition-transform group-hover:-translate-y-1" />
      Share
    </div>

    {#if isActive}
      <div
        class="bg-bg-elevated border-brdr absolute top-full left-1/2 mb-2 -translate-x-1/2 transform rounded border px-2 py-1 text-xs whitespace-nowrap shadow-sm"
        transition:fade={{ duration: 150 }}
      >
        Copied to Clipboard!
      </div>
    {/if}
  </Button>
</div>
