import { atom, WritableAtom, PrimitiveAtom } from "jotai"
import request from "lib/request"

export interface ResourceCacheAtomPayload {
  href: string;
  force?: boolean;
  abortController?: AbortController;
}

export interface PaginatedResourceCacheAtomPayload {
  href: string;
  action?: 'prev' | 'next' | null;
}

export interface SearchAtomPayload {
  href: string;
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
    (get) => {
      return get(mapBaseAtom)
    },
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
  <Response>(cache: ResourceCacheMapAtom<Response>) =>
    (
      href: string,
    ) => {
      const singleEntryAtom = atom<
        FetchResponse<Response>,
        [ResourceCacheAtomPayload],
        void
      >(
        (get) => {
          return get(cache)[href] || { loading: true, data: undefined, status: undefined };
        },
        (_get, set, payload) => {
          set(cache, { ...payload });
        }
      );
      singleEntryAtom.onMount = (set) => {
        set({ href });
      };
      return singleEntryAtom;
    };

type PaginatedResponse = {
  previous: string | null;
  next: string | null;
};

const createCachedPaginatedResourceAtom =
  <Response extends PaginatedResponse>(
    cache: ResourceCacheMapAtom<Response>,
  ) => (
    href: string,
  ) => {
      const currHrefAtom = atom<string | null>(href);

      const paginatedSingleEntryAtom = atom<
        FetchResponse<Response>,
        [PaginatedResourceCacheAtomPayload],
        void
      >(
        (get) => {
          const currHref = get(currHrefAtom);
          return get(cache)[currHref || href] || { loading: true, data: undefined, status: undefined };
        },
        async (get, set, payload) => {
          const currHref = get(currHrefAtom);

          if (!payload.href) return;

          const hrefToFetch = currHref || payload.href;
          const innerCachedAtom = get(cache)[hrefToFetch];

          if (!innerCachedAtom) {
            set(cache, { ...payload, href: hrefToFetch });
            return;
          }

          if (!(payload.action) || !(innerCachedAtom.data) || ('error' in innerCachedAtom.data)) return;

          if (payload.action === 'prev' && innerCachedAtom.data.previous) {
            set(currHrefAtom, innerCachedAtom.data.previous);
            set(cache, { href: innerCachedAtom.data.previous });
          } else if (payload.action === 'next' && innerCachedAtom.data.next) {
            set(currHrefAtom, innerCachedAtom.data.next);
            set(cache, { href: innerCachedAtom.data.next });
          }
        }
      );
      paginatedSingleEntryAtom.onMount = (set) => {
        set({ href });
      };
      return paginatedSingleEntryAtom;
    };


const createResourceAtom = <Response>(
  href: string | undefined,
) => {
  const innerAtom = atom<FetchResponse<Response>>({ loading: true, data: undefined, status: undefined });
  const resourceAtom = atom(
    (get) => get(innerAtom),
    async (_, set) => {
      if (!href) return;
      set(innerAtom, { loading: true, data: undefined, status: undefined });
      const res = await request.get<Response>(href);
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
    async (_, set, { href }) => {
      if (!href) return;
      set(innerAtom, { loading: true, data: undefined });
      const res = await request.get<Response>(href);
      set(innerAtom, { loading: false, data: res.data, status: res.status });
    }
  );

  return searchAtom;
}

export {
  createResourceAtom,
  createResourceCacheMapAtom,
  createSingleCacheEntryAtom,
  createCachedPaginatedResourceAtom,
  createSearchAtom,
};
