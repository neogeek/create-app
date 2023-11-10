> ⚠️ Notice: This repository is under active development. Things will be missing, broken, or incomplete as development continues.

<h1 align="center">
    <img src="./splash.png" alt="@neogeek/create-app - Next.js, TypeScript, tRPC, zod, Prisma and more." width="700" />
</h1>

<div align="center">

[![Join the chat at](https://img.shields.io/badge/discord-join%20chat-7289DA.svg)](https://discord.gg/nNtFsfd)
[![Tests](https://github.com/neogeek/create-app/actions/workflows/test.workflow.yml/badge.svg)](https://github.com/neogeek/create-app/actions/workflows/test.workflow.yml)
[![MIT License](https://img.shields.io/badge/license-MIT-brightgreen)](https://github.com/neogeek/create-app/blob/main/LICENSE)

</div>

<div align="center">

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fneogeek%2Fcreate-app&env=DATABASE_URL,GCP_OAUTH_CLIENT_ID,GCP_OAUTH_CLIENT_SECRET,GCP_OAUTH_REDIRECT_URL,JWT_ACCESS_TOKEN_PRIVATE_KEY,JWT_ACCESS_TOKEN_PUBLIC_KEY,JWT_REFRESH_TOKEN_PRIVATE_KEY,JWT_REFRESH_TOKEN_PRIVATE_KEY,API_SECRET_KEY&demo-title=%40neogeek%2Fcreate-app&demo-url=https%3A%2F%2Fcreate-app-vercel-demo.vercel.app%2F)
[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/neogeek/create-app)

</div>

## What is this?

This repo is my heavily opinionated starter template. Every so often I like to revisit what my tech stack consists of and currently this is it. The focus of this project is to maintain a base set of functionality for creating a bleeding edge app in Next.js with end to end type safety and testing built in.

Everyone is welcome to use this starter template, report bugs, and suggest changes. Keep in mind that this is my personal tech stack, so I might not implement all suggestions.

## Tech Stack

- ▲ [Turborepo](https://turbo.build/repo) - Monorepo support
- ▲ [Next.js 14](https://nextjs.org/) - React framework
- 🦺 [TypeScript](https://www.typescriptlang.org/) - Type safety code base
- 📦 [tRPC](https://trpc.io/) - Type safe client and server side API requests
- 🎯 [trpc-openapi](https://github.com/jlalmes/trpc-openapi) - Dynamic REST endpoints and automatic Swagger documentation
- 💎 [zod](https://zod.dev/) - Data validation and parsing
- ✅ [validator](https://github.com/validatorjs/validator.js) - String validation types
- 🏔️ [Prisma](https://www.prisma.io/) - Database ORM
  - 🗄️ [Postgres](https://www.postgresql.org/) - Local database
  - ⚡️ [Supabase](https://supabase.com/) - Remote database
  - 🪐 [PlanetScale](https://planetscale.com/) - Optional remote database
- 🍃 [Tailwind CSS](https://tailwindcss.com/) - Utility styles
- 📝 [Tailwind Forms Plugin](https://github.com/tailwindlabs/tailwindcss-forms) - Form utility styles
- 🪄 [Framer Motion](https://www.framer.com/motion/) - CSS animations
- 🃏 [Jest](https://jestjs.io/) - Unit tests
- 🚨 [Sentry](https://sentry.io/) - Server and client side error logging
- 📘 [Storybook](https://storybook.js.org/) - Component library
  - 🐙 [Testing Library](https://testing-library.com/) - Testing library for UI components
- 🎭 [Playwright](https://playwright.dev/) - Running end to end tests on the web app
- 🎛️ [Github Actions](https://github.com/features/actions) - Continuous integration testing
- 🐳 [Docker](https://www.docker.com/) - Optional local development
  - 🌊 [DigitalOcean](https://www.digitalocean.com/) - Remote deployment with Docker
- ▲ [Turborepo](https://turbo.build/repo) - Monorepo support
- ▲ [Vercel](https://vercel.com/) - Remote deployment
- 🌎 [Netlify](https://www.netlify.com/) - Remote deployment

## Getting Started

1. Fork, "Use this template" via GitHub or clone locally and remove remote to create a repo.
1. Install dependencies with `npm ci`.
1. Create an `.env.local` file in `./apps/web/` with the contents of `.env.example`
1. Generate JWT keys by running `./apps/web/bin/generate_jwt_keys.sh <password>`.
1. Setup Google OAuth for your app <https://support.google.com/cloud/answer/6158849> and copy the `id` and `secret` into `.env.local`.
1. Add <http://localhost:3000/oauth/google/callback> to the list of **Authorized redirect URIs** for your Google OAuth web application.
1. Generate the database types with `npm run db:generate` (if you have VS Code open, run TypeScript: Reload project to see the updated types)
1. Setup the database with `npm run db:push`
1. Run with `npm run dev`

## Database

### Postgres

1. Install [Postgres](https://www.postgresql.org/)
1. Create `create-app` database
1. Setup the database with `npm run db:push`

### [supabase](https://supabase.com/)

1. Create database
1. Go to Project Settings > Database
1. Copy and paste the connection string into `.env.local` as the value for `DATABASE_URL`
1. Replace `[YOUR-PASSWORD]` with your password you made when creating the database.
1. Append `?pgbouncer=true` to the connection string if Connection Pooling is enabled.
1. Push changed to database with `npm run db:push`

### [PlanetScale](https://planetscale.com/)

1. Create database
1. Go to Settings > Password
1. Create new password
1. Supply a name for the password
1. Hit generate password
1. Change the Connection string dropdown to `Prisma`
1. Copy and paste the URL into `.env.local`
1. Open `packages/database/prisma/schema.prisma` and update the datasource value to the following:

   ```
   datasource db {
    provider     = "mysql"
    url          = env("DATABASE_URL")
    relationMode = "prisma"
   }
   ```

1. Push changed to database with `npm run db:push`

## Logging

### Sentry

It's recommended that when setting up Sentry that you limit the allowed domains in your project settings so only logs from your application can be logged.

## Docker

The included docker setup can be used for developing on a machine without Node.js or Postgres installed. It can also be modified to be deployed to an online service, like DigitalOcean.

#### Build and run images

```bash
$ docker compose up --detach
```

#### Cleanup

```bash
$ docker compose down
```

## Testing

### Jest

Jest tests are setup to work both locally and via GitHub Actions.

Run the following to run all tests that match `*.test.ts` or `*.test.tsx`.

```bash
$ npm test
```

Or if you want to run a specific file:

```bash
$ npm test -- -- ./apps/web/src/modules/auth/controller.test.ts
```

### Storybook

Storybook testing requires storybook to be built and the static storybook running on a server in the background. The following command does all of this for you to prevent having to have two terminal windows open.

```bash
$ npm run test:styleguide
```

If you would like to run the tests in two terminal windows you can run the following commands:

```bash
$ npm run storybook-static
```

```bash
$ npm run test-storybook
```

### GitHub Actions

GitHub Actions workflows will lint all files, attempt a build and then run all unit tests. This workflow will run either when commits are pushed directly to the main branch or when a Pull Request is created (not a draft).

## Questions

If you have any questions regarding the use of **@neogeek/create-app**, please use either [GitHub Discussions](https://github.com/neogeek/create-app/discussions/) or [Discord server](https://discord.gg/nNtFsfd). The issue tracker is to be used for bug reports and feature requests only.

## Contributing

Be sure to review the [Contributing Guidelines](./CONTRIBUTING.md) before logging an issue or making a pull request.

## Troubleshooting

### `prepared statement \"s0\" already exists`

If you are having issues making database requests to your Supabase database, make sure you are using the correct connection string (pooled or unpooled). See this ticket for more information <https://github.com/prisma/prisma/issues/12121> and the [Prisma documentation](https://www.prisma.io/docs/guides/performance-and-optimization/connection-management/configure-pg-bouncer#add-pgbouncer-to-the-connection-url).

```
DATABASE_URL=postgresql://USER:PASSWORD@HOST:PORT/DATABASE?pgbouncer=true"
```

## License

[MIT](./LICENSE)
