import * as navigation from '../logic/navigation';

describe('navigation tests', () => {
  const { location } = window;
  const getHrefSpy = jest.fn(() => expected);
  const setHrefSpy = jest.fn(href => href);

  beforeAll(() => {
    delete window.location;
    window.location = {};

    Object.defineProperty(window.location, 'href', {
      get: getHrefSpy,
      set: setHrefSpy,
    });
  });

  test.each([
    {url: 'test', queryObj: '', expected: 'test'},
    {url: 'test', queryObj: {param1: 'test1', param2: 'test2'}, expected: 'test/?param1=test1&param2=test2'},
  ])('test url navigation', ({url, queryObj, expected}) => {
    navigation.redirectTo(url, queryObj)
    expect(setHrefSpy).toHaveBeenCalledWith(expected);
  });

  afterAll(() => {
    window.location = location;
  });
});