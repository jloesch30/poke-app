export const pokemonFixture = {
  name: "bulbasaur",
  url: "https://pokeapi.co/api/v2/pokemon/1/",
  sprites: {
    front_default: undefined,
  },
  types: [
    { type: { name: "grass" } },
    { type: { name: "poison" } },
  ],
  stats: [
    { base_stat: 45, effort: 0, stat: { name: "hp" } },
    { base_stat: 49, effort: 0, stat: { name: "attack" } },
    { base_stat: 49, effort: 0, stat: { name: "defense" } },
    { base_stat: 65, effort: 1, stat: { name: "special-attack" } },
    { base_stat: 65, effort: 0, stat: { name: "special-defense" } },
    { base_stat: 45, effort: 0, stat: { name: "speed" } },
  ],
}
