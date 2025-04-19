<!-- Button.svelte -->
<script lang="ts">
  export let variant: 'primary' | 'secondary' | 'ghost' = 'primary';
  export let size: 'sm' | 'md' | 'lg' = 'md';
  export let type: 'button' | 'submit' | 'reset' = 'button';
  export let disabled: boolean = false;
  export let fullWidth: boolean = false;
  
  const variantClasses = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    ghost: 'btn-ghost'
  };
  
  const sizeClasses = {
    sm: 'btn-sm',
    md: 'btn-md',
    lg: 'btn-lg'
  };
</script>

<button
  {type}
  class="btn {variantClasses[variant]} {sizeClasses[size]}"
  class:btn-full-width={fullWidth}
  {disabled}
  on:click
  {...$$restProps}
>
  <slot />
</button>

<style>
  .btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border-radius: 8px;
    font-weight: 500;
    transition: all 0.2s;
    cursor: pointer;
    border: none;
  }
  
  .btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  .btn-primary {
    background: linear-gradient(90deg, #ff3d87, #ff56a9);
    color: white;
  }
  
  .btn-primary:hover:not(:disabled) {
    opacity: 0.9;
    transform: translateY(-1px);
  }
  
  .btn-secondary {
    background-color: #2a2a2a;
    color: #f0f0f0;
  }
  
  .btn-secondary:hover:not(:disabled) {
    background-color: #333;
  }
  
  .btn-ghost {
    background: none;
    color: #a0a0a0;
  }
  
  .btn-ghost:hover:not(:disabled) {
    color: #f0f0f0;
    background-color: rgba(255, 255, 255, 0.05);
  }
  
  .btn-sm {
    padding: 6px 12px;
    font-size: 12px;
  }
  
  .btn-md {
    padding: 10px 16px;
    font-size: 14px;
  }
  
  .btn-lg {
    padding: 12px 20px;
    font-size: 16px;
  }
  
  .btn-full-width {
    width: 100%;
  }
</style>