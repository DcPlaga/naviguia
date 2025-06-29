import { setupServer } from 'msw/node';
import { rest } from 'msw';

export const server = setupServer(
  rest.post('http://localhost:4000/api/RegistroAcompanantes', (req, res, ctx) => {
    return res(ctx.status(200));
  })
);