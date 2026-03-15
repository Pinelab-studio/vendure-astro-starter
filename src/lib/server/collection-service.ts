import request from "graphql-request";
import { graphql, type ResultOf } from "gql.tada";
import { vendureApi } from "../../config";
import { SwrCache } from "../util/swr-cache";

export const cache = new SwrCache();

export type NavigationCollection = NonNullable<
  ResultOf<typeof CollectionsList>
>["collections"]["items"][number];

const CollectionsList = graphql(`
  query {
    collections(options: { topLevelOnly: true, take: 10 }) {
      items {
        id
        name
        description
        slug
        featuredAsset {
          preview
        }
        children {
          id
          name
          slug
          featuredAsset {
            preview
          }
        }
      }
    }
  }
`);

/**
 * Get the top level collections with children for the navigation
 */
export async function getNavigationCollections(
  locale: string,
): Promise<NavigationCollection[]> {
  const ttl = 1000 * 60 * 5; // 5 minutes
  const getNavigationCollections = () =>
    request(vendureApi(locale), CollectionsList);
  const {
    collections: { items },
  } = await cache.get(locale, getNavigationCollections, ttl);
  return items;
}

const SitemapCollectionsQuery = graphql(`
  query GetSitemapCollections($skip: Int!, $take: Int!) {
    collections(options: { skip: $skip, take: $take }) {
      items {
        slug
        updatedAt
      }
      totalItems
    }
  }
`);

export type SitemapCollectionEntry = ResultOf<
  typeof SitemapCollectionsQuery
>["collections"]["items"][number];

/**
 * Fetches all collection slugs and updatedAt for sitemap.
 */
export async function getSitemapCollections(
  locale: string,
): Promise<SitemapCollectionEntry[]> {
  const SITEMAP_BATCH_SIZE = 100;
  const out: SitemapCollectionEntry[] = [];
  let skip = 0;
  let hasMore = true;
  while (hasMore) {
    const {
      collections: { items, totalItems },
    } = await request(vendureApi(locale), SitemapCollectionsQuery, {
      skip,
      take: SITEMAP_BATCH_SIZE,
    });
    out.push(...items);
    skip += SITEMAP_BATCH_SIZE;
    hasMore = out.length === SITEMAP_BATCH_SIZE && skip < totalItems;
  }
  return out;
}
