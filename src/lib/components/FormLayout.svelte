<!-- Card.svelte -->
<script lang="ts">
  export let padding: 'sm' | 'md' | 'lg' = 'md';
  export let interactive: boolean = false;
  export let highlighted: boolean = false;
  
  const paddingClasses = {
    sm: 'p-3',
    md: 'p-5',
    lg: 'p-6'
  };
</script>

<div 
  class="card {paddingClasses[padding]}" 
  class:interactive
  class:highlighted
  on:click
  on:keydown
  {...$$restProps}
>
  <slot />
</div>

<style>
  .card {
    border: 1px solid #333;
    border-radius: 12px;
    background-color: #1e1e1e;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    position: relative;
    overflow: hidden;
  }
  
  .p-3 {
    padding: 12px;
  }
  
  .p-5 {
    padding: 20px;
  }
  
  .p-6 {
    padding: 24px;
  }
  
  .interactive {
    cursor: pointer;
    transition:
      transform 0.2s ease,
      box-shadow 0.2s ease,
      border-color 0.2s ease;
  }
  
  .interactive::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(90deg, #ff3d87, #ff56a9);
    transform: scaleX(0);
    transform-origin: left;
    transition: transform 0.3s ease;
    opacity: 0;
  }
  
  .interactive:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
    border-color: #444;
  }
  
  .interactive:hover::before {
    transform: scaleX(1);
    opacity: 1;
  }
  
  .highlighted {
    border-color: rgba(255, 61, 135, 0.4);
    box-shadow: 0 0 0 1px rgba(255, 61, 135, 0.2);
  }
</style>