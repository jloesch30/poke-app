export interface NamedAPIResource {
  name: string;
  url: string;
}

interface PokemonAbility {
  ability: NamedAPIResource;
  is_hidden: boolean;
  slot: number;
}

interface PokemonType {
  slot: number;
  type: NamedAPIResource;
}

interface PokemonStat {
  base_stat: number;
  effort: number;
  stat: NamedAPIResource;
}

interface PokemonSprites {
  front_default: string;
  front_shiny: string;
  back_default: string;
  back_shiny: string;
}

export interface PaginatedResponse<T> {
  count: number;
  next: string;
  previous: string;
  results: T[];
}


export interface Pokemon {
  id: number;
  name: string;
  base_experience: number;
  heaight: number;
  is_default: boolean;
  order: number;
  weight: number;
  abilities: PokemonAbility[];
  sprites: PokemonSprites;
  types: PokemonType[];
  stats: PokemonStat[];
}

export type PokemonIndexResponse = PaginatedResponse<NamedAPIResource>;
  
