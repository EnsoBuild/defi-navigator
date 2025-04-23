<script lang="ts">
  import { createShareableUrl } from '$lib/search/url';
  import type { TokenParams } from '../../types/api';
  import { fade } from 'svelte/transition';
  import { Share } from '@lucide/svelte';
  import Button from './Button.svelte';

  export let tokenParams: TokenParams = {};
  let isActive = false;
  export let moreRoom = false;

  function handleClick() {
    isActive = true;
    console.debug(tokenParams);
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
    class="btn text-white btn-sm border-brdr-light flex items-center gap-1.5 border! group"
    on:click={handleClick}
  >
    <div class="flex flex-{moreRoom ? 'col' : 'row'} items-center gap-1 text-xxs">
      <Share color="#ffffff" size={14} class="transition-transform group-hover:-translate-y-1"/>
      Share
    </div>
  </Button>

  {#if isActive}
    <div
      class="bg-bg-elevated border-brdr absolute top-full left-1/2 mb-2 -translate-x-1/2 transform rounded border px-2 py-1 text-xs whitespace-nowrap shadow-sm"
      transition:fade={{ duration: 150 }}
    >
      Copied to Clipboard!
    </div>
  {/if}
</div>
