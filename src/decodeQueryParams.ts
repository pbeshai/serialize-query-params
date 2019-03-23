import { DecodedValueMap, QueryParamConfigMap, EncodedValueMap } from './types';

/**
 * Convert the values in query to strings via the encode functions configured
 * in paramConfigMap
 *
 * @param paramConfigMap Map from query name to { encode, decode } config
 * @param query Query updates mapping param name to decoded value
 */
export function decodeQueryParams<QPCMap extends QueryParamConfigMap>(
  paramConfigMap: QPCMap,
  encodedQuery: Partial<EncodedValueMap<QPCMap>>
): Partial<DecodedValueMap<QPCMap>> {
  const decodedQuery: Partial<DecodedValueMap<QPCMap>> = {};

  const paramNames = Object.keys(encodedQuery);
  for (const paramName of paramNames) {
    const encodedValue = encodedQuery[paramName];
    if (encodedValue == null) {
      decodedQuery[paramName] = undefined;
      continue;
    }

    if (!paramConfigMap[paramName]) {
      if (process.env.NODE_ENV === 'development') {
        console.warn(
          `Passing through parameter ${paramName} during decoding since it was not configured.`
        );
      }

      // NOTE: we could just not include it, but it is probably convenient to have
      // it default to be a string type.
      (decodedQuery as any)[paramName] = encodedValue;
    } else {
      decodedQuery[paramName] = paramConfigMap[paramName].decode(
        encodedValue as string | string[]
      );
    }
  }

  return decodedQuery;
}
