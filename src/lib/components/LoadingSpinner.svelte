<script>
  export let size = "24px";
  export let borderWidth = "3px";
  export let text = null;
</script>

<div class="loading-container">
  <div class="spinner" style="width: {size}; height: {size}; border-width: {borderWidth};"></div>
  {#if text}
    <p>{text}</p>
  {/if}
</div>

<style>
  .loading-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 12px;
  }
  
  .spinner {
    border: 3px solid rgba(255, 61, 135, 0.2);
    border-top-color: #ff3d87;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }
  
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
  
  p {
    color: #a0a0a0;
    margin: 0;
    font-size: 14px;
  }
</style>