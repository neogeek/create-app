import { ReasonPhrases, StatusCodes } from 'http-status-codes';

import { z } from 'zod';

import type { NextApiRequest, NextApiResponse } from 'next';

const requestSchema = z.object({
  body: z.string(),
});

const headersSchema = z.object({
  dsn: z.string(),
});

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!process.env.SENTRY_DSN) {
    throw new Error('SENTRY_DSN env variable missing.');
  }

  const SENTRY_DSN_URL = new URL(process.env.SENTRY_DSN);

  try {
    const { body } = requestSchema.parse(req);

    const pieces = body.split('\n');

    const header = headersSchema.parse(JSON.parse(pieces[0]));

    const { host, pathname } = new URL(header.dsn);

    const projectId = pathname.substring(1);

    if (host !== SENTRY_DSN_URL.host) {
      throw new Error(`Sentry Tunnel: Invalid host: ${host}`);
    }

    if (projectId !== SENTRY_DSN_URL.pathname.substring(1)) {
      throw new Error(`Sentry Tunne: Invalid project id: ${projectId}`);
    }

    const sentryIngestURL = `https://${host}/api/${projectId}/envelope/`;

    const sentryResponse = await fetch(sentryIngestURL, {
      method: 'POST',
      body,
    });

    sentryResponse.headers.forEach((value, key) => res.setHeader(key, value));

    return res.status(sentryResponse.status).send(sentryResponse.body);
  } catch (e) {
    console.error(e);
  }

  return res
    .status(StatusCodes.BAD_REQUEST)
    .json({ status: ReasonPhrases.BAD_REQUEST });
}

export default handler;
