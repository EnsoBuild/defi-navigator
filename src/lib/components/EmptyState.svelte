<script lang="ts">
  export let message: string = 'No results found';
  export let description: string = '';
  export let actionText: string = '';
  export let icon: string = 'search';

  function handleAction() {
    dispatch('action');
  }

  import { createEventDispatcher } from 'svelte';
  const dispatch = createEventDispatcher();

  const icons = {
    search: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>`,
    warning: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>`,
    info: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>`
  };
</script>

<div class="empty-state">
  <div class="empty-icon">
    {@html icons[icon] || icons.search}
  </div>

  <h3 class="empty-title">{message}</h3>

  {#if description}
    <p class="empty-description">{description}</p>
  {/if}

  {#if actionText}
    <button class="empty-action" on:click={handleAction}>
      {actionText}
    </button>
  {/if}
</div>

<style>
  @import 'tailwindcss';

  .empty-state {
    @apply text-center py-10 px-5 text-gray-500 flex flex-col items-center justify-center;
  }

  .empty-icon {
    @apply text-gray-700 mb-4;
  }

  .empty-title {
    @apply text-xl font-medium text-gray-100 mb-2;
  }

  .empty-description {
    @apply text-sm max-w-md mx-auto mb-4; /* Added mx-auto for centering */
  }

  .empty-action {
    @apply mt-3 bg-gray-800 border border-gray-700 rounded px-4 py-2 text-sm text-gray-100 cursor-pointer transition-colors hover:bg-gray-700;
  }
</style>