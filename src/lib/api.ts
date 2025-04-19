import type { Network, Protocol, TokensResponse } from './types';

// API Configuration
const API_BASE_URL: string = 'https://api.enso.finance/api/v1';
const AUTH_TOKEN: string = '56b3d1f4-5c59-4fc1-8998-16d001e277bc';

// Fetch networks from API
export async function fetchNetworks(): Promise<Network[]> {
  const response = await fetch(`${API_BASE_URL}/networks`, {
    headers: {
      Authorization: `Bearer ${AUTH_TOKEN}`,
      Accept: 'application/json'
    }
  });

  if (!response.ok) {
    throw new Error(`Error fetching networks: ${response.statusText}`);
  }

  return await response.json();
}

// Fetch protocols from API
export async function fetchProtocols(): Promise<Protocol[]> {
  const response = await fetch(`${API_BASE_URL}/protocols`, {
    headers: {
      Authorization: `Bearer ${AUTH_TOKEN}`,
      Accept: 'application/json'
    }
  });

  if (!response.ok) {
    throw new Error(`Error fetching protocols: ${response.statusText}`);
  }

  return await response.json();
}

// Fetch tokens from API
export async function fetchTokens(
  protocolSlug: string,
  page: number = 1,
  chainId?: number | null
): Promise<TokensResponse> {
  let url = new URL(`${API_BASE_URL}/tokens`);
  let params = new URLSearchParams();

  params.append('protocolSlug', protocolSlug);
  params.append('includeMetadata', 'true');
  params.append('page', page.toString());

  if (chainId !== null && chainId !== undefined) {
    params.append('chainId', chainId.toString());
  }

  url.search = params.toString();

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${AUTH_TOKEN}`,
      Accept: 'application/json'
    }
  });

  if (!response.ok) {
    throw new Error(`Error fetching tokens: ${response.statusText}`);
  }

  return await response.json();
}

// Copy address to clipboard
export function copyToClipboard(text: string): Promise<void> {
  return navigator.clipboard.writeText(text);
}
