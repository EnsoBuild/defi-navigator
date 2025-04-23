<script lang="ts">
  import { fade } from 'svelte/transition';
  import { CommandIcon, MousePointerIcon } from '@lucide/svelte';
  import Button from './core/Button.svelte';

  let {
    current,
    onSwitch,
    className
  }: { current: 'ui' | 'cli'; onSwitch: (other: 'ui' | 'cli') => void; className: any } = $props();

  function switchTo() {
    onSwitch(current == 'ui' ? 'cli' : 'ui');
    console.log('Switching view to', current == 'ui' ? 'cli' : 'ui');
  }
</script>

<div class="relative">
  <Button
    class="btn btn-sm border-brdr-light group flex items-center gap-1.5 border! text-white"
    on:click={switchTo}
  >
    {#if current === 'ui'}
      <div class="text-xxs flex flex-row items-center gap-1">
        <MousePointerIcon
          color="#ffffff"
          size={14}
          class="transition-transform group-hover:-translate-y-1"
        />
        UI
      </div>
    {:else}
      <div class="text-xxs flex flex-col items-center gap-1">
        <CommandIcon
          color="#ffffff"
          size={14}
          class="transition-transform group-hover:-translate-y-1"
        />
        CLI
      </div>
    {/if}
  </Button>
</div>
