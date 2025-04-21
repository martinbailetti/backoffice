import "@testing-library/jest-dom";
import { server } from './mocks/server';

import "whatwg-fetch";

process.env.NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL || "http://baseapi.test/api/";

/*
// Configura el servidor MSW antes de todas las pruebas
beforeAll(() => server.listen());


// Reinicia los handlers después de cada prueba
afterEach(() => server.resetHandlers());

// Cierra el servidor MSW al finalizar todas las pruebas
afterAll(() => server.close());
 */
