/**
 * AEM GraphQL client and data-fetching functions
 * Handles all communication with the AEM Content Fragments API
 */

import { GraphQLClient } from 'graphql-request';
import {
  Legend,
  Trophy,
  PageConfig,
  LegendsListResponse,
  SingleLegendResponse,
  TrophiesListResponse,
  PageConfigResponse,
} from '@/types';
import {
  GET_ALL_LEGENDS,
  GET_LEGEND_BY_PATH,
  GET_ALL_TROPHIES,
  GET_PAGE_CONFIG,
} from './queries';

// Validate required environment variables
const AEM_HOST = process.env.NEXT_PUBLIC_AEM_HOST;
const AEM_GRAPHQL_ENDPOINT = process.env.NEXT_PUBLIC_AEM_GRAPHQL_ENDPOINT || '/content/graphql/global/endpoint.json';
const AEM_AUTH = process.env.NEXT_PUBLIC_AEM_AUTH;

if (!AEM_HOST) {
  console.warn('⚠️  NEXT_PUBLIC_AEM_HOST environment variable is not set. Data fetching will fail at runtime.');
}

// Construct the full GraphQL endpoint URL
const GRAPHQL_URL = `${AEM_HOST}${AEM_GRAPHQL_ENDPOINT}`;

/**
 * Initialize GraphQL client with auth headers if needed
 */
function getAemClient(): GraphQLClient {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (AEM_AUTH) {
    headers['Authorization'] = `Bearer ${AEM_AUTH}`;
  }

  return new GraphQLClient(GRAPHQL_URL, {
    headers,
  });
}

/**
 * Fetch all legends from AEM
 * @throws Error if GraphQL query fails
 */
export async function getAllLegends(): Promise<Legend[]> {
  if (!AEM_HOST) {
    console.error('❌ AEM_HOST not configured. Cannot fetch legends.');
    return [];
  }

  try {
    const client = getAemClient();
    const response = await client.request<LegendsListResponse>(GET_ALL_LEGENDS);
    
    if (!response.legendList?.items) {
      console.warn('⚠️  No legends returned from AEM');
      return [];
    }

    return response.legendList.items;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('❌ Error fetching legends from AEM:', errorMessage);
    throw new Error(`Failed to fetch legends: ${errorMessage}`);
  }
}

/**
 * Fetch a single legend by AEM fragment path
 * @param path - Full AEM fragment path (e.g., /content/dam/acssandboxemea02jcadev/lionel-messi)
 * @throws Error if GraphQL query fails
 */
export async function getLegendByPath(path: string): Promise<Legend | null> {
  if (!AEM_HOST) {
    console.error('❌ AEM_HOST not configured. Cannot fetch legend.');
    return null;
  }

  try {
    const client = getAemClient();
    const response = await client.request<SingleLegendResponse>(GET_LEGEND_BY_PATH, { path });
    
    if (!response.legendByPath) {
      console.warn(`⚠️  No legend found at path: ${path}`);
      return null;
    }

    return response.legendByPath;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error(`❌ Error fetching legend from path ${path}:`, errorMessage);
    throw new Error(`Failed to fetch legend: ${errorMessage}`);
  }
}

/**
 * Fetch all trophies from AEM
 * @throws Error if GraphQL query fails
 */
export async function getAllTrophies(): Promise<Trophy[]> {
  if (!AEM_HOST) {
    console.error('❌ AEM_HOST not configured. Cannot fetch trophies.');
    return [];
  }

  try {
    const client = getAemClient();
    const response = await client.request<TrophiesListResponse>(GET_ALL_TROPHIES);
    
    if (!response.trophyList?.items) {
      console.warn('⚠️  No trophies returned from AEM');
      return [];
    }

    return response.trophyList.items;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('❌ Error fetching trophies from AEM:', errorMessage);
    throw new Error(`Failed to fetch trophies: ${errorMessage}`);
  }
}

/**
 * Fetch page configuration from AEM
 * @throws Error if GraphQL query fails
 */
export async function getPageConfig(): Promise<PageConfig | null> {
  if (!AEM_HOST) {
    console.error('❌ AEM_HOST not configured. Cannot fetch page config.');
    return null;
  }

  try {
    const client = getAemClient();
    const response = await client.request<PageConfigResponse>(GET_PAGE_CONFIG);
    
    // Handle both direct object and list response
    if ('pageConfigList' in response && response.pageConfigList?.items?.[0]) {
      return response.pageConfigList.items[0];
    }

    return null;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('❌ Error fetching page config from AEM:', errorMessage);
    throw new Error(`Failed to fetch page config: ${errorMessage}`);
  }
}

/**
 * Helper to extract slug from legend name for URL routing
 * Converts "Lionel Messi" -> "lionel-messi"
 */
export function legendToSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');
}

/**
 * Helper to convert slug back to display name
 * Converts "lionel-messi" -> "Lionel Messi"
 */
export function slugToLegendName(slug: string): string {
  return slug
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}
