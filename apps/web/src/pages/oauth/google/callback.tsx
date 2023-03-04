import type { NextApiRequest, NextApiResponse } from 'next/types';
import Head from 'next/head';

import { z } from 'zod';

import { getQueryParamsFromUrl } from '@neogeek/create-app-utils';

import { authRouter } from '../../../server/routers/auth';

export const getServerSideProps = async ({
  req,
  res,
}: {
  req: NextApiRequest;
  res: NextApiResponse;
}) => {
  try {
    const { url } = z.object({ url: z.string() }).parse(req);

    const { code } = z
      .object({ code: z.string() })
      .parse(getQueryParamsFromUrl(url));

    await authRouter.createCaller({ req, res }).login({
      code,
      provider: 'google_oauth',
    });

    return {
      props: {},
    };
  } catch {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }
};

export default function OauthCallback() {
  return (
    <>
      <Head>
        <meta httpEquiv="refresh" content="0; url=/" />
      </Head>
      <div>
        <p>Redirecting ...</p>
      </div>
    </>
  );
}
