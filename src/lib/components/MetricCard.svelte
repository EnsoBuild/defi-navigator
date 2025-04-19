<!-- MetricCard.svelte -->
<script lang="ts">
    export let title: string;
    export let value: string | number;
    export let type: 'apy' | 'tvl' | 'default' = 'default';
    export let subValues: {label: string, value: string | number}[] = [];
    
    // Determine if high APY for styling
    $: isHighAPY = type === 'apy' && typeof value === 'number' && value > 5;
    
    // Get appropriate CSS classes based on type
    $: typeClass = (() => {
      if (type === 'apy') return isHighAPY ? 'high-apy-card' : 'apy-card';
      if (type === 'tvl') return 'tvl-card';
      return 'default-card';
    })();
    
    // Get appropriate value class
    $: valueClass = (() => {
      if (type === 'apy') return isHighAPY ? 'high-apy' : 'apy-value';
      if (type === 'tvl') return 'tvl-value';
      return '';
    })();
  </script>
  
  <div class={`key-metric ${typeClass}`}>
    <div class="metric-header">{title}</div>
    <div class={`metric-value ${valueClass}`}>
      {#if typeof value === 'number'}
        {type === 'apy' ? `${value.toFixed(2)}%` : value}
      {:else}
        {value}
      {/if}
    </div>
    
    {#if subValues.length > 0}
      <div class="metric-breakdown">
        {#each subValues as { label, value }}
          <div class="breakdown-item">
            <span>{label}</span>
            <span>
              {#if typeof value === 'number'}
                {type === 'apy' ? `${value.toFixed(2)}%` : value}
              {:else}
                {value}
              {/if}
            </span>
          </div>
        {/each}
      </div>
    {/if}
  </div>
  
  <style>
    .key-metric {
      padding: 14px;
      border-radius: 14px;
      display: flex;
      flex-direction: column;
      gap: 6px;
      position: relative;
      overflow: hidden;
    }
  
    .apy-card {
      background-color: rgba(74, 222, 128, 0.08);
      border: 1px solid rgba(74, 222, 128, 0.2);
    }
  
    .high-apy-card {
      background-color: rgba(255, 61, 135, 0.08);
      border: 1px solid rgba(255, 61, 135, 0.2);
    }
  
    .tvl-card {
      background-color: rgba(59, 130, 246, 0.08);
      border: 1px solid rgba(59, 130, 246, 0.2);
    }
    
    .default-card {
      background-color: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
    }
  
    .metric-header {
      color: #a0a0a0;
      font-size: 14px;
      font-weight: 500;
    }
  
    .metric-value {
      font-size: 24px;
      font-weight: 700;
      margin: 6px 0;
      color: #f0f0f0;
    }
  
    .apy-value {
      color: #4ade80;
      background: linear-gradient(90deg, #4ade80, #34d399);
      -webkit-background-clip: text;
      background-clip: text;
      -webkit-text-fill-color: transparent;
    }
  
    .high-apy {
      color: #ff3d87;
      background: linear-gradient(90deg, #ff3d87, #ff56a9);
      -webkit-background-clip: text;
      background-clip: text;
      -webkit-text-fill-color: transparent;
    }
  
    .tvl-value {
      color: #60a5fa;
      background: linear-gradient(90deg, #60a5fa, #3b82f6);
      -webkit-background-clip: text;
      background-clip: text;
      -webkit-text-fill-color: transparent;
    }
  
    .metric-breakdown {
      margin-top: 8px;
      display: flex;
      flex-direction: column;
      gap: 6px;
      padding-top: 10px;
      border-top: 1px solid rgba(255, 255, 255, 0.1);
    }
  
    .breakdown-item {
      display: flex;
      justify-content: space-between;
      font-size: 13px;
      color: #d1d1d1;
    }
  </style>