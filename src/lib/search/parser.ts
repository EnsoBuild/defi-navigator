import { FilterKey, type FilterOperator, type ParserCallbacks } from '../search/filters';
import { type Address, type TokenParams } from '../types/api'; 

// Constants
const INEQUALITY_SUPPORTED_KEYS = new Set([FilterKey.APY, FilterKey.TVL]);
const ARRAY_VALUE_KEYS = new Set([
  FilterKey.ADDRESS,
  FilterKey.UNDERLYING_TOKENS,
  FilterKey.UNDERLYING_TOKENS_EXACT
]);

/**
 * Check if a key supports inequality operators
 */
export function supportsInequality(key: FilterKey): boolean {
  return INEQUALITY_SUPPORTED_KEYS.has(key);
}

/**
 * Check if a key supports array values
 */
export function supportsArrayValues(key: FilterKey): boolean {
  return ARRAY_VALUE_KEYS.has(key);
}

/**
 * Check if a string is a valid filter key
 */
export function isValidFilterKey(key: string): boolean {
  return Object.values(FilterKey).includes(key as FilterKey);
}

/**
 * Check if a string is a prefix of a valid filter key
 */
export function isFilterKeyPrefix(partial: string): boolean {
  return Object.values(FilterKey).some(
    key => key.startsWith(partial) && key !== partial
  );
}

/**
 * Parse a filter token into key, operator, and value components
 */
export function parseFilterToken(token: string): { 
  key: string; 
  operator?: FilterOperator; 
  value?: string;
} {
  // Look for operators
  const colonIndex = token.indexOf(':');
  const greaterThanIndex = token.indexOf('>');
  const lessThanIndex = token.indexOf('<');
  
  // Find the first operator in the string
  const operatorIndices = [
    { index: colonIndex, op: ':' as FilterOperator },
    { index: greaterThanIndex, op: '>' as FilterOperator },
    { index: lessThanIndex, op: '<' as FilterOperator }
  ].filter(item => item.index !== -1);
  
  // Sort by index to find the first occurrence
  operatorIndices.sort((a, b) => a.index - b.index);
  
  if (operatorIndices.length === 0) {
    // No operator found, just a potential key
    return { key: token };
  }
  
  const { index, op } = operatorIndices[0];
  const key = token.slice(0, index);
  const value = token.slice(index + 1);
  
  return { key, operator: op, value: value.length > 0 ? value : undefined };
}

/**
 * Apply a filter expression to a TokenParams object
 */
export function applyFilterToParams(
  params: TokenParams,
  key: FilterKey,
  operator: FilterOperator,
  value: string
): TokenParams {
  switch (key) {
    case FilterKey.ADDRESS:
      if (operator === ':') {
        if (supportsArrayValues(key)) {
          if (params.address) {
            // If address is already an array, add to it
            if (Array.isArray(params.address)) {
              params.address = [...params.address, value as Address];
            } else {
              // Convert single address to array with new value
              params.address = [params.address, value as Address];
            }
          } else {
            // First address value
            params.address = value as Address;
          }
        }
      }
      break;
    case FilterKey.UNDERLYING_TOKENS:
      if (operator === ':') {
        if (params.underlyingTokens) {
          if (Array.isArray(params.underlyingTokens)) {
            params.underlyingTokens = [...params.underlyingTokens, value as Address];
          } else {
            params.underlyingTokens = [params.underlyingTokens, value as Address];
          }
        } else {
          params.underlyingTokens = value as Address;
        }
      }
      break;
    case FilterKey.UNDERLYING_TOKENS_EXACT:
      if (operator === ':') {
        if (params.underlyingTokensExact) {
          if (Array.isArray(params.underlyingTokensExact)) {
            params.underlyingTokensExact = [...params.underlyingTokensExact, value as Address];
          } else {
            params.underlyingTokensExact = [params.underlyingTokensExact, value as Address];
          }
        } else {
          params.underlyingTokensExact = value as Address;
        }
      }
      break;
    case FilterKey.APY:
      if (supportsInequality(key)) {
        const numValue = parseFloat(value);
        if (!isNaN(numValue)) {
          if (operator === ':') {
            params.apyFrom = numValue;
            params.apyTo = numValue;
          } else if (operator === '>') {
            params.apyFrom = numValue;
          } else if (operator === '<') {
            params.apyTo = numValue;
          }
        }
      }
      break;
    case FilterKey.TVL:
      if (supportsInequality(key)) {
        const numValue = parseFloat(value);
        if (!isNaN(numValue)) {
          if (operator === ':') {
            params.tvlFrom = numValue;
            params.tvlTo = numValue;
          } else if (operator === '>') {
            params.tvlFrom = numValue;
          } else if (operator === '<') {
            params.tvlTo = numValue;
          }
        }
      }
      break;
    case FilterKey.PROTOCOL:
      if (operator === ':') {
        params.protocolSlug = value;
      }
      break;
    case FilterKey.PROJECT:
      if (operator === ':') {
        params.project = value;
      }
      break;
    case FilterKey.TYPE:
      if (operator === ':' && (value === 'defi' || value === 'base')) {
        params.type = value;
      }
      break;
    case FilterKey.CHAIN_ID:
      if (operator === ':') {
        const chainId = parseInt(value, 10);
        if (!isNaN(chainId)) {
          params.chainId = chainId;
        }
      }
      break;
  }
  
  return params;
}

