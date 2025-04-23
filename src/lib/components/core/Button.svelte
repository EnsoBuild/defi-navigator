<script lang="ts">
  import { createBubbler } from 'svelte/legacy';

  const bubble = createBubbler();
  import type { Component } from "@lucide/svelte";

  
  interface Props {
    variant?: 'primary' | 'secondary' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
    // export let disabled: boolean = false;
    fullWidth?: boolean;
    icon?: string | null;
    iconPosition?: 'left' | 'right';
    Icon?: Component; // Placeholder for icon component
    children?: import('svelte').Snippet;
    [key: string]: any
  }

  let {
    variant = 'primary',
    size = 'md',
    fullWidth = false,
    icon = null,
    iconPosition = 'left',
    Icon = null,
    children,
    ...rest
  }: Props = $props();
</script>

<div
  class="btn {`btn-${variant}`} {`btn-${size}`} {fullWidth ? 'w-full' : ''}"
  onclick={bubble('click')}
  onmouseover={bubble('mouseover')}
  onmouseout={bubble('mouseout')}
  {...rest}
>
  {#if icon && iconPosition === 'left'}
    <span class="mr-2">
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
        <!-- Different icon paths based on the icon prop -->
        {#if icon === 'copy'}
          <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
        {:else if icon === 'check'}
          <path d="M20 6L9 17l-5-5" />
        {:else if icon === 'search'}
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        {:else if icon === 'close'}
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        {/if}
      </svg>
    </span>
  {/if}

  {@render children?.()}

  {#if icon && iconPosition === 'right'}
    <span class="ml-2">
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
        <!-- Different icon paths based on the icon prop -->
        {#if icon === 'copy'}
          <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
        {:else if icon === 'check'}
          <path d="M20 6L9 17l-5-5" />
        {:else if icon === 'search'}
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        {:else if icon === 'close'}
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        {/if}
      </svg>
    </span>
  {/if}
</div>
