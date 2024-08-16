import { createResourceAtom, createSingleCacheEntryAtom, createResourceCacheMapAtom } from "lib/atoms";
import { useMemo } from "react";
import { Pokemon } from "types/api-responses";

const pokemonCacheAtom =
  createResourceCacheMapAtom<Pokemon>();

const usePokemonAtom = (href: string) =>
  useMemo(() => createSingleCacheEntryAtom(pokemonCacheAtom)(href), [href]);

export { usePokemonAtom };

