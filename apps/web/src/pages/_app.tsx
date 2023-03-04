import type { AppProps, NextWebVitalsMetric } from 'next/app';
import Head from 'next/head';

import '../styles/main.css';

import { ClientProvider } from '../client/trpcContext';

export function reportWebVitals(metric: NextWebVitalsMetric) {
  if (process.env.NODE_ENV === 'development') {
    console.log('Next.js Web Vitals', metric);
  }
}

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>@neogeek/create-app</title>
        <meta
          name="description"
          content="Next.js, TypeScript, tRPC, zod, Prisma and more."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <ClientProvider>
        <Component {...pageProps} />
      </ClientProvider>
    </>
  );
}
