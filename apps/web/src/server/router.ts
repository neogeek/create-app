import { router } from './trpc';

import { authRouter } from './routers/auth';
import { profileRouter } from './routers/profile';
import { helloRouter } from './routers/hello';

export const appRouter = router({
  auth: authRouter,
  profile: profileRouter,
  hello: helloRouter,
});

export type AppRouter = typeof appRouter;
