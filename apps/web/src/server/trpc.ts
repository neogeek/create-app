import { ZodError, z } from 'zod';

import { TRPCError, initTRPC } from '@trpc/server';

import { OpenApiMeta } from 'trpc-openapi';

import SuperJSON from 'superjson';

import {
  extractDataFromToken,
  serializeCookie,
} from '@neogeek/create-app-utils';

import { ContextType } from './context';

import { authMiddleware } from '../modules/auth/controller';
import { TokenSchema } from '../modules/auth/types';

import env from '../utils/env';

const t = initTRPC
  .meta<OpenApiMeta>()
  .context<ContextType>()
  .create({
    transformer: SuperJSON,
    errorFormatter({ shape, error }) {
      return {
        ...shape,
        data: {
          ...shape.data,
          zodError:
            error.code === 'BAD_REQUEST' && error.cause instanceof ZodError
              ? error.cause.flatten()
              : null,
        },
      };
    },
  });

const hasAccessToken = t.middleware(async ({ ctx, next }) => {
  try {
    const cookies = z
      .object({
        access_token: z.string(),
        refresh_token: z.string().optional(),
      })
      .or(
        z.object({
          access_token: z.string().optional(),
          refresh_token: z.string(),
        })
      )
      .parse(ctx.req?.cookies);

    const { access_token } = await authMiddleware(
      cookies.access_token,
      cookies.refresh_token
    );

    const user = TokenSchema.parse(extractDataFromToken(access_token));

    if (access_token) {
      ctx.res.setHeader('Set-Cookie', [
        serializeCookie(
          'access_token',
          access_token,
          60 * 20,
          env.NODE_ENV !== 'development'
        ),
      ]);
    }

    return next({
      ctx: {
        user,
      },
    });
  } catch {
    throw new TRPCError({ code: 'UNAUTHORIZED' });
  }
});

export const router = t.router;
export const publicProcedure = t.procedure;
export const protectedProcedure = t.procedure.use(hasAccessToken);
