import { atom, WritableAtom, PrimitiveAtom } from "jotai"
import request from "lib/request"

export interface ResourceCacheAtomPayload {
  href: string;
  host?: string | null;
  force?: boolean;
  abortController?: AbortController;
}

export type CacheMapEntry<Response> = {
  loading: boolean;
  data: Response | { error: string } | undefined;
};

export type ResourceCacheMapAtom<Response> = WritableAtom<
  Record<string, CacheMapEntry<Response> | undefined>,
  [ResourceCacheAtomPayload],
  void
>;

export type CacheMapAtom<Response> = PrimitiveAtom<
  Record<string, CacheMapEntry<Response>>
>;

const createResourceCacheMapAtom = <
  Response
>(): ResourceCacheMapAtom<Response> => {
  const mapBaseAtom = atom<Record<string, CacheMapEntry<Response> | undefined>>(
    {}
  );
  const mapAtom = atom<
    Record<string, CacheMapEntry<Response> | undefined>,
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
        const response = await request.get<Response>(
          href,
          payload.host,
          payload.abortController
        );

        set(mapBaseAtom, (current) => ({
          ...current,
          [payload.href]: {
            loading: false,
            data: response,
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
        CacheMapEntry<T>,
        [ResourceCacheAtomPayload],
        void
      >(
        (get) => {
          return get(cache)[href] || { loading: true, data: undefined };
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
  const innerAtom = atom<{
    loading: boolean;
    data: Response | { error: string } | undefined
  }>({ loading: true, data: undefined });
  const resourceAtom = atom(
    (get) => get(innerAtom),
    async (_, set) => {
      if (!href) return;
      set(innerAtom, { loading: true, data: undefined });
      console.log('fetching', href);
      const data = await request.get<Response>(href, host);
      console.log('fetched', data);
      set(innerAtom, { loading: false, data });
    }
  );
  resourceAtom.onMount = (set) => {
    set();
  };

  return resourceAtom;
}

export {
  createResourceAtom,
  createResourceCacheMapAtom,
  createSingleCacheEntryAtom,
};
