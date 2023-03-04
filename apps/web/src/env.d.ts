declare namespace NodeJS {
  export interface ProcessEnv {
    // Node.js
    PORT?: string | undefined;
    NODE_ENV?: 'production' | 'development' | 'test' | undefined;

    // Prisma
    DATABASE_URL: string;

    // Google OAuth
    GCP_OAUTH_CLIENT_ID: string;
    GCP_OAUTH_CLIENT_SECRET: string;
    GCP_OAUTH_REDIRECT_URL: string;

    // JWT
    JWT_ACCESS_TOKEN_PRIVATE_KEY: string;
    JWT_ACCESS_TOKEN_PUBLIC_KEY: string;
    JWT_REFRESH_TOKEN_PRIVATE_KEY: string;
    JWT_REFRESH_TOKEN_PUBLIC_KEY: string;

    // Cron
    API_SECRET_KEY: string;

    // Next.js
    VERCEL_URL: string;

    // Sentry
    SENTRY_DSN: string;
  }
}
