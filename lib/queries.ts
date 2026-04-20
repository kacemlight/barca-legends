/**
 * GraphQL query definitions for AEM Content Fragments
 * All queries follow AEM GraphQL naming conventions and field mappings
 * Model technical names: legend, trophy, page-config
 */

/**
 * Get all legend fragments
 */
export const GET_ALL_LEGENDS = `
  query {
    legendList(limit: 100) {
      items {
        _path
        name
        nickname
        position
        era
        bio
        trophies
        nationality
        appearances
        goals
        photo {
          _path
          _publishUrl
        }
      }
    }
  }
`;

/**
 * Get a single legend by path
 * Requires fragment path parameter
 * Example: /content/dam/acssandboxemea02jcadev/lionel-messi
 */
export const GET_LEGEND_BY_PATH = `
  query GetLegendByPath($path: String!) {
    legendByPath(_path: $path) {
      _path
      name
      nickname
      position
      era
      bio
      trophies
      nationality
      appearances
      goals
      photo {
        _path
        _publishUrl
      }
    }
  }
`;

/**
 * Get all trophy fragments
 */
export const GET_ALL_TROPHIES = `
  query {
    trophyList(limit: 100) {
      items {
        _path
        title
        year
        competition
      }
    }
  }
`;

/**
 * Get page configuration
 * Queries the specific page-config fragment at the known path
 */
export const GET_PAGE_CONFIG = `
  query {
    pageConfigList(limit: 1) {
      items {
        _path
        pageTitle
        heroHeadline
        heroSubtext
        metaDescription
      }
    }
  }
`;

/**
 * Alternative: Get page config by explicit path if needed
 */
export const GET_PAGE_CONFIG_BY_PATH = `
  query GetPageConfigByPath($path: String!) {
    pageConfigByPath(_path: $path) {
      _path
      pageTitle
      heroHeadline
      heroSubtext
      metaDescription
    }
  }
`;
