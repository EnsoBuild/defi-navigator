<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  
  export let value: string = '';
  export let type: string = 'text';
  export let placeholder: string = '';
  export let disabled: boolean = false;
  export let required: boolean = false;
  export let name: string = '';
  export let id: string = '';
  export let label: string = '';
  export let error: string = '';
  export let icon: string | null = null;
  export let iconPosition: 'left' | 'right' = 'right';
  export let clearable: boolean = false;
  
  const dispatch = createEventDispatcher();
  
  function handleInput(event: Event) {
    const target = event.target as HTMLInputElement;
    value = target.value;
    dispatch('input', { value });
  }
  
  function handleClear() {
    value = '';
    dispatch('input', { value });
    dispatch('clear');
  }
</script>

<div class="flex flex-col gap-2 w-full">
  {#if label}
    <label for={id} class="text-sm text-text-secondary font-medium">{label}</label>
  {/if}
  
  <div class="relative">
    <input 
      {type}
      {id}
      {name}
      {placeholder}
      {disabled}
      {required}
      class="form-input {error ? 'border-error' : ''} {icon && iconPosition === 'left' ? 'pl-10' : ''} {(clearable || (icon && iconPosition === 'right')) ? 'pr-10' : ''}"
      bind:value
      on:input={handleInput}
      on:focus
      on:blur
      on:keydown
      autocomplete="off"
      {...$$restProps}
    />
    
    {#if icon && !value && clearable}
      <div class="absolute {iconPosition === 'left' ? 'left-3' : 'right-3'} top-1/2 transform -translate-y-1/2 text-text-tertiary">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          {#if icon === 'search'}
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          {:else if icon === 'mail'}
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
            <polyline points="22,6 12,13 2,6"></polyline>
          {:else if icon === 'lock'}
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
          {/if}
        </svg>
      </div>
    {/if}
    
    {#if clearable && value}
      <button 
        type="button"
        class="absolute right-3 top-1/2 transform -translate-y-1/2 bg-transparent border-none text-text-tertiary hover:text-text-primary cursor-pointer p-1"
        on:click={handleClear}
        aria-label="Clear"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>
    {/if}
  </div>
  
  {#if error}
    <p class="text-xs text-error mt-1">{error}</p>
  {/if}
</div>

