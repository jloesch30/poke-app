import '@testing-library/jest-dom';

import { server } from './src/utils/test-server';

beforeAll(() => server.listen());
