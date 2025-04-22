<script lang="ts">
  import { fade } from 'svelte/transition';
  
  export let text: string;
  export let label: string = "Copy";
  export let compact: boolean = true;
  export let small: boolean = false;
  
  let copied = false;
  let tooltipVisible = false;
  
  function copyToClipboard() {
    navigator.clipboard.writeText(text);
    copied = true;
    tooltipVisible = true;
    
    setTimeout(() => {
      copied = false;
      
      // Keep tooltip visible a bit longer than copy state
      setTimeout(() => {
        tooltipVisible = false;
      }, 500);
    }, 1500);
  }
</script>

<div class="relative">
  <button
    class="cursor-pointer inline-flex items-center justify-center {small ? 'py-1.5 px-2.5 text-xs' : 'py-2 px-3 text-sm'} pointer
    rounded-md transition-all hover-scale {copied ? 'bg-success text-white' : 'text-text-primary hover:bg-border'}"
    on:click|preventDefault|stopPropagation={copyToClipboard}
    aria-label={`Copy ${label}`}
  >
    {#if copied}
      {#if !compact}
        <span transition:fade={{duration: 150}}>Copied!</span>
      {:else}
        <!-- svg - check mark success  -->
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="text-white"
        >
          <path d="M20 6L9 17l-5-5" />
        </svg>
      {/if}
    {:else if !compact}
      {label}
    {:else}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
      </svg>
    {/if}
  </button>
  
  {#if tooltipVisible && compact}
    <div 
      class="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-bg-elevated px-2 py-1 rounded text-xs whitespace-nowrap border border-brdr shadow-sm"
      transition:fade={{duration: 150}}
    >
      {copied ? 'Copied!' : 'Copy to clipboard'}
    </div>
  {/if}
</div>

