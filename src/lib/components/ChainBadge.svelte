<script lang="ts">
    export let chainId: number;
    export let showLabel: boolean = true;
  </script>
  
  <div class="token-chain">
    {#if showLabel}
      <span class="chain-label">Chain</span>
    {/if}
    <span class="chain-id">{chainId}</span>
  </div>
  
  <style>
    @import 'tailwindcss';
    .token-chain{
      @apply flex justify-between items-center mt-3;
    }
  
    .chain-label {
      @apply text-gray-500;
    }
  
    .chain-id {
      @apply bg-gray-800 px-2 py-0.5 rounded text-xs font-medium;
    }
  </style>