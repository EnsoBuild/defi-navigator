<script lang="ts">
  import { goto } from '$app/navigation';
  import { page } from '$app/state';
  import {
  BookOpenIcon,
    BookUp2Icon,
    BugIcon,
    CoinsIcon,
    GithubIcon,
    NavigationIcon,
    ToyBrickIcon
  } from '@lucide/svelte';
  import { onMount } from 'svelte';

  let currentPage = $state('projects');

  $effect.pre(() => {
    const pathname = page.url.pathname;
    if (pathname.includes('/protocols')) {
      // Redirect old protocol routes to projects
      window.location.href = '/projects';
    } else if (pathname.includes('/projects')) {
      currentPage = 'projects';
    } else if (pathname.includes('/tokens')) {
      currentPage = 'tokens';
    } else {
      // Default to projects (including root path '/')
      currentPage = 'projects';
    }
  });

  onMount(() => {});
</script>

<div class="flex w-full flex-col gap-4 py-2 pb-5">
  <!-- First row: centered navigation buttons -->
  <div class="flex w-full items-center justify-center">
    <div class="bg-bg-tertiary flex overflow-hidden rounded-md">
      <a
        class="btn {currentPage === 'projects'
          ? 'btn-primary'
          : 'btn-ghost'} btn-md no-translate rounded-none! border-0 px-4"
        href="/projects"
      >
        <ToyBrickIcon size={16} />
        <span class="ml-2">Projects</span>
      </a>

      <a
        class="btn {currentPage === 'tokens'
          ? 'btn-primary'
          : 'btn-ghost'} btn-md no-translate rounded-none! border-0 px-4"
        href="/tokens"
      >
        <CoinsIcon size={16} />
        <span class="ml-2">Tokens</span>
      </a>

      <a
        href="https://happypath.enso.build"
        target="blank"
        class="btn btn-ghost btn-md no-translate rounded-none! border-0 px-4"
      >
        <NavigationIcon size={16} />
        <span class="ml-2">Routing</span>
      </a>
    </div>
  </div>

  <!-- Second row: h1 - space between - GH and Telegram buttons -->
  <div class="flex w-full items-center justify-between">
    <h1 class="text-text-primary text-2xl font-bold tracking-tight">
      Enso <span
        class="accent from-primary to-primary-hover bg-gradient-to-r bg-clip-text text-transparent"
        >DeFi</span
      > Navigator
    </h1>
    <div class="flex">
      <!-- Add your GitHub and Telegram buttons here -->
      <a
        class="btn btn-ghost btn-sm"
        href="https://github.com/EnsoBuild/defi-navigator"
        target="_blank"
        aria-label="GitHub"
      >
        <GithubIcon size={16} />
      </a>
      <a
        class="btn btn-ghost btn-sm"
        href="https://github.com/EnsoBuild/defi-navigator/issues"
        target="_blank"
        aria-label="GitHub Issues"
      >
        <BugIcon size={16} />
      </a>
      <a
        class="btn btn-ghost btn-sm"
        href="https://docs.enso.build"
        target="_blank"
        aria-label="Docs"
      >
        <BookOpenIcon size={16} />
      </a>
      <a class="btn btn-ghost btn-sm" href="https://t.me/enso_shortcuts" aria-label="Telegram">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          fill="currentColor"
          class="bi bi-telegram"
          viewBox="0 0 16 16"
        >
          <path
            d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M8.287 5.906q-1.168.486-4.666 2.01-.567.225-.595.442c-.03.243.275.339.69.47l.175.055c.408.133.958.288 1.243.294q.39.01.868-.32 3.269-2.206 3.374-2.23c.05-.012.12-.026.166.016s.042.12.037.141c-.03.129-1.227 1.241-1.846 1.817-.193.18-.33.307-.358.336a8 8 0 0 1-.188.186c-.38.366-.664.64.015 1.088.327.216.589.393.85.571.284.194.568.387.936.629q.14.092.27.187c.331.236.63.448.997.414.214-.02.435-.22.547-.82.265-1.417.786-4.486.906-5.751a1.4 1.4 0 0 0-.013-.315.34.34 0 0 0-.114-.217.53.53 0 0 0-.31-.093c-.3.005-.763.166-2.984 1.09"
          />
        </svg>
      </a>
    </div>
  </div>
</div>
