import z from 'zod';

export const envSchema = z.object({
  // Node.js
  PORT: z.string().optional(),
  NODE_ENV: z.enum(['production', 'development', 'test']).optional(),

  // Prisma
  DATABASE_URL: z.string(),

  // Google OAuth
  GCP_OAUTH_CLIENT_ID: z.string(),
  GCP_OAUTH_CLIENT_SECRET: z.string(),
  GCP_OAUTH_REDIRECT_URL: z.string(),

  // JWT
  JWT_ACCESS_TOKEN_PRIVATE_KEY: z.string(),
  JWT_ACCESS_TOKEN_PUBLIC_KEY: z.string(),
  JWT_REFRESH_TOKEN_PRIVATE_KEY: z.string(),
  JWT_REFRESH_TOKEN_PUBLIC_KEY: z.string(),

  // Cron
  API_SECRET_KEY: z.string(),

  // Next.js
  VERCEL_URL: z.string().optional(),

  // Sentry
  SENTRY_DSN: z.string().optional(),
});

export default envSchema.parse(process.env);
