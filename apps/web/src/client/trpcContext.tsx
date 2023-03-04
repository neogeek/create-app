'use client';

import React, { useMemo } from 'react';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { httpBatchLink, loggerLink } from '@trpc/client';

import SuperJSON from 'superjson';

import { trpc } from './trpcClient';

const getBaseUrl = () => {
  if (typeof window !== 'undefined') return '';
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return `http://localhost:${process.env.PORT ?? 3000}`;
};

export function ClientProvider({ children }: { children: React.ReactNode }) {
  const queryClient = useMemo(() => new QueryClient(), []);

  const trpcClient = useMemo(
    () =>
      trpc.createClient({
        transformer: SuperJSON,
        links: [
          loggerLink({
            enabled: () => process.env.NODE_ENV === 'development',
          }),
          httpBatchLink({
            url: `${getBaseUrl()}/api/trpc`,
            fetch: (url, options) =>
              fetch(url, {
                ...options,
                credentials: 'include',
              }),
          }),
        ],
      }),
    []
  );

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </trpc.Provider>
  );
}
