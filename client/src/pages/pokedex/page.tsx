import { useAtomValue } from 'jotai';
import { usePokemonAtom } from './atoms';
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
  AlertDescription
} from '@chakra-ui/react';
import styles from './page.module.scss';

import { PokemonIndexResponse } from 'types/api-responses';
import PokemonCard from 'components/pokedex';

const PokemonCards = ({ pokemon }: { pokemon: PokemonIndexResponse | { error: string } | undefined }) => {
  if (!pokemon) return null;


  if (pokemon && 'error' in pokemon)
    return (
      <Alert status="error">
        <AlertIcon />
        <AlertTitle>There was a problem fetching the Pokemon</AlertTitle>
        <AlertDescription>We were unable to fetch the Pokemon. Please try again later.</AlertDescription>
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

      
      {pokemon.results.map((poke) => (
        console.log(poke),
        <PokemonCard key={poke.name} pokemonBase={poke} />
      ))}
    </Grid>
  );
}
  

const Search = () => {
  return (
    <Flex direction='row' gap='10px'>
      <Tooltip label="You can search either by name or id" placement="top">
        <Input
          variant="filled"
          placeholder="Search for a Pokemon"
          focusBorderColor="crimson"
          _focus={{
            background: 'white',
          }}
          borderColor="crimson"
        />
      </Tooltip>
      <Button
      borderColor="crimson"
      borderWidth="2px"
      >Go!</Button>
    </Flex>
  );
};

const Device = () => {
  return <div className={styles.deviceScreen}></div>;
};

const PokemonList = () => {
  return <div className={styles.pokemonList}></div>;
};

const PokeDex = () => {
  const pokemonAtom = usePokemonAtom('pokemon');
  const pokemon = useAtomValue(pokemonAtom);

  return (
    <Container centerContent maxW="4xl">
      <div className={styles.pageHeader}>Catch 'Em All!</div>
      <Grid
        templateColumns={{
          base: 'repeat(1, 1fr)',
          md: 'repeat(3, 1fr)',
        }}
        templateRows="repeat(3, 1fr)"
        className={styles.deviceContainer}
      >
        <GridItem colSpan={2} rowSpan={1}>
          <Search />
        </GridItem>
        <GridItem colSpan={2} rowSpan={2}>
          <Device />
        </GridItem>
        <GridItem colSpan={1} rowSpan={3} backgroundColor="red">
          <PokemonList />
        </GridItem>
      </Grid>
      {pokemon.loading ? <div>Loading...</div> 
        : <PokemonCards pokemon={pokemon.data} />}
    </Container>
  );
};

export default PokeDex;
