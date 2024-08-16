import { NamedAPIResource } from 'types/api-responses';
import { usePokemonAtom } from './atoms';
import { useAtomValue } from 'jotai';

const PokemonCard = ({ pokemonBase }: { pokemonBase: NamedAPIResource }) => {
  const pokemonAtom = usePokemonAtom(pokemonBase.url);
  const pokemon = useAtomValue(pokemonAtom);

  if (!pokemon) {
    return <div>Loading...</div>;
  }

  if (pokemon.data && 'error' in pokemon.data) {
    return <div>There was a problem</div>;
  }

  return (
    <>
      {pokemon.data && (
        <div>
          <h2>{pokemon.data.name}</h2>
          <img src={pokemon.data.sprites.front_default} />
        </div>
      )}
    </>
  );
};

export default PokemonCard;
