// Define types for API data structures
export interface Network {
    id: number | null;
    name: string;
    isConnected?: boolean;
  }
  
  export interface Protocol {
    slug: string;
    name?: string;
    description?: string;
    url?: string;
    logosUri?: string[];
    chains?: Network[];
    project?: string;
  }
  
  export interface UnderlyingToken {
    address: string;
    chainId: number;
    type: string;
    decimals: number;
    symbol?: string;
    name?: string;
    logosUri?: string[];
  }
  
  export interface Token {
    address: string;
    chainId: number;
    type: string;
    decimals: number;
    symbol?: string;
    name?: string;
    logosUri?: string[];
    underlyingTokens?: UnderlyingToken[];
    project?: string;
    protocolSlug?: string;
    apy?: number | null;
    apyBase?: number | null;
    apyReward?: number | null;
    tvl?: number | null;
    primaryAddress?: string;
  }
  
  export interface PaginationMeta {
    total: number;
    lastPage: number;
    currentPage: number;
    perPage: number;
    prev: number | null;
    next: number | null;
    cursor: number | null;
  }
  
  export interface TokensResponse {
    data: Token[];
    meta: PaginationMeta;
  }