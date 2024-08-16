import { Helmet, HelmetProvider } from 'react-helmet-async';
import { Route, Routes } from 'react-router-dom';
import Home from 'pages/home/page';
import PokeDex from 'pages/pokedex/page';
import { routes } from './routes';

function App() {
  return (
    <HelmetProvider>
      <Helmet>
        <title>Poke-app</title>
      </Helmet>
      <Routes>
        <Route path={routes.rootPath} element={<Home />} />
        <Route path={routes.pokeDexPath} element={<PokeDex />} />
        <Route path={routes.notFoundPath} element={<div>Not Found</div>} />
      </Routes>
    </HelmetProvider>
  );
}

export default App;
