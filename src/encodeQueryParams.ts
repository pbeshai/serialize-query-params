import {
  EncodedQueryWithNulls,
  DecodedValueMap,
  QueryParamConfigMap,
} from './types';

/**
 * Convert the values in query to strings via the encode functions configured
 * in paramConfigMap
 *
 * @param paramConfigMap Map from query name to { encode, decode } config
 * @param query Query updates mapping param name to decoded value
 */
export function encodeQueryParams<QPCMap extends QueryParamConfigMap>(
  paramConfigMap: QPCMap,
  query: Partial<DecodedValueMap<QPCMap>>
): EncodedQueryWithNulls {
  const encodedChanges: EncodedQueryWithNulls = {};
  const changingParamNames = Object.keys(query);
  for (const paramName of changingParamNames) {
    if (!paramConfigMap[paramName]) {
      if (process.env.NODE_ENV === 'development') {
        console.warn(
          `Skipping encoding parameter ${paramName} since it was not configured.`
        );
      }
      continue;
    }
    encodedChanges[paramName] = paramConfigMap[paramName].encode(
      query[paramName]
    );
  }
  return encodedChanges;
}
export default encodeQueryParams;
