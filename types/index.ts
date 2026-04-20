/**
 * TypeScript interfaces matching AEM Content Fragment Models
 * These types are auto-derived from AEM schema and used throughout the app
 */

/**
 * Trophy model — represents a competition trophy won by Barça
 */
export interface Trophy {
  title: string;
  year: number;
  competition: 'la-liga' | 'copa-del-rey' | 'uefa-champions-league' | 'fifa-club-world-cup' | 'supercopa' | 'uefa-super-cup';
}

/**
 * Photo/Asset reference object returned from AEM
 */
export interface AssetReference {
  _path: string;
  _publishUrl?: string;
}

/**
 * Legend model — represents a Barça player
 */
export interface Legend {
  name: string;
  nickname?: string;
  position: 'goalkeeper' | 'defender' | 'midfielder' | 'forward';
  era: string;
  bio: string;
  trophies: string[]; // Multi-value text field containing trophy titles
  photo?: AssetReference;
  nationality: string;
  appearances: number;
  goals: number;
}

/**
 * PageConfig model — global page configuration
 */
export interface PageConfig {
  pageTitle: string;
  heroHeadline: string;
  heroSubtext: string;
  metaDescription: string;
}

/**
 * Generic GraphQL response wrapper
 */
export interface GraphQLResponse<T> {
  data?: T;
  errors?: Array<{
    message: string;
    extensions?: Record<string, any>;
  }>;
}

/**
 * API response for legends list
 */
export interface LegendsListResponse {
  legendList: {
    items: Legend[];
  };
}

/**
 * API response for single legend
 */
export interface SingleLegendResponse {
  legendByPath: Legend | null;
}

/**
 * API response for trophies list
 */
export interface TrophiesListResponse {
  trophyList: {
    items: Trophy[];
  };
}

/**
 * API response for page config
 */
export interface PageConfigResponse {
  pageConfigByPath: PageConfig | null;
}
