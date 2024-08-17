import { test, expect, vi, describe, beforeEach, Mock } from 'vitest';

import request from 'lib/request';

describe('get', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn());
  });

  test('should return data when the response is ok', async () => {
    (fetch as Mock).mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({ random: '12345' }),
    });
    const response = await request.get('https://example.com');

    const expectedrResponse = { status: 200, data: { random: '12345' } };

    expect(response).toEqual(expectedrResponse);
  });

  test('should return error when the response is not okay', async () => {
    (fetch as Mock).mockResolvedValueOnce({
      ok: false,
      status: 500,
    });

    const response = await request.get('https://example.com');

    const expectedrResponse = { status: 500, error: 'Internal Server Error' };

    expect(response).toEqual(expectedrResponse);
  });

  test('should abort the request when the abort controller is aborted', async () => {
    const abortController = new AbortController();
    (fetch as Mock).mockImplementationOnce(() => {
      return Promise.reject(new DOMException('Aborted', 'AbortError'));
    });

    const response = await request.get('https://example.com', null, abortController);

    const expectedrResponse = { status: 499, error: 'AbortError' };

    expect(response).toEqual(expectedrResponse);
  });
});
