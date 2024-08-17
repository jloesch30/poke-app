import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

import { BrowserRouter } from 'react-router-dom';
import { ChakraProvider } from '@chakra-ui/react';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <ChakraProvider toastOptions={{ defaultOptions: { position: 'top' } }}>
        <App />
      </ChakraProvider>
    </BrowserRouter>
  </StrictMode>,
);
