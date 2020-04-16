import { decodeQueryParams } from '../index';
import {
  NumberParam,
  ArrayParam,
  StringParam,
  DelimitedArrayParam,
} from '../params';

describe('decodeQueryParams', () => {
  it('works', () => {
    const decodedQuery = decodeQueryParams(
      {
        foo: StringParam,
        bar: NumberParam,
        baz: ArrayParam,
        box: DelimitedArrayParam,
      },
      {
        foo: '123',
        bar: '555',
        baz: ['a', 'b', 'c'],
        box: 'a_b_c',
      }
    );
    expect(decodedQuery).toEqual({
      foo: '123',
      bar: 555,
      baz: ['a', 'b', 'c'],
      box: ['a', 'b', 'c'],
    });
  });

  it('ignores unconfigured parameters', () => {
    const decodedQuery = decodeQueryParams(
      {
        foo: StringParam,
      },
      {
        foo: '123',
        bar: '555',
        baz: ['a', 'b', 'c'],
        box: 'a,b,c',
      } as any
    );

    expect(decodedQuery).toEqual({
      foo: '123',
      bar: '555',
      baz: ['a', 'b', 'c'],
      box: 'a,b,c',
    } as any);
  });

  it('ignores configured parameters with no value', () => {
    const decodedQuery = decodeQueryParams(
      {
        foo: StringParam,
        bar: NumberParam,
      },
      { bar: '555' }
    );
    expect(decodedQuery).toEqual({
      bar: 555,
    });
  });

  it('handles nully and empty values', () => {
    const encodedQuery = decodeQueryParams(
      {
        und: StringParam,
        emp: StringParam,
        nul: NumberParam,
      },
      { nul: null, emp: '', und: undefined }
    );
    expect(encodedQuery).toEqual({
      nul: null,
      emp: '',
      und: undefined,
    });
  });
});
