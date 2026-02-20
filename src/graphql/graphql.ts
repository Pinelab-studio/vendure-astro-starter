import { initGraphQLTada } from 'gql.tada';
import type { introspection } from './graphql-env.d.ts';

/**
 * Graphql client with the correct scalar types for Vendure.
 */
export const graphql = initGraphQLTada<{
  introspection: introspection;
  scalars: {
    DateTime: string;
    JSON: any;
    Money: number;
  };
}>();