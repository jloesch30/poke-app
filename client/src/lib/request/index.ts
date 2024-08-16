export const HOST = import.meta.env.TEST_HOST ?? null;

const headers = {
  'Accept': 'application/json',
  'Content-Type': 'application/json',
};


const get = async <ApiResponse = unknown>(
  url: string,
  abortController?: AbortController
): Promise<ApiResponse | { error: string }> => {
  try {
    const reqUrl = HOST ? `${HOST}${url}` : url;
    const response = await fetch(reqUrl, {
      method: 'GET',
      headers: headers,
      signal: abortController?.signal,
    });

    if (response.ok) {
      return await response.json();
    }

    if (response.status >= 500) {
      return { error: 'Internal Server Error' };
    }
    return { error: 'Unknown' };
  } catch (e) {
    if (e instanceof Error && e.name === 'AbortError') {
      return { error: e.name };
    }
    return { error: 'Failed to fetch resource' };
  }
};


export default {
  get,
};
