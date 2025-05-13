import type { Network, Project, Protocol, TokenData, TokenParams, ProjectData } from '$lib/types';
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
  return await ensoClient.getProtocolData({ chainId });
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

/**
 * Fetches projects with enriched data
 * @returns Array of project data with protocols and chains
 */
export async function getProjectsData(): Promise<ProjectData[]> {
  try {
    const [projects, protocols, networks] = await Promise.all([
      getProjects(),
      getProtocols(),
      getNetworks()
    ]);

    // Create a map of protocol slug to protocol data
    const protocolMap = new Map<string, Protocol>();
    protocols.forEach(protocol => {
      protocolMap.set(protocol.slug, protocol);
    });

    // Build enriched project data
    const projectsData: ProjectData[] = projects.map(project => {
      // Get protocols for this project
      const projectProtocols = project.protocols
        .map(slug => protocolMap.get(slug))
        .filter((protocol): protocol is Protocol => protocol !== undefined);

      // Get unique chain IDs from all protocols
      const chainIds = new Set<number>();
      projectProtocols.forEach(protocol => {
        if (protocol.chains) {
          protocol.chains.forEach(chain => chainIds.add(chain.id));
        }
      });

      // Map chain IDs to network objects
      const projectChains = Array.from(chainIds)
        .map(id => networks.find(network => network.id === id))
        .filter((network): network is Network => network !== undefined);

      // Get logo from first protocol if available
      const logo = projectProtocols[0]?.logosUri?.[0];

      return {
        id: project.id,
        name: project.id, // Use project ID as the name (e.g., "aave")
        protocols: projectProtocols,
        chains: projectChains,
        logo
      };
    });

    // Sort alphabetically by name
    return projectsData.sort((a, b) => a.name.localeCompare(b.name));
  } catch (error) {
    console.error('Error fetching projects data:', error);
    throw error;
  }
}