import {
  FilterKey,
  type FilterOperator,
  type FilterValue,
  type FilterItem,
  type Suggestion
} from '$lib/types';
import type { TokenParams, Network, Protocol, Project, Address } from '$lib/types';
import { searchService } from '../searchService';

/**
 * Unified FilterService that combines filterEngine and filterSuggestionService
 * Handles all filter-related functionality in one place.
 */
export class FilterService {
  // Data sources for suggestions
  private networks: Network[] = [];
  private protocols: Protocol[] = [];
  private projects: Project[] = [];

  // Constants for filter operations
  private RANGE_FILTER_KEYS = new Set([FilterKey.APY, FilterKey.TVL]);

  private ARRAY_FILTER_KEYS = new Set([
    FilterKey.ADDRESS,
    FilterKey.UNDERLYING_TOKENS,
    FilterKey.UNDERLYING_TOKENS_EXACT,
    FilterKey.PRIMARY_ADDRESS,
    FilterKey.TOKEN_NAME,
    FilterKey.TOKEN_SYMBOL
  ]);

  // Filter descriptions for UI
  private filterDescriptions: Record<string, string> = {
    [FilterKey.ADDRESS]: 'Position address',
    [FilterKey.TOKEN_SYMBOL]: 'Position Symbol',
    [FilterKey.TOKEN_NAME]: 'Position Name',
    [FilterKey.UNDERLYING_TOKENS]: 'Underlying token address',
    [FilterKey.UNDERLYING_TOKENS_EXACT]: 'Exact underlying token address',
    [FilterKey.APY_FROM]: 'Minimum annual percentage yield',
    [FilterKey.APY_TO]: 'Maximum annual percentage yield',
    [FilterKey.TVL_FROM]: 'Minimum total value locked',
    [FilterKey.TVL_TO]: 'Maximum total value locked',
    [FilterKey.PROTOCOL_SLUG]: 'Protocol slug',
    [FilterKey.PROJECT]: 'Project name',
    [FilterKey.TYPE]: 'Token type (defi or base)',
    [FilterKey.CHAIN_ID]: 'Blockchain network ID',
    [FilterKey.PRIMARY_ADDRESS]: 'Primary contract address'
  };

  // Update data sources for suggestions
  updateDataSources(networks?: Network[], protocols?: Protocol[], projects?: Project[]) {
    if (networks) {
      this.networks = networks;
      searchService.initializeNetworkSearch(networks);
    }
    if (protocols) {
      this.protocols = protocols;
      searchService.initializeProtocolSearch(protocols);
    }
    if (projects) {
      this.projects = projects;
      searchService.initializeProjectSearch(projects);
    }
  }

  // Parse a query string into TokenParams
  parseQueryString(query: string): TokenParams {
    if (!query || query.trim() === '') {
      return {};
    }

    const tokens = query.trim().split(/\s+/);
    let params: TokenParams = {};

    for (const token of tokens) {
      const { key, operator, value } = this.parseFilterToken(token);

      if (!key || !operator || !value) continue;

      if (this.isValidFilterKey(key)) {
        this.applyFilterToParams(params, key as FilterKey, operator, value);
      }
    }

    return params;
  }

  // Generate a query string from TokenParams
  generateQueryString(params: TokenParams): string {
    if (!params) return '';

    const queryParts: string[] = [];

    // Process all parameters
    Object.entries(params).forEach(([key, value]) => {
      if (value === undefined) return;

      // Handle array values
      if (Array.isArray(value)) {
        value.forEach((item) => {
          queryParts.push(`${key}:${item}`);
        });
        return;
      }

      // Handle range values (APY, TVL)
      if (key === FilterKey.APY_FROM) {
        queryParts.push(`apy>${value}`);
      } else if (key === FilterKey.APY_TO) {
        queryParts.push(`apy<${value}`);
      } else if (key === FilterKey.TVL_FROM) {
        queryParts.push(`tvl>${value}`);
      } else if (key === FilterKey.TVL_TO) {
        queryParts.push(`tvl<${value}`);
      } else {
        // Regular values
        queryParts.push(`${key}:${value}`);
      }
    });

    return queryParts.join(' ');
  }

