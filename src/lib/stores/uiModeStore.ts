import { writable } from "svelte/store";

export const uiMode = writable<'ui' | 'cli'>('ui');

export function switchUIMode(mode: 'ui' | 'cli') {
  uiMode.set(mode);
}
