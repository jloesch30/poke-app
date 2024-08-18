import { createCachedPaginatedResourceAtom, createResourceCacheMapAtom, createSearchAtom } from "lib/atoms";
import { atomWithStorage } from "jotai/utils";
import { Pokemon, PokemonIndexResponse } from "types/api-responses";
import { pokemonHost } from "../common";


const pokemonCacheAtom =
  createResourceCacheMapAtom<PokemonIndexResponse>();


const createPokemonPaginatedAtom = (
  href: string,
) => (
  createCachedPaginatedResourceAtom<PokemonIndexResponse>(pokemonCacheAtom)(href)
);

const capturedPokemonAtom = atomWithStorage<Pokemon[]>("capturedPokemon", []);
const searchAtom = createSearchAtom<Pokemon>();
const paginatedPokemonAtom = createPokemonPaginatedAtom(`${pokemonHost}/pokemon`);

export { searchAtom, paginatedPokemonAtom, capturedPokemonAtom };
