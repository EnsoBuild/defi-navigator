import type { Address, TokenParams } from '$lib/types/api';
import { FilterKey } from './filters';

/**
 * Format a value for inclusion in a query string
 */
function formatFilterValue(key: FilterKey, value: any): string {
  if (typeof value === 'undefined' || value === null) {
    return '';
  }

  if (Array.isArray(value)) {
    // For array values, we'll generate multiple filter expressions
    return '';
  }

  switch (key) {
    case FilterKey.APY:
    case FilterKey.TVL:
    case FilterKey.CHAIN_ID:
      return value.toString();
    default:
      return value.toString();
  }
}

/**
 * Handle array values when generating a query
 */
function formatArrayValues(key: FilterKey, values: Address[]): string {
  return values.map((value) => `${key}:${value}`).join(' ');
}

/**
 * Format range values (for APY, TVL) when generating a query
 */
function formatRangeValues(key: FilterKey, params: TokenParams): string {
  const filters = [];

  if (key === FilterKey.APY) {
    if (params.apyFrom !== undefined) {
      filters.push(`${key}>${params.apyFrom}`);
    }
    if (params.apyTo !== undefined) {
      filters.push(`${key}<${params.apyTo}`);
    }
  } else if (key === FilterKey.TVL) {
    if (params.tvlFrom !== undefined) {
      filters.push(`${key}>${params.tvlFrom}`);
    }
    if (params.tvlTo !== undefined) {
      filters.push(`${key}<${params.tvlTo}`);
    }
  }

  return filters.join(' ');
}

/**
 * Convert TokenParams to a filter query string
 */
export function generateQueryFromParams(params: TokenParams): string {
  if (!params) return '';

  const queryParts: string[] = [];

  // Handle address
  if (params.address) {
    if (Array.isArray(params.address)) {
      queryParts.push(formatArrayValues(FilterKey.ADDRESS, params.address));
    } else {
      queryParts.push(`${FilterKey.ADDRESS}:${params.address}`);
    }
  }

  // Handle underlyingTokens
  if (params.underlyingTokens) {
    if (Array.isArray(params.underlyingTokens)) {
      queryParts.push(formatArrayValues(FilterKey.UNDERLYING_TOKENS, params.underlyingTokens));
    } else {
      queryParts.push(`${FilterKey.UNDERLYING_TOKENS}:${params.underlyingTokens}`);
    }
  }

  // Handle underlyingTokensExact
  if (params.underlyingTokensExact) {
    if (Array.isArray(params.underlyingTokensExact)) {
      queryParts.push(
        formatArrayValues(FilterKey.UNDERLYING_TOKENS_EXACT, params.underlyingTokensExact)
      );
    } else {
      queryParts.push(`${FilterKey.UNDERLYING_TOKENS_EXACT}:${params.underlyingTokensExact}`);
    }
  }

    // Handle underlyingTokensExact
    if (params.primaryAddress) {
      if (Array.isArray(params.primaryAddress)) {
        queryParts.push(
          formatArrayValues(FilterKey.PRIMARY_ADDRESS, params.primaryAddress)
        );
      } else {
        queryParts.push(`${FilterKey.PRIMARY_ADDRESS}:${params.primaryAddress}`);
      }
    }

  // Handle APY range
  const apyQuery = formatRangeValues(FilterKey.APY, params);
  if (apyQuery) {
    queryParts.push(apyQuery);
  }

  // Handle TVL range
  const tvlQuery = formatRangeValues(FilterKey.TVL, params);
  if (tvlQuery) {
    queryParts.push(tvlQuery);
  }

  // Handle protocolSlug
  if (params.protocolSlug) {
    queryParts.push(`${FilterKey.PROTOCOL}:${params.protocolSlug}`);
  }

  // Handle project
  if (params.project) {
    queryParts.push(`${FilterKey.PROJECT}:${params.project}`);
  }

  // Handle type
  if (params.type) {
    queryParts.push(`${FilterKey.TYPE}:${params.type}`);
  }

  // Handle chainId
  if (params.chainId) {
    queryParts.push(`${FilterKey.CHAIN_ID}:${params.chainId}`);
  }

  return queryParts.join(' ');
}
