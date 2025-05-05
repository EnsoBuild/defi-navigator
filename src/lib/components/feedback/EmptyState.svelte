<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import Button from '../common/Button.svelte';
  
  interface Props {
    message?: string;
    description?: string;
    actionText?: string;
    icon?: 'search' | 'warning' | 'info' | 'empty';
    illustration?: 'none' | 'no-results' | 'empty' | 'error';
  }

  let {
    message = 'No results found',
    description = '',
    actionText = '',
    icon = 'search',
    illustration = 'none'
  }: Props = $props();
  
  const dispatch = createEventDispatcher();
  
  function handleAction() {
    dispatch('action');
  }
  
  // Available icons
  const icons = {
    search: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>`,
    warning: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>`,
    info: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>`,
    empty: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21.21 15.89A10 10 0 1 1 8 2.83"></path><path d="M22 12A10 10 0 0 0 12 2v10z"></path></svg>`
  };
  
  // Illustrations for more visual impact
  const illustrations = {
    'no-results': `
      <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="60" cy="60" r="40" stroke="url(#paint0_linear)" stroke-width="2" stroke-dasharray="4 4"/>
        <circle cx="60" cy="60" r="50" stroke="#333" stroke-width="1" stroke-dasharray="2 2"/>
        <circle cx="60" cy="60" r="25" fill="#1a1a1a" stroke="url(#paint1_linear)" stroke-width="2"/>
        <path d="M48 60L57 68L72 52" stroke="url(#paint2_linear)" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
        <defs>
          <linearGradient id="paint0_linear" x1="20" y1="40" x2="100" y2="80" gradientUnits="userSpaceOnUse">
            <stop stop-color="#ff3d87"/>
            <stop offset="1" stop-color="#ea3ef7"/>
          </linearGradient>
          <linearGradient id="paint1_linear" x1="35" y1="45" x2="85" y2="75" gradientUnits="userSpaceOnUse">
            <stop stop-color="#ff3d87"/>
            <stop offset="1" stop-color="#ea3ef7"/>
          </linearGradient>
          <linearGradient id="paint2_linear" x1="48" y1="60" x2="72" y2="60" gradientUnits="userSpaceOnUse">
            <stop stop-color="#ff3d87"/>
            <stop offset="1" stop-color="#ea3ef7"/>
          </linearGradient>
        </defs>
      </svg>
    `,
    'empty': `
      <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="30" y="40" width="60" height="50" rx="4" stroke="url(#paint0_linear)" stroke-width="2"/>
        <path d="M30 50H90" stroke="url(#paint1_linear)" stroke-width="2"/>
        <path d="M45 35L45 45" stroke="#333" stroke-width="2" stroke-linecap="round"/>
        <path d="M75 35L75 45" stroke="#333" stroke-width="2" stroke-linecap="round"/>
        <path d="M60 65L60 75" stroke="url(#paint2_linear)" stroke-width="2" stroke-linecap="round"/>
        <path d="M50 70L70 70" stroke="url(#paint3_linear)" stroke-width="2" stroke-linecap="round"/>
        <defs>
          <linearGradient id="paint0_linear" x1="30" y1="40" x2="90" y2="90" gradientUnits="userSpaceOnUse">
            <stop stop-color="#ff3d87"/>
            <stop offset="1" stop-color="#ea3ef7"/>
          </linearGradient>
          <linearGradient id="paint1_linear" x1="30" y1="50" x2="90" y2="50" gradientUnits="userSpaceOnUse">
            <stop stop-color="#ff3d87"/>
            <stop offset="1" stop-color="#ea3ef7"/>
          </linearGradient>
          <linearGradient id="paint2_linear" x1="60" y1="65" x2="60" y2="75" gradientUnits="userSpaceOnUse">
            <stop stop-color="#ff3d87"/>
            <stop offset="1" stop-color="#ea3ef7"/>
          </linearGradient>
          <linearGradient id="paint3_linear" x1="50" y1="70" x2="70" y2="70" gradientUnits="userSpaceOnUse">
            <stop stop-color="#ff3d87"/>
            <stop offset="1" stop-color="#ea3ef7"/>
          </linearGradient>
        </defs>
      </svg>
    `,
    'error': `
      <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M60 30L85 75L35 75L60 30Z" stroke="url(#paint0_linear)" stroke-width="2"/>
        <path d="M60 60L60 50" stroke="url(#paint1_linear)" stroke-width="3" stroke-linecap="round"/>
        <circle cx="60" cy="65" r="2" fill="url(#paint2_linear)"/>
        <defs>
          <linearGradient id="paint0_linear" x1="35" y1="45" x2="85" y2="75" gradientUnits="userSpaceOnUse">
            <stop stop-color="#ff3d87"/>
            <stop offset="1" stop-color="#ea3ef7"/>
          </linearGradient>
          <linearGradient id="paint1_linear" x1="60" y1="50" x2="60" y2="60" gradientUnits="userSpaceOnUse">
            <stop stop-color="#ff3d87"/>
            <stop offset="1" stop-color="#ea3ef7"/>
          </linearGradient>
          <linearGradient id="paint2_linear" x1="58" y1="65" x2="62" y2="65" gradientUnits="userSpaceOnUse">
            <stop stop-color="#ff3d87"/>
            <stop offset="1" stop-color="#ea3ef7"/>
          </linearGradient>
        </defs>
      </svg>
    `
  };
</script>

<div class="text-center py-10 px-5 text-text-tertiary flex flex-col items-center justify-center">
  {#if illustration !== 'none'}
    <div class="mb-4 animation-pulse-subtle">
      {@html illustrations[illustration]}
    </div>
  {:else}
    <div class="text-gray-600 mb-4">
      {@html icons[icon]}
    </div>
  {/if}
  
  <h3 class="text-lg font-medium text-text-primary m-0 mb-2">{message}</h3>
  
  {#if description}
    <p class="text-sm max-w-md m-0 mb-4">{description}</p>
  {/if}
  
  {#if actionText}
    <Button 
      variant="secondary"
      size="sm"
      on:click={handleAction}
    >
      {actionText}
    </Button>
  {/if}
</div>

<style>
  .animation-pulse-subtle {
    animation: pulse-subtle 3s infinite ease-in-out;
  }
  
  @keyframes pulse-subtle {
    0% {
      transform: scale(1);
      opacity: 1;
    }
    50% {
      transform: scale(1.05);
      opacity: 0.9;
    }
    100% {
      transform: scale(1);
      opacity: 1;
    }
  }
</style>

