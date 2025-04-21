import { setupServer } from 'msw/node';
import { handlers } from './handlers';

// Configura el servidor MSW con los handlers
export const server = setupServer(...handlers);
