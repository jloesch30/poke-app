import { useAtomValue } from 'jotai';
import { usePokemonAtom } from './atoms';
import { NamedAPIResource, Pokemon } from 'types/api-responses';
import { Card, CardHeader, CardBody, Flex, Heading, Image } from '@chakra-ui/react';
import { FetchResponse } from 'lib/atoms';

interface PokemonCardProps {
  pokemonBase: NamedAPIResource;
  setSearchQuery: (query: string) => void;
}

const PokemonCard = ({ pokemonBase, setSearchQuery }: PokemonCardProps) => {
  const pokemonAtom = usePokemonAtom(pokemonBase.url);
  const pokemon = useAtomValue(pokemonAtom);

  if (!pokemon) {
    return <div>Loading...</div>;
  }

  if (pokemon.data && 'error' in pokemon.data) {
    return <div>There was a problem</div>;
  }

  const handleClick = (pokemon: FetchResponse<Pokemon>) => {
    if (!pokemon.data || ('error' in pokemon.data)) return;

    setSearchQuery(pokemon.data.name);
  };

  return (
    <>
      {pokemon.data && (
        <Card maxW="md" onClick={() => handleClick(pokemon)} cursor='pointer'>
          <CardHeader>
            <Flex flexWrap="wrap" alignItems="center" justifyContent="center">
              <Heading
                as="h6"
                fontWeight="bold"
                fontSize={{
                  base: '0.7rem',
                  md: '1rem',
                }}
              >
                {pokemon.data.id} - {pokemon.data.name}
              </Heading>
            </Flex>
          </CardHeader>
          <CardBody>
            <Flex alignItems="center" justifyContent="center">
              <Image src={pokemon.data.sprites.front_default} />
            </Flex>
          </CardBody>
        </Card>
      )}
    </>
  );
};

export default PokemonCard;
