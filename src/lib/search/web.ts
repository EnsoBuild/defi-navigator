import { FilterKey } from '../search/filters';
import { type Address, type TokenParams } from '../types/api';

export type FilterValue = string | { from: number; to: number };

/**
 * Interface representing a filter with its key and value
 */
export interface Filter {
  key: FilterKey;
  value: FilterValue;
}

/**
 * Unpack TokenParams object into an array of Filter objects
 * Based on the /tokens endpoint from the API
 */
export function unpackTokenParams(params: TokenParams): Filter[] {
  if (!params) return [];
  
  const filters: Filter[] = [];
  
  // Handle address filter (array values)
  if (params.address) {
    if (Array.isArray(params.address)) {
      params.address.forEach(addr => {
        filters.push({ key: FilterKey.ADDRESS, value: addr });
      });
    } else {
      filters.push({ key: FilterKey.ADDRESS, value: params.address });
    }
  }
  
  // Handle underlying tokens (array values)
  if (params.underlyingTokens) {
    if (Array.isArray(params.underlyingTokens)) {
      params.underlyingTokens.forEach(token => {
        filters.push({ key: FilterKey.UNDERLYING_TOKENS, value: token });
      });
    } else {
      filters.push({ key: FilterKey.UNDERLYING_TOKENS, value: params.underlyingTokens });
    }
  }
  
  // Handle underlying tokens exact (array values)
  if (params.underlyingTokensExact) {
    if (Array.isArray(params.underlyingTokensExact)) {
      params.underlyingTokensExact.forEach(token => {
        filters.push({ key: FilterKey.UNDERLYING_TOKENS_EXACT, value: token });
      });
    } else {
      filters.push({ key: FilterKey.UNDERLYING_TOKENS_EXACT, value: params.underlyingTokensExact });
    }
  }

    // Handle underlying tokens exact (array values)
    if (params.primaryAddress) {
      if (Array.isArray(params.primaryAddress)) {
        params.primaryAddress.forEach(token => {
          filters.push({ key: FilterKey.PRIMARY_ADDRESS, value: token });
        });
      } else {
        filters.push({ key: FilterKey.PRIMARY_ADDRESS, value: params.primaryAddress });
      }
    }
  
  // Handle primary address (array values according to API)
  if (params.primaryAddress) {
    if (Array.isArray(params.primaryAddress)) {
      params.primaryAddress.forEach(addr => {
        filters.push({ key: FilterKey.PRIMARY_ADDRESS, value: addr });
      });
    } else {
      filters.push({ key: FilterKey.PRIMARY_ADDRESS, value: params.primaryAddress });
    }
  }
  
  // Handle APY range
  if (params.apyFrom !== undefined || params.apyTo !== undefined) {
    filters.push({
      key: FilterKey.APY,
      value: {
        from: params.apyFrom ?? Number.NEGATIVE_INFINITY,
        to: params.apyTo ?? Number.POSITIVE_INFINITY
      }
    });
  }
  
  // Handle TVL range
  if (params.tvlFrom !== undefined || params.tvlTo !== undefined) {
    filters.push({
      key: FilterKey.TVL,
      value: {
        from: params.tvlFrom ?? Number.NEGATIVE_INFINITY,
        to: params.tvlTo ?? Number.POSITIVE_INFINITY
      }
    });
  }
  
  // Handle protocol slug
  if (params.protocolSlug) {
    filters.push({ key: FilterKey.PROTOCOL, value: params.protocolSlug });
  }
  
  // Handle project
  if (params.project) {
    filters.push({ key: FilterKey.PROJECT, value: params.project });
  }
  
  // Handle type (only 'defi' or 'base' according to API)
  if (params.type) {
    filters.push({ key: FilterKey.TYPE, value: params.type });
  }
  
  // Handle chain ID
  if (params.chainId !== undefined) {
    filters.push({ key: FilterKey.CHAIN_ID, value: params.chainId.toString() });
  }
  
  // Handle pagination parameters
  if (params.page !== undefined) {
    filters.push({ key: FilterKey.PAGE, value: params.page.toString() });
  }
  
  if (params.cursor !== undefined) {
    filters.push({ key: FilterKey.CURSOR, value: params.cursor.toString() });
  }
  
  // Handle includeMetadata parameter
  if (params.includeMetadata !== undefined) {
    filters.push({ key: FilterKey.INCLUDE_METADATA, value: params.includeMetadata.toString() });
  }
  
  return filters;
}