import { stringify, ParsedQuery } from 'query-string';

export function makeMockLocation(query: ParsedQuery): Location {
  const queryStr = stringify(query);
  return {
    protocol: 'http:',
    host: 'localhost',
    pathname: '/',
    search: queryStr.length ? `?${queryStr}` : '',
    key: `mock-${Date.now()}`,
  } as Location & { key: string };
}
