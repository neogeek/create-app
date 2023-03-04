import {
  extractDataFromToken,
  generateAccessToken,
  generateExpireAtDate,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
} from '@neogeek/create-app-utils';

import type { SignOptions } from 'jsonwebtoken';

import { google } from '@neogeek/create-app-oauth-providers';

import type {
  GoogleOAuthProfileResponse,
  GoogleOAuthTokenResponse,
} from '@neogeek/create-app-oauth-providers/dist/providers/google';

import { GoogleOAuthTokenResponseSchema } from '@neogeek/create-app-oauth-providers/dist/providers/google';

import { prisma } from '../../utils/db';
import env from '../../utils/env';

import { ProviderType, TokenSchema } from './types';

const generateTokenOptions = (key: string): SignOptions => ({
  algorithm: key.length > 2048 ? 'RS256' : 'HS256',
  expiresIn: '15 minutes',
});

export const authMiddleware = async (
  access_token: string | undefined,
  refresh_token: string | undefined
) => {
  if (
    access_token &&
    verifyAccessToken(env.JWT_ACCESS_TOKEN_PUBLIC_KEY, access_token)
  ) {
    return { access_token };
  }

  if (
    refresh_token &&
    verifyRefreshToken(env.JWT_REFRESH_TOKEN_PUBLIC_KEY, refresh_token)
  ) {
    const { provider } = await prisma.token.findFirstOrThrow({
      where: {
        token: refresh_token,
        expiresAt: {
          gte: new Date(),
        },
      },
      include: {
        provider: true,
      },
    });

    if (provider.type === 'google_oauth') {
      const metaData = GoogleOAuthTokenResponseSchema.parse(provider.metaData);

      if (!metaData.refresh_token) {
        throw new Error('Missing refresh token');
      }

      const tokens = await google.refreshTokens(metaData.refresh_token, {
        client_id: env.GCP_OAUTH_CLIENT_ID,
        client_secret: env.GCP_OAUTH_CLIENT_SECRET,
      });

      await prisma.provider.update({
        where: {
          providerId: provider.providerId,
        },
        data: {
          metaData: { ...metaData, ...tokens },
        },
      });
    } else {
      throw new Error('Invalid OAuth provider.');
    }

    const tokenPayload = TokenSchema.parse(extractDataFromToken(refresh_token));

    const access_token = generateAccessToken(
      env.JWT_ACCESS_TOKEN_PRIVATE_KEY,
      tokenPayload,
      generateTokenOptions(env.JWT_ACCESS_TOKEN_PRIVATE_KEY)
    );

    return { access_token, refresh_token };
  }

  throw new Error('Unauthorized');
};

export const login = async (code: string, type: ProviderType) => {
  let tokens: GoogleOAuthTokenResponse;

  let profile: GoogleOAuthProfileResponse;

  if (type === 'google_oauth') {
    tokens = await google.getTokens(code, {
      client_id: env.GCP_OAUTH_CLIENT_ID,
      client_secret: env.GCP_OAUTH_CLIENT_SECRET,
      redirect_uri: env.GCP_OAUTH_REDIRECT_URL,
    });

    profile = await google.getProfile(tokens.access_token);
  } else {
    throw new Error('Invalid OAuth provider.');
  }

  const provider = await prisma.provider.findUnique({
    where: {
      name_type: {
        name: profile.email,
        type,
      },
    },
    include: {
      user: true,
    },
  });

  return provider
    ? await loginExistingUser(provider, tokens)
    : await loginNewUser(profile.email, type, tokens);
};

export const loginExistingUser = async (
  provider: { providerId: number; userId: number },
  metaData: GoogleOAuthTokenResponse
) => {
  const tokenPayload = TokenSchema.parse(provider);

  const access_token = generateAccessToken(
    env.JWT_ACCESS_TOKEN_PRIVATE_KEY,
    tokenPayload,
    generateTokenOptions(env.JWT_ACCESS_TOKEN_PRIVATE_KEY)
  );

  const refresh_token = generateRefreshToken(
    env.JWT_REFRESH_TOKEN_PRIVATE_KEY,
    tokenPayload,
    generateTokenOptions(env.JWT_REFRESH_TOKEN_PRIVATE_KEY)
  );

  await prisma.$transaction([
    prisma.provider.update({
      where: {
        providerId: provider.providerId,
      },
      data: {
        metaData,
      },
    }),
    prisma.token.create({
      data: {
        token: refresh_token,
        providerId: provider.providerId,
        expiresAt: generateExpireAtDate(),
      },
    }),
  ]);

  return { access_token, refresh_token };
};

export const loginNewUser = async (
  name: string,
  type: ProviderType,
  metaData: GoogleOAuthTokenResponse
) => {
  const user = await prisma.user.create({
    data: {
      Provider: {
        create: {
          name,
          type,
          metaData,
        },
      },
    },
    include: {
      Provider: true,
    },
  });

  if (user.Provider.length !== 1) {
    throw new Error('Error creating user.');
  }

  const { providerId } = user.Provider[0];

  const tokenPayload = TokenSchema.parse(user);

  const access_token = generateAccessToken(
    env.JWT_ACCESS_TOKEN_PRIVATE_KEY,
    tokenPayload,
    generateTokenOptions(env.JWT_ACCESS_TOKEN_PRIVATE_KEY)
  );

  const refresh_token = generateRefreshToken(
    env.JWT_REFRESH_TOKEN_PRIVATE_KEY,
    tokenPayload,
    generateTokenOptions(env.JWT_REFRESH_TOKEN_PRIVATE_KEY)
  );

  await prisma.token.create({
    data: {
      token: refresh_token,
      providerId,
      expiresAt: generateExpireAtDate(),
    },
  });

  return { access_token, refresh_token };
};

export const logout = async (refresh_token: string) => {
  try {
    await prisma.token.delete({
      where: {
        token: refresh_token,
      },
    });
  } catch {
    console.log('Refresh token not found.');
  }
};

export const purgeExpiredTokens = async () => {
  await prisma.token.deleteMany({
    where: {
      expiresAt: {
        gte: new Date(),
      },
    },
  });
};
