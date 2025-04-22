// createShareableUrl.ts
import type { TokenParams, MultiAddress } from '../types/api';

/**
 * Creates a shareable URL that encodes TokenParams as query parameters
 * @param params TokenParams object to be encoded in URL
 * @param baseUrl Base URL to which parameters will be appended
 * @returns Shareable URL string
 */
export function createShareableUrl(params: TokenParams, baseUrl = window.location.origin): string {
  const searchParams = new URLSearchParams();
  
  // Process each property in TokenParams
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined) {
      // Handle array types (MultiAddress)
      if (Array.isArray(value)) {
        value.forEach(item => {
          searchParams.append(`${key}[]`, item.toString());
        });
      } 
      // Handle boolean
      else if (typeof value === 'boolean') {
        searchParams.append(key, value ? 'true' : 'false');
      }
      // Handle numbers and strings
      else {
        searchParams.append(key, value.toString());
      }
    }
  });
  
  const queryString = searchParams.toString();
  return queryString ? `${baseUrl}?${queryString}` : baseUrl;
}

/**
 * Parses a URL to extract TokenParams
 * @param url URL string to parse
 * @returns TokenParams object
 */
export function parseShareableUrl(url: string): TokenParams {
  const params: TokenParams = {};
  const parsedUrl = new URL(url);
  const searchParams = parsedUrl.searchParams;
  console.log('Parsed URL:', parsedUrl);

  // Handle array parameters
  const addressValues = searchParams.getAll('address[]');
  if (addressValues.length) params.address = addressValues as MultiAddress;
  
  const underlyingTokensValues = searchParams.getAll('underlyingTokens[]');
  if (underlyingTokensValues.length) params.underlyingTokens = underlyingTokensValues as MultiAddress;
  
  const underlyingTokensExactValues = searchParams.getAll('underlyingTokensExact[]');
  if (underlyingTokensExactValues.length) params.underlyingTokensExact = underlyingTokensExactValues as MultiAddress;
  
  // Handle primitive types
  if (searchParams.has('apyFrom')) params.apyFrom = Number(searchParams.get('apyFrom'));
  if (searchParams.has('apyTo')) params.apyTo = Number(searchParams.get('apyTo'));
  if (searchParams.has('tvlFrom')) params.tvlFrom = Number(searchParams.get('tvlFrom'));
  if (searchParams.has('tvlTo')) params.tvlTo = Number(searchParams.get('tvlTo'));
  if (searchParams.has('protocolSlug')) params.protocolSlug = searchParams.get('protocolSlug')!;
  if (searchParams.has('protocol')) params.protocolSlug = searchParams.get('protocol')!;
  
  if (searchParams.has('project')) params.project = searchParams.get('project')!;
  if (searchParams.has('type')) params.type = searchParams.get('type') as "defi" | "base";
  if (searchParams.has('includeMetadata')) params.includeMetadata = searchParams.get('includeMetadata') === 'true';
  if (searchParams.has('chainId')) params.chainId = Number(searchParams.get('chainId'));
  
  return params;
}

export async function copyShareableUrlToClipboard(
    url: string, 
    showNotification?: (message: string, type: 'success' | 'error') => void
  ): Promise<boolean> {
    try {
      await navigator.clipboard.writeText(url);
      
      if (showNotification) {
        showNotification('URL copied to clipboard!', 'success');
      }
      
      return true;
    } catch (error) {
      console.error('Failed to copy URL to clipboard:', error);
      
      if (showNotification) {
        showNotification('Failed to copy URL to clipboard', 'error');
      }
      
      return false;
    }
  }