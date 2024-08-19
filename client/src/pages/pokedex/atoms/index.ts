import { useMemo } from "react";
import { createCachedPaginatedResourceAtom, createResourceCacheMapAtom, createSingleCacheEntryAtom } from "lib/atoms";
import { atomWithStorage } from "jotai/utils";
import { Pokemon, PokemonIndexResponse } from "types/api-responses";


const pokemonCacheAtom =
  createResourceCacheMapAtom<PokemonIndexResponse>();

const usePokemonAtom = (href: string) =>
  useMemo(() => createSingleCacheEntryAtom(pokemonCacheAtom)(href), [href]);

const capturedPokemonAtom = atomWithStorage<Pokemon[]>("capturedPokemon", []);

const usePokemonPaginationAtom = (
  href: string,
) => useMemo(() => { 
  return createCachedPaginatedResourceAtom<PokemonIndexResponse>(pokemonCacheAtom)(href);
}, [href]);


export { usePokemonAtom, capturedPokemonAtom, usePokemonPaginationAtom };
