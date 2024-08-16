import { Helmet, HelmetProvider } from 'react-helmet-async';
import { Route, Routes } from 'react-router-dom';
import Home from 'pages/home/page';

function App() {
  return (
    <HelmetProvider>
      <Helmet>
        <title>Poke-app</title>
      </Helmet>
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </HelmetProvider>
  );
}

export default App;
