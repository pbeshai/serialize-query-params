import { stringify, parse as parseQueryString } from 'query-string';
import { EncodedQuery, EncodedQueryWithNulls } from './types';

/**
 * remove query params that are nully or an empty strings.
 * note: these values are assumed to be already encoded as strings.
 */
function filterNully(query: EncodedQueryWithNulls): EncodedQuery {
  const filteredQuery: EncodedQuery = Object.keys(query).reduce(
    (queryAccumulator: any, queryParam: string) => {
      // get encoded value for this param
      const encodedValue = query[queryParam];

      // if it isn't null or empty string, add it to the accumulated obj
      if (encodedValue != null && encodedValue !== '') {
        queryAccumulator[queryParam] = encodedValue;
      }

      return queryAccumulator;
    },
    {}
  );

  return filteredQuery;
}

/**
 * Update a location, wiping out parameters not included in newQuery
 */
export function updateLocation(
  newQuery: EncodedQueryWithNulls,
  location: Location
) {
  const encodedSearchString = stringify(filterNully(newQuery));
  const newLocation: Location & { key: string } = {
    ...location,
    key: `${Date.now()}`, // needed for some routers (e.g. react-router)
    search: encodedSearchString.length ? `?${encodedSearchString}` : '',
  };

  return newLocation;
}

/**
 * Update a location while retaining existing parameters
 */
export function updateInLocation(
  queryReplacements: EncodedQueryWithNulls,
  location: Location
) {
  // if a query is there, use it, otherwise parse the search string
  const currQuery =
    (location as any).query || parseQueryString(location.search);

  const newQuery = {
    ...currQuery,
    ...queryReplacements,
  };

  return updateLocation(filterNully(newQuery), location);
}