  // Convert TokenParams to an array of filter items for UI display
  convertParamsToFilterItems(params: TokenParams): FilterItem[] {
    if (!params) return [];

    const items: FilterItem[] = [];

    Object.entries(params).forEach(([key, value]) => {
      // Handle array values
      if (Array.isArray(value)) {
        value.forEach((v) => {
          items.push({ key, value: v });
        });
      } else {
        items.push({ key, value });
      }
    });

    return items;
  }

  // Parse a filter token into key, operator, and value components
  parseFilterToken(token: string): {
    key: string;
    operator?: FilterOperator;
    value?: string;
  } {
    // Look for operators
    const colonIndex = token.indexOf(':');
    const greaterThanIndex = token.indexOf('>');
    const lessThanIndex = token.indexOf('<');

    // Find the first operator
    const operatorIndices = [
      { index: colonIndex, op: ':' as FilterOperator },
      { index: greaterThanIndex, op: '>' as FilterOperator },
      { index: lessThanIndex, op: '<' as FilterOperator }
    ].filter((item) => item.index !== -1);

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

  // Apply a filter to TokenParams object
  applyFilterToParams(
    params: TokenParams,
    key: FilterKey,
    operator: FilterOperator,
    value: string
  ): TokenParams {
    // Handle address and array-type fields
    if (this.ARRAY_FILTER_KEYS.has(key)) {
      if (operator === ':') {
        if (params[key]) {
          if (Array.isArray(params[key])) {
            (params[key] as Array<any>).push(value as Address);
          } else {
            params[key] = [params[key], value as Address];
          }
        } else {
          params[key] = value as Address;
        }
      }
    }
    // Handle APY range
    else if (key === FilterKey.APY_FROM || key === FilterKey.APY_TO || key === 'apy') {
      const numValue = parseFloat(value);
      if (!isNaN(numValue)) {
        if (key === 'apy') {
          if (operator === ':') {
            params.apyFrom = numValue;
            params.apyTo = numValue;
          } else if (operator === '>') {
            params.apyFrom = numValue;
          } else if (operator === '<') {
            params.apyTo = numValue;
          }
        } else {
          params[key] = numValue;
        }
      }
    }
    // Handle TVL range
    else if (key === FilterKey.TVL_FROM || key === FilterKey.TVL_TO || key === 'tvl') {
      const numValue = parseFloat(value);
      if (!isNaN(numValue)) {
        if (key === 'tvl') {
          if (operator === ':') {
            params.tvlFrom = numValue;
            params.tvlTo = numValue;
          } else if (operator === '>') {
            params.tvlFrom = numValue;
          } else if (operator === '<') {
            params.tvlTo = numValue;
          }
        } else {
          params[key] = numValue;
        }
      }
    }
    // Handle other regular fields
    else if (operator === ':') {
      if (key === FilterKey.TYPE && (value === 'defi' || value === 'base')) {
        params.type = value;
      } else if (key === FilterKey.CHAIN_ID) {
        const chainId = parseInt(value, 10);
        if (!isNaN(chainId)) {
          params.chainId = chainId;
        }
      } else {
        params[key] = value;
      }
    }

    return params;
  }

  // Add a filter to TokenParams
  addFilter(params: TokenParams, key: FilterKey, value: FilterValue): TokenParams {
    const newParams = { ...params };

    // Handle array-type fields
    if (this.ARRAY_FILTER_KEYS.has(key)) {
      if (newParams[key]) {
        if (Array.isArray(newParams[key])) {
          (newParams[key] as any).push(value);
        } else {
          newParams[key] = [newParams[key], value];
        }
      } else {
        newParams[key] = value;
      }
    }
    // Handle range values (APY, TVL)
    else if (this.RANGE_FILTER_KEYS.has(key)) {
      const range = value as { from: number; to: number };
      if (key === FilterKey.APY) {
        newParams[FilterKey.APY_FROM] = Number(range.from);
        newParams[FilterKey.APY_TO] = Number(range.to);
      } else if (key === FilterKey.TVL_FROM || key === FilterKey.TVL_TO) {
        newParams[FilterKey.TVL_FROM] = Number(range.from);
        newParams[FilterKey.TVL_TO] = Number(range.to);
      }
    }
    // Handle simple values
    else {
      newParams[key] = value;
    }

    return newParams;
  }

  // Remove a filter from TokenParams
  removeFilter(params: TokenParams, key: FilterKey, value?: FilterValue): TokenParams {
    const newParams = { ...params };

    // If value is provided and the key holds an array, remove just that value
    if (value !== undefined && Array.isArray(newParams[key])) {
      newParams[key] = (newParams[key] as any[]).filter((v) => v !== value);
      if ((newParams[key] as any[]).length === 0) {
        delete newParams[key];
      }
    } else {
      // Otherwise remove the entire key
      delete newParams[key];
    }

    return newParams;
  }

  // Check if a string is a valid filter key
  isValidFilterKey(key: string): boolean {
    return Object.values(FilterKey).includes(key as FilterKey) || key === 'apy' || key === 'tvl';
  }

  // Check if a key supports inequality operators
  supportsInequality(key: FilterKey): boolean {
    return this.RANGE_FILTER_KEYS.has(key) || key === 'apy' || key === 'tvl';
  }

  // Check if a key supports array values
  supportsArrayValues(key: FilterKey): boolean {
    return this.ARRAY_FILTER_KEYS.has(key);
  }

  // Get filter key description
  getFilterKeyDescription(key: string): string {
    return this.filterDescriptions[key] || key;
  }

  // Get suggestions for a specific filter key - updated to use Fuse
  getSuggestionsForKey(key: FilterKey, searchValue: string = ''): Suggestion[] {
    switch (key) {
      case FilterKey.PROTOCOL_SLUG:
        const protocols = searchService.searchProtocols(searchValue);
        return protocols.map((protocol) => ({
          value: protocol.slug,
          displayText: protocol.name || protocol.slug,
          description: protocol.description || '',
          logo: protocol.logosUri && protocol.logosUri[0],
          metadata: protocol
        }));

      case FilterKey.PROJECT:
        const projects = searchService.searchProjects(searchValue);
        return projects.map((project) => {
          const relatedProtocol = this.protocols.find((p) => p.slug === project.id);
          return {
            value: project.id,
            displayText: relatedProtocol?.name || project.id,
            description: relatedProtocol?.description || '',
            logo: relatedProtocol?.logosUri && relatedProtocol.logosUri[0],
            metadata: { project, protocol: relatedProtocol }
          };
        });

      case FilterKey.CHAIN_ID:
        const networks = searchService.searchNetworks(searchValue);
        return networks.map((network) => ({
          value: network.id.toString(),
          displayText: `${network.name} (${network.id})`,
          description: '',
          metadata: network
        }));

      case FilterKey.TYPE:
        return [
          {
            value: 'defi',
            displayText: 'DeFi Token',
            description: 'Tokens from decentralized finance protocols'
          },
          { value: 'base', displayText: 'Base Token', description: 'Basic underlying tokens' }
        ].filter(
          (item) =>
            item.value.includes(searchValue.toLowerCase()) ||
            item.displayText.toLowerCase().includes(searchValue.toLowerCase())
        );

      default:
        return [];
    }
  }

  // Get all available filter keys as suggestions
  getFilterKeySuggestions(searchValue: string = ''): Suggestion[] {
    const searchLower = searchValue.toLowerCase();

    return Object.values(FilterKey)
      .filter(
        (key) =>
          key.toLowerCase().includes(searchLower) ||
          this.filterDescriptions[key]?.toLowerCase().includes(searchLower)
      )
      .map((key) => ({
        value: key,
        displayText: key,
        description: this.filterDescriptions[key] || '',
        metadata: { isFilterKey: true }
      }));
  }

  // Check if a key supports range values
  supportsRangeValues(key: FilterKey): boolean {
    return this.RANGE_FILTER_KEYS.has(key);
  }

  // Get example values for a filter key (for help/documentation)
  getExampleForKey(key: FilterKey): string {
    switch (key) {
      case FilterKey.ADDRESS:
      case FilterKey.UNDERLYING_TOKENS:
      case FilterKey.UNDERLYING_TOKENS_EXACT:
      case FilterKey.PRIMARY_ADDRESS:
        return '0x1234...5678';
      case FilterKey.APY_FROM:
      case FilterKey.APY_TO:
        return '5.5';
      case FilterKey.TVL_FROM:
      case FilterKey.TVL_TO:
        return '1000000';
      case FilterKey.PROTOCOL_SLUG:
        return 'aave';
      case FilterKey.PROJECT:
        return 'compound';
      case FilterKey.TYPE:
        return 'defi';
      case FilterKey.CHAIN_ID:
        return '1';
      default:
        return '';
    }
  }
}

// Export singleton instance
export const filterService = new FilterService();
