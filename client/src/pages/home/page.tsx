import { Link } from "react-router-dom";
import styles from './page.module.scss';

const Home = () => {
  return (
    <div>
      <h1 className={styles.header}>Welcome to your PokeDex</h1>
      <Link to="/pokedex">Enter your Pokedex</Link>
    </div>
  );
}

export default Home;
