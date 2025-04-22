<script lang="ts">
  import { fade, scale } from 'svelte/transition';
  import { createEventDispatcher } from 'svelte';
  import Button from '../core/Button.svelte';

  export let show: boolean = false;
  export let title: string | null = null;
  export let maxWidth: string = '600px';
  export let closeOnBackdropClick: boolean = true;
  export let showClose: boolean = true;
  export let closeButtonText: string = 'Close';

  const dispatch = createEventDispatcher();

  function close() {
    dispatch('close');
  }

  function handleBackdropClick(event: MouseEvent) {
    if (closeOnBackdropClick && event.target === event.currentTarget) {
      close();
    }
  }

  function handleKeydown(event: KeyboardEvent) {
    if (event.key === 'Escape' && show) {
      close();
    }
  }
</script>

<!-- <svelte:window on:keydown={handleKeydown} /> -->

{#if show}
  <div
    class="fixed inset-0 flex items-center justify-center z-50 bg-black/70 backdrop-blur-sm"
    transition:fade={{ duration: 200 }}
    on:click={handleBackdropClick}
    role="dialog"
    aria-modal="true"
  >
    <div
      class="bg-bg-secondary rounded-xl w-[90%] max-h-[85vh] overflow-y-auto border border-brdr-light shadow-lg flex flex-col"
      style="max-width: {maxWidth};"
      transition:scale={{ duration: 300, start: 0.95 }}
    >
      <div class="py-5 px-6 border-b border-brdr-light flex items-start justify-between bg-bg-secondary sticky top-0 z-10 rounded-t-xl relative">
        <slot name="header">
          <h2 id="modal-title" class="m-0 text-xl text-text-primary font-semibold">{title}</h2>
        </slot>
        {#if showClose}
          <button 
            class="bg-transparent border-none text-text-tertiary text-2xl cursor-pointer leading-none p-0 transition-colors hover:text-text-primary hover-scale" 
            on:click={close} 
            aria-label="Close modal"
          >×</button>
        {/if}
      </div>

      <div class="p-6 flex-1 overflow-y-auto">
        <slot />
      </div>

      <div class="p-4 px-6 border-t border-brdr-light flex justify-between sticky bottom-0 bg-bg-secondary rounded-b-xl">
        <slot name="footer">
          <Button variant="secondary" on:click={close}>{closeButtonText}</Button>
        </slot>
      </div>
    </div>
  </div>
{/if}

