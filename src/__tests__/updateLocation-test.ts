import { updateLocation, updateInLocation } from '../index';
import { makeMockLocation } from './helpers';
import { parse } from 'query-string';

describe('updateLocation', () => {
  it('creates the correct search string', () => {
    const location = makeMockLocation({
      foo: 'abc',
      bar: '555',
      baz: '222',
    });
    const newLocation = updateLocation(
      {
        foo: 'xxx',
        pgb: null,
        und: undefined,
        emp: '',
      },
      location
    );
    expect(parse(newLocation.search)).toEqual({
      foo: 'xxx',
      pgb: null,
      emp: '',
    });
    expect(newLocation.key).toBeDefined();
    expect(newLocation.key).not.toBe((location as any).key);
    // include updated search string
    expect(newLocation.href).toBe(
      'http://localhost:3000/' + newLocation.search
    );

    // check multiple params
    expect(
      parse(updateLocation({ foo: 'a', baz: 'b' }, location).search)
    ).toEqual({ foo: 'a', baz: 'b' });
  });

  it('works with no query params', () => {
    // check updating to no params
    const location = makeMockLocation({ foo: 'abc', bar: '555' });
    const newLocation = updateLocation({}, location);
    expect(newLocation.search).toBe('');
    expect(newLocation.href).toBe('http://localhost:3000/');

    // check updating from no params
    expect(updateLocation({ foo: 'xxx' }, makeMockLocation({})).search).toBe(
      '?foo=xxx'
    );
  });
});

describe('updateInLocation', () => {
  it('creates the correct search string', () => {
    const location = makeMockLocation({ foo: 'abc', bar: '555', baz: '222' });
    const newLocation = updateInLocation(
      { foo: 'xxx', pgb: null, baz: undefined, bar: '' },
      location
    );
    expect(parse(newLocation.search)).toEqual({
      foo: 'xxx',
      bar: '',
      pgb: null,
    });
    expect(newLocation.key).toBeDefined();
    expect(newLocation.key).not.toBe((location as any).key);

    // check multiple params
    expect(
      parse(updateInLocation({ foo: 'a', baz: 'b' }, location).search)
    ).toEqual({ foo: 'a', bar: '555', baz: 'b' });
  });

  it('works with no query params', () => {
    // check updating to no params
    const location = makeMockLocation({ foo: 'abc', bar: '555' });
    const newLocation = updateInLocation({}, location);
    expect(parse(newLocation.search)).toEqual({ foo: 'abc', bar: '555' });

    // check updating from no params
    expect(updateInLocation({ foo: 'xxx' }, makeMockLocation({})).search).toBe(
      '?foo=xxx'
    );
  });
});
