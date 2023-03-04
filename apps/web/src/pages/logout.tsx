import type { NextApiRequest, NextApiResponse } from 'next/types';

import { authRouter } from '../server/routers/auth';

export const getServerSideProps = async ({
  req,
  res,
}: {
  req: NextApiRequest;
  res: NextApiResponse;
}) => {
  try {
    await authRouter.createCaller({ req, res }).logout();
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.log(error);
    }
  }

  return {
    redirect: {
      destination: '/',
      permanent: false,
    },
  };
};

export default function Logout() {
  return null;
}
