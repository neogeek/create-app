import type { NextApiRequest, NextApiResponse } from 'next/types';

import { ReasonPhrases, StatusCodes } from 'http-status-codes';

import { purgeExpiredTokens } from '../../../modules/auth/controller';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    try {
      const { authorization } = req.headers;

      if (authorization === `Bearer ${process.env.API_SECRET_KEY}`) {
        await purgeExpiredTokens();

        res.status(StatusCodes.OK).json(ReasonPhrases.OK);
      } else {
        res.status(StatusCodes.UNAUTHORIZED).json(ReasonPhrases.UNAUTHORIZED);
      }
    } catch (err) {
      if (err instanceof Error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
          statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
          message: err.message,
        });
      }
    }
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
  }
}
