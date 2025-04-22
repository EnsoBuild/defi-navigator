<script lang="ts">
  export let size: string = "24px";
  export let borderWidth: string = "3px";
  export let text: string | null = null;
  export let variant: 'primary' | 'secondary' = 'primary';
</script>

<div class="flex flex-col items-center justify-center gap-3">
  <div 
    class="spinner spinner-{variant}"
    style="width: {size}; height: {size}; border-width: {borderWidth};"
  ></div>
  {#if text}
    <p class="text-text-tertiary text-sm m-0">{text}</p>
  {/if}
</div>

