/**
 * Core type definitions for the application
 */

import type { TokenParams } from "@ensofinance/sdk";


// Filter and Search related types
export enum FilterKey {
  ADDRESS = 'address',
  UNDERLYING_TOKENS = 'underlying',
  UNDERLYING_TOKENS_EXACT = 'underlyingExact',
  APY_FROM = 'apyFrom',
  APY_TO = 'apyTo',
  TVL_FROM = 'tvlFrom',
  TVL_TO = 'tvlTo',
  PROTOCOL = 'protocolSlug',
  PROJECT = 'project',
  TYPE = 'type',
  CHAIN_ID = 'chainId',
  CHAIN = 'chainId',
  PRIMARY_ADDRESS = 'primaryAddress'
}

export type FilterValue = string | { from: number; to: number }

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
