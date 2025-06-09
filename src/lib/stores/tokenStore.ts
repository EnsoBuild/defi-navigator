import { derived, writable } from 'svelte/store';
import { cubicOut } from 'svelte/easing';

import type { TokenParams, TokenData } from '$lib/types';
import { getTokenData } from '$lib/services/api/tokens';
import { Tween } from 'svelte/motion';

// Primary state
export const tokens = writable<TokenData[]>([]);
export const selectedToken = writable<TokenData | null>(null);
export const isLoading = writable(false);
export const error = writable<string | null>(null);

export const loadingProgress = new Tween(0, {
  duration: 800,
  easing: cubicOut
});

// Derived stores
export const hasTokens = derived(tokens, ($tokens) => $tokens.length > 0);
export const tokenCount = derived(tokens, ($tokens) => $tokens.length);

// Loading management
let currentLoadPromise: Promise<TokenData[]> | null = null;
let loaderInterval: ReturnType<typeof setInterval> | null = null;

// Actions
export async function loadTokens(params: TokenParams): Promise<void> {
  // If already loading, cancel the current loading animation
  if (loaderInterval) {
    clearInterval(loaderInterval);
    loaderInterval = null;
  }

  try {
    isLoading.set(true);
    error.set(null);

    // Start progress animation
    loadingProgress.set(0, { duration: 0 }); // Instant reset
    loadingProgress.set(80); // Smooth animation to 85%

    // Load tokens
    currentLoadPromise = getTokenData({ ...params, includeMetadata: true });
    const result = await currentLoadPromise;
    tokens.set(result);

    // Complete progress animation
    loadingProgress.set(100);

    // Reset progress after a delay
    setTimeout(() => {
      loadingProgress.set(0, { duration: 100 });
    }, 300);
  } catch (err) {
    error.set(err instanceof Error ? err.message : 'Failed to load tokens');
    tokens.set([]);

    // Reset progress immediately on error
    loadingProgress.set(0, { duration: 0 });
  } finally {
    isLoading.set(false);
    currentLoadPromise = null;
  }
}

export function selectToken(token: TokenData): void {
  selectedToken.set(token);
}

export function clearSelectedToken(): void {
  selectedToken.set(null);
}

export function cleanup(): void {
  if (loaderInterval) {
    clearInterval(loaderInterval);
    loaderInterval = null;
  }
}
