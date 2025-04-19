<!-- ChainBadge.svelte -->
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
    .token-chain {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 12px;
      font-size: 13px;
    }
  
    .chain-label {
      color: #a0a0a0;
    }
  
    .chain-id {
      background-color: #2a2a2a;
      padding: 3px 8px;
      border-radius: 4px;
      font-size: 12px;
      font-weight: 500;
    }
  </style>