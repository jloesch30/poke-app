import { atom, WritableAtom, PrimitiveAtom } from "jotai"
import request from "lib/request"

export interface ResourceCacheAtomPayload {
  href: string;
  host?: string | null;
  force?: boolean;
  abortController?: AbortController;
}

export interface SearchAtomPayload {
  href: string;
  host?: string | null;
}

export type FetchResponse<Response> = {
  loading: boolean;
  data: Response | { error: string } | undefined;
  status?: number;
};

export type ResourceCacheMapAtom<Response> = WritableAtom<
  Record<string, FetchResponse<Response> | undefined>,
  [ResourceCacheAtomPayload],
  void
>;

export type CacheMapAtom<Response> = PrimitiveAtom<
  Record<string, FetchResponse<Response>>
>;

const createResourceCacheMapAtom = <
  Response
>(): ResourceCacheMapAtom<Response> => {
  const mapBaseAtom = atom<Record<string, FetchResponse<Response> | undefined>>(
    {}
  );
  const mapAtom = atom<
    Record<string, FetchResponse<Response> | undefined>,
    [ResourceCacheAtomPayload],
    void
  >(
    (get) => get(mapBaseAtom),
    async (get, set, payload) => {
      const href = payload.href;
      if (!href) {
        return;
      }
      const detail = get(mapBaseAtom)[payload.href];
      if (!detail || payload.force) {
        set(mapBaseAtom, (current) => ({
          ...current,
          [payload.href]: { loading: true, data: undefined },
        }));
        const res = await request.get<Response>(
          href,
          payload.host,
          payload.abortController
        );

        set(mapBaseAtom, (current) => ({
          ...current,
          [payload.href]: {
            loading: false,
            status: res.status,
            data: res.data,
          },
        }));
      }
    }
  );
  return mapAtom;
};

const createSingleCacheEntryAtom =
  <T>(cache: ResourceCacheMapAtom<T>) =>
    (
      href: string,
      host?: string | null
    ) => {
      const singleEntryAtom = atom<
        FetchResponse<T>,
        [ResourceCacheAtomPayload],
        void
      >(
        (get) => {
          return get(cache)[href] || { loading: true, data: undefined, status: undefined };
        },
        (_get, set, payload) => {
          set(cache, { ...payload, host });
        }
      );
      singleEntryAtom.onMount = (set) => {
        set({ href });
      };
      return singleEntryAtom;
    };


const createResourceAtom = <Response>(
  href: string | undefined,
  host?: string | null,
) => {
  const innerAtom = atom<FetchResponse<Response>>({ loading: true, data: undefined, status: undefined });
  const resourceAtom = atom(
    (get) => get(innerAtom),
    async (_, set) => {
      if (!href) return;
      set(innerAtom, { loading: true, data: undefined, status: undefined });
      console.log('fetching', href);
      const res = await request.get<Response>(href, host);
      console.log('fetched', res);
      set(innerAtom, { loading: false, data: res.data, status: res.status });
    }
  );
  resourceAtom.onMount = (set) => {
    set();
  };

  return resourceAtom;
}

const createSearchAtom = <Response>() => {
  const innerAtom = atom<FetchResponse<Response>>({ loading: false, data: undefined, status: undefined });
  const searchAtom = atom<
    FetchResponse<Response>,
    [SearchAtomPayload],
    void
  >(
    (get) => get(innerAtom),
    async (_, set, { href, host }) => {
      if (!href) return;
      set(innerAtom, { loading: true, data: undefined });
      const res = await request.get<Response>(href, host);
      set(innerAtom, { loading: false, data: res.data, status: res.status });
    }
  );

  return searchAtom;
}

export {
  createResourceAtom,
  createResourceCacheMapAtom,
  createSingleCacheEntryAtom,
  createSearchAtom,
};
