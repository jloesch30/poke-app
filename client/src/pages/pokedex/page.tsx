import { useAtom, useAtomValue } from 'jotai';
import {
  usePokemonAtom,
  pokemonHost,
  capturedPokemonAtom,
} from './atoms';
import {
  Container,
  Flex,
  Grid,
  GridItem,
  Input,
  Tooltip,
  Button,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Image,
  useToast,
} from '@chakra-ui/react';
import styles from './page.module.scss';
import { useState } from 'react';

import { Pokemon, PokemonIndexResponse } from 'types/api-responses';
import { PokemonCard, Stats, Info } from 'components/pokedex';
import { createSearchAtom, FetchResponse } from 'lib/atoms';

const PokemonCards = ({
  pokemon,
}: {
  pokemon: FetchResponse<PokemonIndexResponse>;
}) => {
  if (!pokemon.data) return null;

  if (pokemon.data && 'error' in pokemon.data)
    return (
      <Alert status="error">
        <AlertIcon />
        <AlertTitle>There was a problem fetching the Pokemon</AlertTitle>
        <AlertDescription>
          We were unable to fetch the Pokemon. Please try again later.
        </AlertDescription>
      </Alert>
    );

  if (pokemon.status === 404)
    return (
      <Alert status="warning" marginTop="20px">
        <AlertIcon />
        <AlertTitle>No Pokemon Found</AlertTitle>
        <AlertDescription>
          We were unable to find the Pokemon you were looking for. Please try
          again later.
        </AlertDescription>
      </Alert>
    );

  return (
    <Grid
      templateColumns={{
        base: 'repeat(1, 1fr)',
        md: 'repeat(3, 1fr)',
      }}
      templateRows="repeat(3, 1fr)"
      gap={6}
      className={styles.pokemonCards}
    >
      {pokemon.data.results.map((poke) => (
        <PokemonCard key={poke.name} pokemonBase={poke} />
      ))}
    </Grid>
  );
};

interface SearchProps {
  handleSearch: () => void;
  setSearchQuery: (query: string) => void;
}

const Search = ({
  handleSearch,
  setSearchQuery,
  searchQuery,
}: SearchProps & { searchQuery: string }) => {
  return (
    <Flex direction="row" gap="10px">
      <Tooltip label="You can search either by name or id" placement="top">
        <Input
          value={searchQuery}
          variant="filled"
          placeholder="Search for a Pokemon"
          focusBorderColor="crimson"
          _focus={{
            background: 'white',
          }}
          borderColor="crimson"
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </Tooltip>
      <Button borderColor="crimson" borderWidth="2px" onClick={handleSearch}>
        Go!
      </Button>
    </Flex>
  );
};

const Display = ({ pokemon }: { pokemon: FetchResponse<Pokemon> }) => {
  if (pokemon.loading) return <div>Loading...</div>;

  if (!pokemon.data && !pokemon.status) return <></>;

  const notFound = pokemon.status === 404;

  return (
    <div className={styles.displayContainer}>
      {notFound ? (
        <Alert status="warning" borderRadius="8px">
          <AlertIcon />
          <AlertTitle>Pokemon not found!</AlertTitle>
        </Alert>
      ) : pokemon.data && !('error' in pokemon.data) ? (
        <>
          <Flex direction="row">
            <Image
              width="200px"
              height="200px"
              src={pokemon.data.sprites.front_default}
            />
            <Info pokemon={pokemon.data} />
          </Flex>
          <Stats pokemon={pokemon.data} />
        </>
      ) : (
        <Alert status="error" borderRadius="8px">
          <AlertIcon />
          <AlertTitle>There was a problem fetching the Pokemon</AlertTitle>
          <AlertDescription>
            We were unable to fetch the Pokemon. Please try again later.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};

interface CaptureProps {
  handleCapture: () => void;
}

const Capture = ({ handleCapture }: CaptureProps) => {
  return <Button onClick={handleCapture}>Throw Pokeball</Button>;
};

interface PokemonListProps {
  capturedPokemon: Pokemon[];
  handleRelease: (selected: number) => void;
}

const PokemonList = ({ capturedPokemon, handleRelease }: PokemonListProps) => {
  return (
    <>
      <div>
        {capturedPokemon.map((pokemon, idx) => (
          <div key={pokemon.id}>
            <Image
              src={pokemon.sprites.front_default}
              onClick={() => handleRelease(idx)}
              alt={pokemon.name}
            />
          </div>
        ))}
      </div>
    </>
  );
};

const searchAtom = createSearchAtom<Pokemon>();

const PokeDex = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const pokemonAtom = usePokemonAtom('pokemon');
  const pokemon = useAtomValue(pokemonAtom);

  const [searchResult, setSearch] = useAtom(searchAtom);

  const [capturedPokemon, setCapturedPokemon] = useAtom(capturedPokemonAtom);

  const toast = useToast();

  const handleSearch = () => {
    if (!searchQuery) return;
    setSearch({ href: `pokemon/${searchQuery}`, host: pokemonHost });
    setSearchQuery('');
  };

  const handleCapture = () => {
    if (
      searchResult.loading ||
      !searchResult.data ||
      'error' in searchResult.data
    )
      return;

    const pokemon = searchResult.data;

    const length = Object.keys(capturedPokemon).length;

    if (length >= 6) {
      toast({
        title: 'Cannot capture Pokemon',
        description: 'You have reached the maximum limit of captured Pokemon',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }


    setCapturedPokemon((prev) => [...prev, pokemon]);
  };


  const handleRelesae = (selected: number) => {
    setCapturedPokemon((prev) => prev.filter((_, idx) => idx !== selected));

    toast({
      title: 'Pokemon released',
      description: 'You have released a Pokemon',
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
  };

  return (
    <Container centerContent maxW="4xl">
      <div className={styles.pageHeader}>Catch 'Em All!</div>
      <Grid
        templateColumns={{
          base: 'repeat(1, 1fr)',
          md: 'repeat(3, 1fr)',
        }}
        templateRows={{
          base: 'repeat(4, 1fr)',
          md: 'repeat(3, 1fr)',
        }}
        className={styles.deviceContainer}
      >
        <GridItem
          colSpan={{
            base: 1,
            md: 2,
          }}
          rowSpan={1}
        >
          <Search
            handleSearch={handleSearch}
            setSearchQuery={setSearchQuery}
            searchQuery={searchQuery}
          />
        </GridItem>
        <GridItem
          colSpan={{
            base: 1,
            md: 2,
          }}
          rowSpan={2}
          backgroundColor="white"
          height="100%"
          borderRadius="8px"
        >
          <Display pokemon={searchResult} />
        </GridItem>
        <GridItem
          colSpan={1}
          rowSpan={{
            base: 1,
            md: 2,
          }}
          height="100%"
        >
          <PokemonList capturedPokemon={capturedPokemon} handleRelease={handleRelesae} />
        </GridItem>
        <GridItem colSpan={1} rowSpan={3} paddingTop="10px">
          <Capture handleCapture={handleCapture} />
        </GridItem>
      </Grid>
      {pokemon.loading ? (
        <div>Loading...</div>
      ) : (
        <PokemonCards pokemon={pokemon} />
      )}
    </Container>
  );
};

export default PokeDex;
