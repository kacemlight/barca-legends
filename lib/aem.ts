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

const DEFAULT_AEM_HOST = 'https://publish-p178261-e1872848.adobeaemcloud.com';

const AEM_HOST = process.env.NEXT_PUBLIC_AEM_HOST || DEFAULT_AEM_HOST;
const AEM_AUTH = process.env.NEXT_PUBLIC_AEM_AUTH;
const AEM_GRAPHQL_ENDPOINT_ENV = process.env.NEXT_PUBLIC_AEM_GRAPHQL_ENDPOINT;

if (!process.env.NEXT_PUBLIC_AEM_HOST) {
  console.warn(
    `⚠️  NEXT_PUBLIC_AEM_HOST not set; falling back to ${DEFAULT_AEM_HOST}. ` +
      `Create a .env.local (see .env.local.example) and restart the dev server to override.`,
  );
}

/**
 * Candidate GraphQL endpoint paths to try in order when no explicit
 * NEXT_PUBLIC_AEM_GRAPHQL_ENDPOINT is configured. The first one that
 * responds successfully is cached for the remainder of the process.
 *
 * AEM Cloud Service exposes Content Fragment GraphQL at
 * /content/_cq_graphql/<configName>/endpoint.json once the endpoint is
 * enabled on a configuration. Either "global" or a project-specific config
 * name (here acssandboxemea02jcadev) is common, so we probe both.
 */
const ENDPOINT_CANDIDATES = AEM_GRAPHQL_ENDPOINT_ENV
  ? [AEM_GRAPHQL_ENDPOINT_ENV]
  : [
      '/content/_cq_graphql/acssandboxemea02jcadev/endpoint.json',
      '/content/_cq_graphql/global/endpoint.json',
      '/content/cq:graphql/acssandboxemea02jcadev/endpoint.json',
      '/content/cq:graphql/global/endpoint.json',
      '/content/graphql/global/endpoint.json',
    ];

let resolvedEndpoint: string | null = null;
let endpointDiscoveryPromise: Promise<string> | null = null;

function buildHeaders(): Record<string, string> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (AEM_AUTH) {
    headers['Authorization'] = `Bearer ${AEM_AUTH}`;
  }
  return headers;
}

/**
 * Attempt an introspection query against a candidate path. Returns the path
 * if it responds with a valid GraphQL JSON payload, otherwise throws.
 */
async function probeEndpoint(path: string): Promise<string> {
  const url = `${AEM_HOST}${path}`;
  const response = await fetch(url, {
    method: 'POST',
    headers: buildHeaders(),
    body: JSON.stringify({ query: '{ __typename }' }),
  });

  const contentType = response.headers.get('content-type') || '';
  if (contentType.includes('application/json')) {
    const payload = await response.json().catch(() => null);
    if (payload && typeof payload === 'object' && ('data' in payload || 'errors' in payload)) {
      return path;
    }
  }

  // 409 from publish on a _cq_graphql path typically means the endpoint
  // exists but isn't enabled/published for this configuration. Surface that
  // hint so the error message points at the fix.
  if (response.status === 409) {
    throw new Error('HTTP 409 (endpoint config not enabled/published on this instance)');
  }
  throw new Error(`HTTP ${response.status}`);
}

async function resolveEndpoint(): Promise<string> {
  if (resolvedEndpoint) return resolvedEndpoint;
  if (endpointDiscoveryPromise) return endpointDiscoveryPromise;

  endpointDiscoveryPromise = (async () => {
    const errors: string[] = [];
    for (const candidate of ENDPOINT_CANDIDATES) {
      try {
        const path = await probeEndpoint(candidate);
        resolvedEndpoint = path;
        if (ENDPOINT_CANDIDATES.length > 1) {
          console.info(`✅ Discovered AEM GraphQL endpoint at ${path}`);
        }
        return path;
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        errors.push(`${candidate} -> ${msg}`);
      }
    }
    throw new Error(
      `No working AEM GraphQL endpoint found. Tried:\n  - ${errors.join('\n  - ')}\n` +
        `Set NEXT_PUBLIC_AEM_GRAPHQL_ENDPOINT to the correct path.`,
    );
  })();

  try {
    return await endpointDiscoveryPromise;
  } finally {
    endpointDiscoveryPromise = null;
  }
}

async function getAemClient(): Promise<GraphQLClient> {
  const path = await resolveEndpoint();
  return new GraphQLClient(`${AEM_HOST}${path}`, { headers: buildHeaders() });
}

export async function getAllLegends(): Promise<Legend[]> {
  if (!AEM_HOST) {
    console.error('❌ AEM_HOST not configured. Cannot fetch legends.');
    return [];
  }

  try {
    const client = await getAemClient();
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

export async function getLegendByPath(path: string): Promise<Legend | null> {
  if (!AEM_HOST) {
    console.error('❌ AEM_HOST not configured. Cannot fetch legend.');
    return null;
  }

  try {
    const client = await getAemClient();
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

export async function getAllTrophies(): Promise<Trophy[]> {
  if (!AEM_HOST) {
    console.error('❌ AEM_HOST not configured. Cannot fetch trophies.');
    return [];
  }

  try {
    const client = await getAemClient();
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

export async function getPageConfig(): Promise<PageConfig | null> {
  if (!AEM_HOST) {
    console.error('❌ AEM_HOST not configured. Cannot fetch page config.');
    return null;
  }

  try {
    const client = await getAemClient();
    const response = await client.request<PageConfigResponse>(GET_PAGE_CONFIG);

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
