<script lang="ts">
  import {  MousePointerIcon, TerminalIcon } from '@lucide/svelte';
  import Button from '$lib/components/common/Button.svelte';

  let { current, onSwitch }: { current: 'ui' | 'cli'; onSwitch: (other: 'ui' | 'cli') => void } =
    $props();

  function switchTo() {
    onSwitch(current == 'ui' ? 'cli' : 'ui');
    console.debug('Switching view to', current == 'ui' ? 'cli' : 'ui');
  }
</script>

<div class="relative">
  <Button
    class="btn btn-sm border-brdr-light group flex items-center gap-1.5 border! text-white"
    on:click={switchTo}
  >
    <div class="text-xxs flex flex-col items-center gap-1">
      {#if current === 'ui'}
        <TerminalIcon
          color="#ffffff"
          size={14}
          class="transition-transform group-hover:-translate-y-1"
        />
        CLI
      {:else}
        <MousePointerIcon
          color="#ffffff"
          size={14}
          class="transition-transform group-hover:-translate-y-1"
        />
        UI
      {/if}
    </div>
  </Button>
</div>
