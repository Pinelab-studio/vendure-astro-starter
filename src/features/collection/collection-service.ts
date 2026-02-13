import request from "graphql-request";
import { graphql } from "gql.tada";
import { vendureApi } from "../../config";

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
export async function getNavigationCollections(locale: string) {
  const { collections: { items } } = await request(vendureApi(locale), CollectionsList);
  return items;
}
