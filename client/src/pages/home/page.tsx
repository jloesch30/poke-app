import { useNavigate } from 'react-router-dom';
import styles from './page.module.scss';
import { Button, Flex, Heading, Text, Link } from '@chakra-ui/react';
import { routes } from 'src/routes';
import { ExternalLinkIcon } from '@chakra-ui/icons';

const Home = () => {
  const navigate = useNavigate();

  return (
    <Flex
      direction="column"
      alignItems="center"
      justifyContent="center"
      minWidth="100vw"
      minHeight="80vh"
      marginBlock="auto"
    >
      <Heading className={styles.header}>
        Welcome to your <span className={styles.fadeIn}>Pokedex</span>
      </Heading>
      <Flex
        maxW="2xl"
        className={styles.container}
        direction="column"
        justifyContent="center"
        alignItems="center"
      >
        <Text marginTop="4">
          Welcome to the Pokedex app! Please feel free to explore and interact
          with your favorite Pokemon. This app is built with{' '}
          <span className={styles.emphasis}>Vite</span>,{' '}
          <span className={styles.emphasis}>React</span>,{' '}
          <span className={styles.emphasis}>TypeScript</span>,{' '}
          <span className={styles.emphasis}>Chakra UI</span>, and{' '}
          <span className={styles.emphasis}>Jotai</span>.
        </Text>
        <Text marginTop="1" display='flex' flexDirection='row' gap='10px' marginBottom='0'>
          Created by:{' '}
          <Link
            href="https://github.com/jloesch30"
            isExternal
            display="flex"
            flexDirection="row"
            alignItems="center"
            justifyContent="center"
          >
            Josh Loesch <ExternalLinkIcon mx="2px" marginLeft='5px' />
          </Link>
        </Text>
        <Text display='flex' flexDirection='row' gap='10px'>
          Repository:{' '}
          <Link
            href="https://github.com/jloesch30/poke-app"
            isExternal
            display="flex"
            flexDirection="row"
            alignItems="center"
            justifyContent="center"
          >
            Poke-app <ExternalLinkIcon mx="2px" marginLeft='5px' />
          </Link>
        </Text>
        <Button onClick={() => navigate(routes.pokeDexPath)}>
          Go to Pokedex
        </Button>
      </Flex>
    </Flex>
  );
};

export default Home;