/**
 * Parse a filter query string and invoke appropriate callbacks
 */
export function parseFilterQuery(query: string, callbacks: ParserCallbacks = {}): TokenParams | null {
  if (!query || query.trim() === '') {
    return null;
  }
  
  const tokens = query.trim().split(/\s+/);

  let params: TokenParams = { chainId: 1 }; // Default chainId
  let validFilterFound = false;
  
  for (const token of tokens) {
    const { key, operator, value } = parseFilterToken(token);
    
    if (!key) continue;
    
    if (isValidFilterKey(key)) {
      const filterKey = key as FilterKey;
      
      if (operator && value) {
        // Complete filter expression
        if (
          (operator === ':') || 
          (supportsInequality(filterKey) && (operator === '>' || operator === '<'))
        ) {
          params = applyFilterToParams(params, filterKey, operator, value);
          validFilterFound = true;
        }
      } else if (operator && !value) {
        // Key and operator, but no value yet
        if (callbacks.filterSelected) {
          callbacks.filterSelected(key, operator);
        }
      } else {
        // Just a key, no operator or value
        if (callbacks.filterSelected) {
          callbacks.filterSelected(key, ':');
        }
      }
    } else if (isFilterKeyPrefix(key)) {
      // Partial key
      if (callbacks.filterSelecting) {
        callbacks.filterSelecting(key);
      }
    }
  }
  
  if (validFilterFound && callbacks.filter) {
    callbacks.filter(params);
  }
  
  return validFilterFound ? params : null;
}

/**
 * Deserialize TokenParams object into a filter query string
 */
export function deserializeTokenParams(params: TokenParams): string {
  if (!params) return '';
  
  const filters: string[] = [];
  
  // Handle address filter
  if (params.address) {
    if (Array.isArray(params.address)) {
      params.address.forEach(addr => {
        filters.push(`${FilterKey.ADDRESS}:${addr}`);
      });
    } else {
      filters.push(`${FilterKey.ADDRESS}:${params.address}`);
    }
  }
  
  // Handle underlying tokens
  if (params.underlyingTokens) {
    if (Array.isArray(params.underlyingTokens)) {
      params.underlyingTokens.forEach(token => {
        filters.push(`${FilterKey.UNDERLYING_TOKENS}:${token}`);
      });
    } else {
      filters.push(`${FilterKey.UNDERLYING_TOKENS}:${params.underlyingTokens}`);
    }
  }
  
  // Handle underlying tokens exact
  if (params.underlyingTokensExact) {
    if (Array.isArray(params.underlyingTokensExact)) {
      params.underlyingTokensExact.forEach(token => {
        filters.push(`${FilterKey.UNDERLYING_TOKENS_EXACT}:${token}`);
      });
    } else {
      filters.push(`${FilterKey.UNDERLYING_TOKENS_EXACT}:${params.underlyingTokensExact}`);
    }
  }
  
  // Handle APY range
  if (params.apyFrom !== undefined && params.apyTo !== undefined && params.apyFrom === params.apyTo) {
    filters.push(`${FilterKey.APY}:${params.apyFrom}`);
  } else {
    if (params.apyFrom !== undefined) {
      filters.push(`${FilterKey.APY}>${params.apyFrom}`);
    }
    if (params.apyTo !== undefined) {
      filters.push(`${FilterKey.APY}<${params.apyTo}`);
    }
  }
  
  // Handle TVL range
  if (params.tvlFrom !== undefined && params.tvlTo !== undefined && params.tvlFrom === params.tvlTo) {
    filters.push(`${FilterKey.TVL}:${params.tvlFrom}`);
  } else {
    if (params.tvlFrom !== undefined) {
      filters.push(`${FilterKey.TVL}>${params.tvlFrom}`);
    }
    if (params.tvlTo !== undefined) {
      filters.push(`${FilterKey.TVL}<${params.tvlTo}`);
    }
  }
  
  // Handle protocol slug
  if (params.protocolSlug) {
    filters.push(`${FilterKey.PROTOCOL}:${params.protocolSlug}`);
  }
  
  // Handle project
  if (params.project) {
    filters.push(`${FilterKey.PROJECT}:${params.project}`);
  }
  
  // Handle type
  if (params.type) {
    filters.push(`${FilterKey.TYPE}:${params.type}`);
  }
  
  // Handle chain ID (only if not the default value of 1)
  if (params.chainId !== undefined && params.chainId !== 1) {
    filters.push(`${FilterKey.CHAIN_ID}:${params.chainId}`);
  }
  
  return filters.join(' ');
}