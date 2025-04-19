<!-- CopyButton.svelte -->
<script lang="ts">
    export let text: string;
    export let label: string = "Copy";
    export let compact: boolean = true;
    export let small: boolean = false;
    
    let copied = false;
    
    function copyToClipboard() {
      navigator.clipboard.writeText(text);
      copied = true;
      
      setTimeout(() => {
        copied = false;
      }, 2000);
    }
  </script>
  
  <button
    class="copy-button"
    class:small
    class:copied
    on:click={copyToClipboard}
    aria-label={`Copy ${label}`}
  >
    {#if copied}
      {#if !compact}
      {label}
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
  
  <style>
    .copy-button {
      background-color: #2a2a2a;
      border: none;
      color: #f0f0f0;
      padding: 8px 12px;
      border-radius: 6px;
      cursor: pointer;
      margin-right: 4px;
      font-size: 13px;
      transition: background-color 0.2s;
      white-space: nowrap;
    }
    
    .small {
      padding: 6px 10px;
      font-size: 12px;
    }
  
    .copy-button:hover {
      background-color: #333;
    }
    
    .copied {
      background-color: #1e8a3e;
    }
  </style>