<script lang="ts">
  interface Props {
    size?: string;
    borderWidth?: string;
    text?: string | null;
    variant?: 'primary' | 'secondary';
  }

  let {
    size = "24px",
    borderWidth = "3px",
    text = null,
    variant = 'primary'
  }: Props = $props();
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

