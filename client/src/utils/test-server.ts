import { http as httpMock } from 'msw';
import { setupServer } from 'msw/node';
import { handlers } from './poke-handlers';

const server = setupServer(...handlers);

export { server, httpMock };

