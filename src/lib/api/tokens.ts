import type { Network, ProjectData, Protocol, Token, TokenParams } from '$lib/types/api';

const API_BASE_URL: string = 'https://api.enso.finance/api/v1';
const AUTH_TOKEN: string = '56b3d1f4-5c59-4fc1-8998-16d001e277bc';

/**
 * Fetches token data from the Enso API
 * @param params TokenParams filters
 * @returns Promise with token data
 */
export async function getTokenData(params: TokenParams): Promise<Token[]> {
  console.debug("API", params)
  try {
    // Build query parameters
    const queryParams = new URLSearchParams();
    
    // Add chainId
    if (params.chainId) {
      queryParams.set('chainId', params.chainId.toString());
    }
    
    // Add token addresses
    if (params.address) {
      const addresses = Array.isArray(params.address) ? params.address : [params.address];
      addresses.forEach(address => {
        queryParams.append('address', address);
      });
    }
    
    // Add underlying tokens
    if (params.underlyingTokens) {
      const tokens = Array.isArray(params.underlyingTokens) ? params.underlyingTokens : [params.underlyingTokens];
      tokens.forEach(token => {
        queryParams.append('underlyingTokens', token);
      });
    }
    
    // Add exact underlying tokens
    if (params.underlyingTokensExact) {
      const tokens = Array.isArray(params.underlyingTokensExact) ? params.underlyingTokensExact : [params.underlyingTokensExact];
      tokens.forEach(token => {
        queryParams.append('underlyingTokensExact', token);
      });
    }
    
    // Add APY range
    if (params.apyFrom !== undefined) {
      queryParams.set('apyFrom', params.apyFrom.toString());
    }
    
    if (params.apyTo !== undefined) {
      queryParams.set('apyTo', params.apyTo.toString());
    }
    
    // Add TVL range
    if (params.tvlFrom !== undefined) {
      queryParams.set('tvlFrom', params.tvlFrom.toString());
    }
    
    if (params.tvlTo !== undefined) {
      queryParams.set('tvlTo', params.tvlTo.toString());
    }
    
    // Add protocol slug
    if (params.protocolSlug) {
      queryParams.set('protocolSlug', params.protocolSlug);
    }
    
    // Add project
    if (params.project) {
      queryParams.set('project', params.project);
    }
    
    // Add token type
    if (params.type) {
      queryParams.set('type', params.type);
    }
    
    // Add includeMetadata
    if (params.includeMetadata !== undefined) {
      queryParams.set('includeMetadata', params.includeMetadata.toString());
    } else {
      // Default to true to get full token data
      queryParams.set('includeMetadata', 'true');
    }
    
    // Add pagination parameters
    queryParams.set('page', '1');
    console.debug('Tokens API request:', queryParams.toString());
    // Make the API request
    const response = await fetch(`${API_BASE_URL}/tokens?${queryParams.toString()}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${AUTH_TOKEN}`,
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    
    // Return the token data from the pagination structure
    return data.data as Token[];
  } catch (error) {
    console.error('Error fetching token data:', error);
    throw error;
  }
}

/**
 * Fetches protocols that can be used for filtering
 * @param chainId Optional chain ID to filter protocols
 * @returns Array of protocol data
 */
export async function getProtocols(chainId?: number): Promise<Protocol[]> {
  try {
    const queryParams = new URLSearchParams();
    
    if (chainId) {
      queryParams.set('chainId', chainId.toString());
    }
    
    const response = await fetch(`${API_BASE_URL}/protocols?${queryParams.toString()}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${AUTH_TOKEN}`,
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching protocols:', error);
    throw error;
  }
}

/**
 * Fetches projects that can be used for filtering
 * @returns Array of project data
 */
export async function getProjects(): Promise<ProjectData[]> {
  try {
    const queryParams = new URLSearchParams();
  
    
    const response = await fetch(`${API_BASE_URL}/projects?${queryParams.toString()}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${AUTH_TOKEN}`,
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching protocols:', error);
    throw error;
  }
}

/**
 * Fetches available networks from the Enso API
 * @returns Array of network data
 */
export async function getNetworks(): Promise<Network[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/networks`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${AUTH_TOKEN}`,
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching networks:', error);
    throw error;
  }
}

/**
 * Converts a TokenParams object with inequality operators to API-compatible parameters
 * @param params Original TokenParams potentially with from/to ranges
 * @returns TokenParams compatible with the API
 */
export function convertFilterParamsToApiParams(params: TokenParams): TokenParams {
  const apiParams: TokenParams = { ...params };

  return apiParams;
}