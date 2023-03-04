import { z } from 'zod';

import validator from 'validator';

import { getProfile, updateProfile } from '../../modules/profile/controller';

import { protectedProcedure, router } from '../trpc';

export const profileRouter = router({
  updateProfile: protectedProcedure
    .input(
      z.object({
        username: z.preprocess(
          val => String(val).toLowerCase(),
          z
            .string()
            .trim()
            .min(1)
            .max(100)
            .refine(
              val => validator.isAlphanumeric(val),
              'Must contain only letters and numbers.'
            )
        ),
        displayName: z.string().trim().min(1).max(100),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const user = await updateProfile(
        ctx.user.userId,
        input.username,
        input.displayName
      );

      return {
        user,
      };
    }),
  getProfile: protectedProcedure.query(async ({ ctx }) => {
    const user = await getProfile(ctx.user.userId);

    return {
      user,
    };
  }),
});
