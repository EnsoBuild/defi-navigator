import { type TokenParams } from '../types/api'; // Adjust import path as needed

export enum FilterKey {
  ADDRESS = 'address',
  UNDERLYING_TOKENS = 'underlying',
  UNDERLYING_TOKENS_EXACT = 'underlyingExact',
  APY = 'apy',
  TVL = 'tvl',
  PROTOCOL='protocol',
  PROJECT = 'project',
  TYPE = 'type',
  CHAIN_ID = 'chain',
  PRIMARY_ADDRESS = "PRIMARY_ADDRESS"
}

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