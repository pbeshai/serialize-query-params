import { encodeQueryParams } from '../index';
import {
  NumberParam,
  ArrayParam,
  StringParam,
  DelimitedArrayParam,
} from '../params';

describe('encodeQueryParams', () => {
  it('works', () => {
    const encodedQuery = encodeQueryParams(
      {
        foo: StringParam,
        bar: NumberParam,
        baz: ArrayParam,
        box: DelimitedArrayParam,
      },
      { foo: '123', bar: 555, baz: ['a', 'b', 'c'], box: ['a', 'b', 'c'] }
    );
    expect(encodedQuery).toEqual({
      foo: '123',
      bar: '555',
      baz: ['a', 'b', 'c'],
      box: 'a_b_c',
    });
  });

  it('ignores unconfigured parameters', () => {
    const encodedQuery = encodeQueryParams(
      {
        foo: StringParam,
      },
      {
        foo: '123',
        bar: 555,
        baz: ['a', 'b', 'c'],
        box: ['a', 'b', 'c'],
      } as any
    );
    expect(encodedQuery).toEqual({
      foo: '123',
      bar: '555', // unconfigured defaults to string
      baz: 'a,b,c', // unconfigured defaults to string
      box: 'a,b,c', // unconfigured defaults to string
    });
  });

  it('ignores configured parameters with no value', () => {
    const encodedQuery = encodeQueryParams(
      {
        foo: StringParam,
        bar: NumberParam,
      },
      { bar: 555 }
    );
    expect(encodedQuery).toEqual({
      bar: '555',
    });
  });

  it('returns nully values as undefined', () => {
    const encodedQuery = encodeQueryParams(
      {
        foo: StringParam,
        bar: NumberParam,
      },
      { bar: null, foo: undefined }
    );
    expect(encodedQuery).toEqual({
      bar: undefined,
      foo: undefined,
    });
  });
});
