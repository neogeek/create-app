import { JSONObject } from 'superjson/dist/types';

export const mockFetchResponse = (response: JSONObject) =>
  jest.spyOn(global, 'fetch').mockImplementationOnce(
    jest.fn().mockImplementation(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(response),
      })
    )
  );

export const globalFetch = global.fetch;

export const setupFetchMock = () => {
  if (globalFetch === undefined) {
    global.fetch = async (): Promise<Response> =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({}),
      } as unknown as Response);
  }
};

export const teardownFetchMock = () => {
  global.fetch = globalFetch;
};
