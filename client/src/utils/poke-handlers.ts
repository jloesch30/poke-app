import { http, HttpResponse } from "msw";
import { pokemonListFixture } from "./fixtures/pokemon-list";
import { pokemonFixture } from "./fixtures/pokemon";

export const handlers = [
  http.get("https://pokeapi.co/api/v2/pokemon", () => {
    return HttpResponse.json(pokemonListFixture)
  }),
  http.get("https://pokeapi.co/api/v2/pokemon/:pokemon_identifer", () => {
    return HttpResponse.json(pokemonFixture)
  }),
];
