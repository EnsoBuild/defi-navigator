import type { TokenParams } from '$lib/types/api';
import { writable } from 'svelte/store';

export const tokenParams = writable<TokenParams>({});
