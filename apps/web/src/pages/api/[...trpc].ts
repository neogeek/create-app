import { StatusCodes } from 'http-status-codes';

import { NextApiRequest, NextApiResponse } from 'next';

import NextCors from 'nextjs-cors';

import { createOpenApiNextHandler } from 'trpc-openapi';

import { createContext } from '../../server/context';
import { appRouter } from '../../server/router';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  await NextCors(req, res, {
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
    origin: '*',
    optionsSuccessStatus: StatusCodes.OK,
  });

  return createOpenApiNextHandler({
    router: appRouter,
    createContext,
  })(req, res);
};

export default handler;
