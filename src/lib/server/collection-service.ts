import request from "graphql-request";
import { graphql, type ResultOf } from "gql.tada";
import { vendureApi } from "../../config";
import { SwrCache } from "../util/swr-cache";

export const cache = new SwrCache();

export type NavigationCollection = NonNullable<ResultOf<typeof CollectionsList>>["collections"]["items"][number];

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
export async function getNavigationCollections(locale: string): Promise<NavigationCollection[]> {
  const ttl = 1000 * 60 * 5; // 5 minutes
  const getNavigationCollections = () => request(vendureApi(locale), CollectionsList);
  const { collections: { items } } = await cache.get(locale, getNavigationCollections, ttl);
  return items;
}
