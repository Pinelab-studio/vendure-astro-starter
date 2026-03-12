import request from "graphql-request";
import type { ResultOf } from "gql.tada";
import { vendureApi } from "../../config";
import { graphql } from "../../graphql/graphql";

const AvailableCountriesQuery = graphql(`
  query AvailableCountries {
    availableCountries {
      id
      code
      name
    }
  }
`);

export type AvailableCountry = ResultOf<
  typeof AvailableCountriesQuery
>["availableCountries"][number];

export async function getAvailableCountries(
  locale: string,
): Promise<AvailableCountry[]> {
  const result = await request(vendureApi(locale), AvailableCountriesQuery);
  return result.availableCountries;
}
