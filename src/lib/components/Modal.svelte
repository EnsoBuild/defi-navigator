<!-- Modal.svelte -->
<script lang="ts">
  import { fade, scale } from 'svelte/transition';
  import { createEventDispatcher } from 'svelte';

  export let show: boolean = false;
  export let title: string | null = null;
  export let maxWidth: string = '600px';

  const dispatch = createEventDispatcher();

  function close() {
    dispatch('close');
  }

  function handleBackdropClick(event: MouseEvent) {
    if (event.target === event.currentTarget) {
      close();
    }
  }

  function handleKeydown(event: KeyboardEvent) {
    if (event.key === 'Escape' && show) {
      close();
    }
  }
</script>

<svelte:window on:keydown={handleKeydown} />

{#if show}
  <div
    class="overlay"
    transition:fade={{ duration: 200 }}
    on:click={handleBackdropClick}
    role="dialog"
    aria-modal="true"
  >
    <div
      class="modal"
      style="max-width: {maxWidth};"
      transition:scale={{ duration: 300, start: 0.95 }}
    >
      <div class="modal-header">
        <slot name="header">
          <h2 id="modal-title">{title}</h2>
        </slot>
        <button class="close-button" on:click={close} aria-label="Close modal">×</button>
      </div>

      <div class="modal-content">
        <slot />
      </div>

      <div class="modal-footer">
        <slot name="footer">
          <button class="close-modal-button" on:click={close}>Close</button>
        </slot>
      </div>
    </div>
  </div>
{/if}

<style>
  .overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.7);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    backdrop-filter: blur(2px);
  }

  .modal {
    background-color: #1a1a1a;
    border-radius: 16px;
    width: 90%;
    max-height: 85vh;
    overflow-y: auto;
    box-shadow:
      0 20px 25px -5px rgba(0, 0, 0, 0.5),
      0 10px 10px -5px rgba(0, 0, 0, 0.4);
    border: 1px solid #2a2a2a;
    display: flex;
    flex-direction: column;
  }

  .modal-header {
    padding: 20px 24px;
    border-bottom: 1px solid #2a2a2a;
    display: flex;
    align-items: center;
    justify-content: space-between;
    /* position: sticky; */
    top: 0;
    background-color: #1a1a1a;
    z-index: 10;
    border-top-left-radius: 16px;
    border-top-right-radius: 16px;
    position: relative;
  }

  .modal-header h2 {
    margin: 0;
    font-size: 20px;
    color: #f0f0f0;
    font-weight: 600;
  }

  .close-button {
    background: none;
    border: none;
    color: #a0a0a0;
    font-size: 28px;
    cursor: pointer;
    line-height: 1;
    padding: 0;
    transition: color 0.2s;
  }

  .close-button:hover {
    color: #f0f0f0;
  }

  .modal-content {
    padding: 24px;
    flex: 1;
    overflow-y: auto;
  }

  .modal-footer {
    padding: 16px 24px;
    border-top: 1px solid #2a2a2a;
    display: flex;
    justify-content: space-between;
    position: sticky;
    bottom: 0;
    background-color: #1a1a1a;
    border-bottom-left-radius: 16px;
    border-bottom-right-radius: 16px;
  }

  .close-modal-button {
    border-radius: 8px;
    padding: 10px 16px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
    border: none;
    background-color: #2a2a2a;
    color: #f0f0f0;
  }

  .close-modal-button:hover {
    background-color: #333;
  }
</style>
