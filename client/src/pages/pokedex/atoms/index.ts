import { useMemo } from "react";
import { createResourceCacheMapAtom, createSingleCacheEntryAtom } from "lib/atoms";
import { atomWithStorage } from "jotai/utils";
import { Pokemon, PokemonIndexResponse } from "types/api-responses";

const pokemonHost = "https://pokeapi.co/api/v2/";

const pokemonCacheAtom =
  createResourceCacheMapAtom<PokemonIndexResponse>();

const usePokemonAtom = (href: string) =>
  useMemo(() => createSingleCacheEntryAtom(pokemonCacheAtom)(href, pokemonHost), [href]);

const capturedPokemonAtom = atomWithStorage<Pokemon[]>("capturedPokemon", []);

export { usePokemonAtom, pokemonHost, capturedPokemonAtom};
