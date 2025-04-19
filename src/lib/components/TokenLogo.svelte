<!-- TokenLogo.svelte -->
<script lang="ts">
    export let logoUri: string | null = null;
    export let symbol: string | null = null;
    export let size: 'sm' | 'md' | 'lg' = 'md';
    
    const sizeClasses = {
      sm: 'w-8 h-8 text-xs',
      md: 'w-12 h-12 text-sm',
      lg: 'w-16 h-16 text-base'
    };
  </script>
  
  <div class={`token-logo ${sizeClasses[size]}`}>
    {#if logoUri}
      <img src={logoUri} alt={symbol || 'Token'} />
    {:else}
      <div class="placeholder-logo">{symbol?.substring(0, 2) || '??'}</div>
    {/if}
  </div>
  
  <style>
    .token-logo {
      border-radius: 50%;
      overflow: hidden;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: #2a2a2a;
      border: 1px solid #333;
    }
  
    .token-logo img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  
    .placeholder-logo {
      font-weight: bold;
      color: #f0f0f0;
      background-color: #444;
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  </style>