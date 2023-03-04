import type { CreateNextContextOptions } from '@trpc/server/adapters/next';
import type { inferAsyncReturnType } from '@trpc/server';

export function createContext(options: CreateNextContextOptions) {
  return {
    req: options.req,
    res: options.res,
  };
}

export type ContextType = inferAsyncReturnType<typeof createContext>;
