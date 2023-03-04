import { TRPCError } from '@trpc/server';

import type { NextApiRequest, NextApiResponse } from 'next/types';
import Link from 'next/link';

import { normalizeDates } from '@neogeek/create-app-utils';

import { PageHeader } from 'ui';

import { SiteFooter, SiteHeader, SiteNavigation } from '../components';

import { profileRouter } from '../server/routers/profile';

export const getServerSideProps = async ({
  req,
  res,
}: {
  req: NextApiRequest;
  res: NextApiResponse;
}) => {
  try {
    const { user } = await profileRouter
      .createCaller({ req, res })
      .getProfile();

    return {
      props: { user: normalizeDates(user) },
    };
  } catch (error) {
    if (error instanceof TRPCError) {
      if (error.code === 'UNAUTHORIZED') {
        return {
          redirect: {
            destination: '/login',
            permanent: false,
          },
        };
      }
    }

    return {
      props: {},
    };
  }
};

export default function Home({
  user,
}: {
  user: { userId: number; username: string; displayName: string };
}) {
  return (
    <>
      <SiteHeader />
      <SiteNavigation isLoggedIn={Boolean(user)} />

      <div className="page-wrapper">
        {user.displayName ? (
          <>
            <PageHeader>Welcome, {user.displayName}!</PageHeader>

            <p className="text-center">
              Thank you for filling out your{' '}
              <Link href="/profile">profile</Link>!
            </p>
          </>
        ) : (
          <>
            <PageHeader>Wecome!</PageHeader>

            <p className="text-center">
              Fill out your <Link href="/profile">profile</Link> to get started.
            </p>
          </>
        )}
      </div>

      <SiteFooter />
    </>
  );
}
