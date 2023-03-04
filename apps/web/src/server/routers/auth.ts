import { z } from 'zod';

import { serializeCookie } from '@neogeek/create-app-utils';

import env from '../../utils/env';

import { login, logout } from '../../modules/auth/controller';

import { publicProcedure, router } from '../trpc';

export const authRouter = router({
  login: publicProcedure
    .input(
      z.object({
        code: z.string(),
        provider: z.enum(['google_oauth']),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { access_token, refresh_token } = await login(
        input.code,
        input.provider
      );

      ctx.res.setHeader('Set-Cookie', [
        serializeCookie(
          'access_token',
          access_token,
          60 * 20,
          env.NODE_ENV !== 'development'
        ),
        serializeCookie(
          'refresh_token',
          refresh_token,
          60 * 60 * 24 * 30,
          env.NODE_ENV !== 'development'
        ),
      ]);

      return null;
    }),
  logout: publicProcedure.mutation(async ({ ctx }) => {
    const cookies = z
      .object({ refresh_token: z.string().optional() })
      .parse(ctx.req.cookies);

    if (cookies.refresh_token) {
      try {
        await logout(cookies.refresh_token);
      } catch {
        console.log('Refresh token not found.');
      }
    }

    ctx.res.setHeader('Set-Cookie', [
      serializeCookie('access_token', '', -1, env.NODE_ENV !== 'development'),
      serializeCookie('refresh_token', '', -1, env.NODE_ENV !== 'development'),
    ]);
  }),
});
