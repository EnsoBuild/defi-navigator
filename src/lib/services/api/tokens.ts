import type { Network, Project, Protocol, TokenData, TokenParams } from '$lib/types';
import { EnsoClient } from '@ensofinance/sdk';

const API_BASE_URL: string = 'https://api.enso.finance/api/v1';
const AUTH_TOKEN: string = '56b3d1f4-5c59-4fc1-8998-16d001e277bc';

const ensoClient = new EnsoClient({ baseURL: API_BASE_URL, apiKey: AUTH_TOKEN });

/**
 * Fetches token data from the Enso API
 * @param params TokenParams filters
 * @returns Promise with token data
 */
export async function getTokenData(params: TokenParams): Promise<TokenData[]> {
  return (await ensoClient.getTokenData(params)).data;
}

/**
 * Fetches protocols that can be used for filtering
 * @param chainId Optional chain ID to filter protocols
 * @returns Array of protocol data
 */
export async function getProtocols(chainId?: number): Promise<Protocol[]> {
  return (await ensoClient.getProtocolData({ chainId: chainId || 1 }));
}

/**
 * Fetches projects that can be used for filtering
 * @returns Array of project data
 */
export async function getProjects(): Promise<Project[]> {
  return await ensoClient.getProjects();
}

/**
 * Fetches available networks from the Enso API
 * @returns Array of network data
 */
export async function getNetworks(): Promise<Network[]> {
  return await ensoClient.getNetworks();
}

/**
 * Fetches all reference data in parallel
 * @returns Object containing networks, protocols, and projects
 */
export async function fetchReferenceData(): Promise<{
  networks: Network[];
  protocols: Protocol[];
  projects: Project[];
}> {
  try {
    const [networks, protocols, projects] = await Promise.all([
      getNetworks(),
      getProtocols(),
      getProjects()
    ]);

    return { networks, protocols, projects };
  } catch (error) {
    console.error('Error fetching reference data:', error);
    throw error;
  }
}
