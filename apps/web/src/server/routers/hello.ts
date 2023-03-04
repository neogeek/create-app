import { z } from 'zod';

import { publicProcedure, router } from '../trpc';

export const helloRouter = router({
  greeting: publicProcedure
    .meta({ openapi: { method: 'GET', path: '/hello/greeting' } })
    .input(
      z.object({
        name: z.string().optional(),
      })
    )
    .output(z.object({ greeting: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `hello, ${input.name || 'world'}`,
      };
    }),
});
