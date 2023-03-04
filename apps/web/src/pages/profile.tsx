import { TRPCError } from '@trpc/server';

import type { NextApiRequest, NextApiResponse } from 'next/types';

import { useState } from 'react';

import { motion } from 'framer-motion';

import { normalizeDates } from '@neogeek/create-app-utils';
import { useFlash } from '@neogeek/common-react-hooks';

import { Button, Input, Layout, PageHeader } from 'ui';

import { SiteFooter, SiteHeader, SiteNavigation } from '../components';

import { profileRouter } from '../server/routers/profile';

import { trpc } from '../client/trpcClient';

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

export default function Profile({
  user,
}: {
  user: { userId: number; username: string; displayName: string };
}) {
  const [username, setUsername] = useState(user.username);
  const [displayName, setDisplayName] = useState(user.displayName);

  const mutateProfile = trpc.profile.updateProfile.useMutation();

  const hasSaved = useFlash(mutateProfile.isSuccess);

  return (
    <>
      <SiteHeader />
      <SiteNavigation isLoggedIn={Boolean(user)} />

      <div className="page-wrapper">
        <PageHeader>Profile</PageHeader>

        <Layout>
          <form
            onSubmit={e => {
              e.preventDefault();

              mutateProfile.mutate({ username, displayName });
            }}
          >
            <fieldset>
              <div>
                <Input
                  type="text"
                  label="Username"
                  name="username"
                  id="username"
                  value={username}
                  required={true}
                  pattern="[a-z0-9]{1,}"
                  onChange={e => setUsername(e.target.value.toLowerCase())}
                  errors={mutateProfile.error?.data?.zodError?.fieldErrors}
                />
              </div>
              <div>
                <Input
                  type="text"
                  label="Display Name"
                  name="displayName"
                  id="displayName"
                  value={displayName}
                  required={true}
                  onChange={e => setDisplayName(e.target.value)}
                  errors={mutateProfile.error?.data?.zodError?.fieldErrors}
                />
              </div>
            </fieldset>
            <div className="flex items-center justify-between">
              <Button
                type="submit"
                disabled={!mutateProfile.isLoading && hasSaved}
              >
                Update Profile
              </Button>
              <motion.p
                animate={{
                  opacity: hasSaved ? 1 : 0,
                }}
                initial={{ opacity: 0 }}
                className="text-center font-medium text-green-700"
              >
                Saved Changes!
              </motion.p>
            </div>
          </form>
        </Layout>
      </div>

      <SiteFooter />
    </>
  );
}
