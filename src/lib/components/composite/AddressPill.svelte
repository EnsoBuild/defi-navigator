<script lang="ts">
  import CopyButton from './CopyButton.svelte';
  
  interface Props {
    address: string;
    small?: boolean;
    label?: string;
    truncate?: boolean;
  }

  let {
    address,
    small = false,
    label = "address",
    truncate = false
  }: Props = $props();
  
  let displayAddress = $derived(truncate ? 
    `${address.substring(0, 6)}...${address.substring(address.length - 4)}` : 
    address);
</script>

<div class={`address-pill flex bg-bg-secondary rounded-md border border-brdr-light overflow-hidden items-center ${small ? 'text-xs' : 'text-sm'}`}>
  <code class={`py-${small ? '1.5' : '2'} px-${small ? '2' : '2.5'} text-text-tertiary overflow-hidden text-ellipsis whitespace-nowrap flex-1 font-mono hover:text-text-primary transition-colors`}>
    {displayAddress}
  </code>
  <CopyButton text={address} small={small} label={label} />
</div>

