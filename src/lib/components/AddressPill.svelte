<!-- AddressPill.svelte -->
<script lang="ts">
    import CopyButton from './CopyButton.svelte';
    
    export let address: string;
    export let small: boolean = false;
    export let label: string = "address";
  </script>
  
  <div class="address-container" class:small>
    <code class="address">{address}</code>
    <CopyButton text={address} label={`Copy ${label}`} small={small} />
  </div>
  
  <style>
    .address-container {
      display: flex;
      background-color: #1a1a1a;
      border-radius: 8px;
      padding: 2px;
      align-items: center;
      font-family: 'Roboto Mono', monospace;
      overflow: hidden;
      border: 1px solid #333;
    }
  
    .address {
      padding: 8px 10px;
      font-size: 13px;
      color: #a0a0a0;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      flex: 1;
    }
  
    .small .address {
      font-size: 12px;
      padding: 6px 8px;
    }
  </style>