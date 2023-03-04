import { faker } from '@faker-js/faker';

import {
  verifyAccessToken,
  verifyRefreshToken,
} from '@neogeek/create-app-utils';

import env from '../../utils/env';

import {
  authMiddleware,
  login,
  logout,
  purgeExpiredTokens,
} from './controller';

import {
  mockFetchResponse,
  setupFetchMock,
  teardownFetchMock,
} from '../../../test/utils/mocks';

describe('auth', () => {
  beforeAll(() => {
    setupFetchMock();
  });
  afterAll(() => {
    teardownFetchMock();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('authMiddleware', async () => {
    const emailAddress = faker.internet.email(
      undefined,
      undefined,
      'gmail.com'
    );

    mockFetchResponse({
      access_token: 'access_token',
      expires_in: 1000,
      refresh_token: 'refresh_token',
    });

    mockFetchResponse({
      email: emailAddress,
      picture: 'avatar.png',
    });

    const { access_token, refresh_token } = await login(
      emailAddress,
      'google_oauth'
    );

    expect(
      verifyRefreshToken(env.JWT_REFRESH_TOKEN_PUBLIC_KEY, refresh_token)
    ).toBeTruthy();

    await expect(authMiddleware(access_token, refresh_token)).resolves.toEqual(
      expect.objectContaining({ access_token })
    );

    // Delay between generating tokens
    await new Promise(resolve => setTimeout(resolve, 1000));

    mockFetchResponse({
      access_token: 'access_token',
      expires_in: Date.now() + 1000 * 1000,
      refresh_token: 'refresh_token',
    });

    await expect(authMiddleware(undefined, refresh_token)).resolves.toEqual(
      expect.objectContaining({
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        access_token: expect.not.stringMatching(access_token),
      })
    );
  });

  test('login', async () => {
    const emailAddress = faker.internet.email(
      undefined,
      undefined,
      'gmail.com'
    );

    mockFetchResponse({
      access_token: 'access_token',
      expires_in: 1000,
      refresh_token: 'refresh_token',
    });

    mockFetchResponse({
      email: emailAddress,
      picture: 'avatar.png',
    });

    const tokens = await login(emailAddress, 'google_oauth');

    expect(
      verifyAccessToken(env.JWT_ACCESS_TOKEN_PUBLIC_KEY, tokens.access_token)
    ).toBeTruthy();
    expect(
      verifyRefreshToken(env.JWT_REFRESH_TOKEN_PUBLIC_KEY, tokens.refresh_token)
    ).toBeTruthy();

    mockFetchResponse({
      access_token: 'access_token',
      expires_in: 1000,
      refresh_token: 'refresh_token',
    });

    mockFetchResponse({
      email: emailAddress,
      picture: 'avatar.png',
    });

    // Delay between generating tokens
    await new Promise(resolve => setTimeout(resolve, 1000));

    const newTokens = await login(emailAddress, 'google_oauth');

    expect(newTokens).not.toEqual(tokens);

    expect(
      verifyAccessToken(env.JWT_ACCESS_TOKEN_PUBLIC_KEY, newTokens.access_token)
    ).toBeTruthy();
    expect(
      verifyRefreshToken(
        env.JWT_REFRESH_TOKEN_PUBLIC_KEY,
        newTokens.refresh_token
      )
    ).toBeTruthy();
  });

  test('logout', async () => {
    const emailAddress = faker.internet.email(
      undefined,
      undefined,
      'gmail.com'
    );

    mockFetchResponse({
      access_token: 'access_token',
      expires_in: 1000,
      refresh_token: 'refresh_token',
    });

    mockFetchResponse({
      email: emailAddress,
      picture: 'avatar.png',
    });

    const { refresh_token } = await login(emailAddress, 'google_oauth');

    expect(
      verifyRefreshToken(env.JWT_REFRESH_TOKEN_PUBLIC_KEY, refresh_token)
    ).toBeTruthy();

    await expect(logout(refresh_token)).resolves.not.toThrowError();
  });

  test('purgeExpiredTokens', async () => {
    await expect(purgeExpiredTokens()).resolves.not.toThrowError();
  });
});
