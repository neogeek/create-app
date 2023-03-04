import type { NextApiRequest, NextApiResponse } from 'next/types';
import Image from 'next/image';

import { TRPCError } from '@trpc/server';

import { googleOAuthUrl } from '@neogeek/create-app-oauth-providers/dist/providers/google';

import env from '../utils/env';

import { Layout, PageHeader } from 'ui';

import { SiteFooter, SiteHeader } from '../components';

import { profileRouter } from '../server/routers/profile';

export const getServerSideProps = async ({
  req,
  res,
}: {
  req: NextApiRequest;
  res: NextApiResponse;
}) => {
  try {
    await profileRouter.createCaller({ req, res }).getProfile();

    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  } catch (error) {
    if (error instanceof TRPCError) {
      if (error.code === 'UNAUTHORIZED') {
        return {
          props: {
            googleOAuthUrl: googleOAuthUrl(
              env.GCP_OAUTH_CLIENT_ID,
              env.GCP_OAUTH_REDIRECT_URL
            ),
          },
        };
      }
    }

    return {};
  }
};

export default function Login({ googleOAuthUrl }: { googleOAuthUrl: string }) {
  return (
    <>
      <SiteHeader />

      <div className="page-wrapper">
        <PageHeader>Sign in to your account</PageHeader>

        <Layout>
          <p>
            <button
              className="btn-social-network"
              data-provider="google"
              role="button"
              onClick={() => (window.location.href = googleOAuthUrl)}
            >
              <Image
                src="/images/oauth/google/logo.svg"
                width="18"
                height="18"
                className="btn-social-network-img"
                alt="Google Logo"
                unoptimized
              />
              Sign in with Google
            </button>
          </p>

          <p className="text-center text-sm text-gray-700">
            Only your email is stored for authorization.
          </p>
        </Layout>
      </div>

      <SiteFooter />
    </>
  );
}
