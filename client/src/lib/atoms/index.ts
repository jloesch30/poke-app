import { atom } from "jotai"
import request from "lib/request"

const createResourceAtom = <Response>(
 href: string | undefined
) => {
 const innerAtom = atom<{
   loading: boolean;
   data: Response | { error: string } | undefined
 }>({loading: true, data: undefined});
 const abortController = new AbortController();
 const resourceAtom = atom(
   (get) => get(innerAtom),
   async (_, set) => {
     if (!href) return;
     set(innerAtom, {loading: true, data: undefined});
     const data = await request.get<Response>(href, abortController);
     set(innerAtom, {loading: false, data});
   }
 );
 resourceAtom.onMount = (set) => {
   set();
   return () => abortController.abort();
  };
}

export default {
  createResourceAtom,
};
