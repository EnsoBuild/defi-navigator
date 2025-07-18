/**
 * Core type definitions for the application
 */

import type { TokenParams, Address } from '@ensofinance/sdk';

// Filter and Search related types
export enum FilterKey {
  ADDRESS = 'address',
  UNDERLYING_TOKENS = 'underlyingTokens',
  UNDERLYING_TOKENS_EXACT = 'underlyingTokensExact',
  APY_FROM = 'apyFrom',
  APY_TO = 'apyTo',
  TVL_FROM = 'tvlFrom',
  TVL_TO = 'tvlTo',
  APY = 'apy',
  TVL = 'tvl',
  PROTOCOL_SLUG = 'protocolSlug',
  PROJECT = 'project',
  TYPE = 'type',
  CHAIN_ID = 'chainId',
  PRIMARY_ADDRESS = 'primaryAddress',
  PROJECT_CHAIN_ID = 'projectChainId',
  TOKEN_SYMBOL = 'symbol',
  TOKEN_NAME = 'name'
}

export type FilterValue = Address | string | { from: number; to: number };

export type FilterOperator = ':' | '>' | '<';

export interface FilterExpression {
  key: FilterKey;
  operator: FilterOperator;
  value: string;
}

export interface ParserCallbacks {
  filterSelecting?: (partialKey: string) => void;
  filterSelected?: (key: string, operator: FilterOperator) => void;
  filter?: (params: TokenParams) => void;
}

export interface Suggestion {
  value: string;
  displayText: string;
  description?: string;
  logo?: string;
  metadata?: any;
}

export type FilterItem = {
  key: string;
  value: FilterValue;
};

export type { TokenParams, Address };

export type { TokenData, Network, Project, ProtocolData as Protocol } from '@ensofinance/sdk';

// Project-specific types
export interface ProjectData {
  id: string;
  name: string;
  protocols: Protocol[];
  chains: Network[];
  logo?: string;
}
