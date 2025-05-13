<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';

  // Redirect to projects page
  onMount(() => {
    goto('/projects', { replaceState: true });
  });
</script>

<div class="min-h-screen bg-bg-primary flex items-center justify-center">
  <p class="text-text-secondary">Redirecting to projects...</p>
</div>