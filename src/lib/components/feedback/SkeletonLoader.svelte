<script lang="ts">
  interface Props {
    type?: 'card' | 'text' | 'circle' | 'avatar' | 'custom';
    width?: string;
    height?: string;
    count?: number;
    rounded?: boolean;
  }

  let {
    type = 'text',
    width = 'auto',
    height = 'auto',
    count = 1,
    rounded = false
  }: Props = $props();
</script>

{#if type === 'card'}
  {#each Array(count) as _, i}
    <div 
      class="skeleton border border-brdr {rounded ? 'rounded-lg' : ''}" 
      style="width: {width}; height: {height || '200px'};"
    ></div>
  {/each}
{:else if type === 'text'}
  {#each Array(count) as _, i}
    <div 
      class="skeleton rounded-md" 
      style="width: {width || '100%'}; height: {height || '16px'}; margin-bottom: 8px;"
    ></div>
  {/each}
{:else if type === 'circle' || type === 'avatar'}
  {#each Array(count) as _, i}
    <div 
      class="skeleton rounded-full" 
      style="width: {width || '48px'}; height: {height || width || '48px'};"
    ></div>
  {/each}
{:else}
  {#each Array(count) as _, i}
    <div 
      class="skeleton {rounded ? 'rounded-md' : ''}" 
      style="width: {width}; height: {height};"
    ></div>
  {/each}
{/if}

