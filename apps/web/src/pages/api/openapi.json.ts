import { NextApiRequest, NextApiResponse } from 'next';

import { StatusCodes } from 'http-status-codes';

import { openApiDocument } from '../../server/openapi';

const handler = (_: NextApiRequest, res: NextApiResponse) => {
  res.status(StatusCodes.OK).send(openApiDocument);
};

export default handler;
