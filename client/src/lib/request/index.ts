export const TEST_HOST = import.meta.env.TEST_HOST ?? null;

const headers = {
  'Accept': 'application/json',
  'Content-Type': 'application/json',
};


type FetchResponse<Response> = {
  status: number;
  data?: Response;
  error?: string;
};


const get = async <ApiResponse = unknown>(
  resource: string,
  host?: string | null,
  abortController?: AbortController
): Promise<FetchResponse<ApiResponse>> => {
  try {
    const reqUrl = host ? `${host}${resource}` : resource;
    const response = await fetch(reqUrl, {
      method: 'GET',
      headers: headers,
      signal: abortController?.signal,
    });

    if (response.ok) {
      return { status: response.status, data: await response.json() };
    }

    if (response.status >= 500) {
      return { status: response.status, error: 'Internal Server Error' };
    }

    return { status: response.status, error: 'Unknown' };
  } catch (e) {
    if (e instanceof Error && e.name === 'AbortError') {
      return { status: 499, error: e.name };
    }
    return { status: 444, error: 'Failed to fetch resource' };
  }
};


export default {
  get,
};
