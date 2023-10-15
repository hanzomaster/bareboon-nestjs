import { initContract } from '@ts-rest/core';
import { z } from 'zod';

const c = initContract();

export const contract = c.router(
  {
    getHello: {
      method: 'GET',
      path: '/',
      responses: {
        200: z.string(),
      },
      summary: 'Get Hi mom',
    },
  },
  {
    pathPrefix: '/api',
  },
);
