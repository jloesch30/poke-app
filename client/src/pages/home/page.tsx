import { Link } from 'react-router-dom';
import styles from './page.module.scss';
import { Container } from '@chakra-ui/react';

const Home = () => {
  return (
    <>
      <h1 className={styles.header}>
        Welcome to your <span className={styles.fadeIn}>Pokedex</span>
      </h1>
      <Container maxW="2xl" className={styles.container}>
        <p>This project is built with the following technologies:</p>
        <Link to="/pokedex">Enter your Pokedex</Link>
      </Container>
    </>
  );
};

export default Home;
