###############
## ▲ Builder
###############

FROM --platform=linux/amd64 node:18.18-alpine AS builder

RUN apk update
RUN apk add --no-cache libc6-compat bash

RUN npm install npm@latest -g
RUN npm install turbo -g

WORKDIR /app

COPY . .

RUN turbo prune --scope=web --docker

###############
## ▲ Installer
###############

FROM --platform=linux/amd64 node:18.18-alpine AS installer

ARG PORT
ENV PORT=$PORT

ARG DATABASE_URL
ENV DATABASE_URL=$DATABASE_URL

ARG GCP_OAUTH_CLIENT_ID
ENV GCP_OAUTH_CLIENT_ID=$GCP_OAUTH_CLIENT_ID
ARG GCP_OAUTH_CLIENT_SECRET
ENV GCP_OAUTH_CLIENT_SECRET=$GCP_OAUTH_CLIENT_SECRET
ARG GCP_OAUTH_REDIRECT_URL
ENV GCP_OAUTH_REDIRECT_URL=$GCP_OAUTH_REDIRECT_URL

ARG JWT_ACCESS_TOKEN_PRIVATE_KEY
ENV JWT_ACCESS_TOKEN_PRIVATE_KEY=$JWT_ACCESS_TOKEN_PRIVATE_KEY
ARG JWT_ACCESS_TOKEN_PUBLIC_KEY
ENV JWT_ACCESS_TOKEN_PUBLIC_KEY=$JWT_ACCESS_TOKEN_PUBLIC_KEY
ARG JWT_REFRESH_TOKEN_PRIVATE_KEY
ENV JWT_REFRESH_TOKEN_PRIVATE_KEY=$JWT_REFRESH_TOKEN_PRIVATE_KEY
ARG JWT_REFRESH_TOKEN_PUBLIC_KEY
ENV JWT_REFRESH_TOKEN_PUBLIC_KEY=$JWT_REFRESH_TOKEN_PUBLIC_KEY

ARG SENTRY_DSN
ENV SENTRY_DSN=$SENTRY_DSN
ARG SENTRY_IGNORE_API_RESOLUTION_ERROR
ENV SENTRY_IGNORE_API_RESOLUTION_ERROR=$SENTRY_IGNORE_API_RESOLUTION_ERROR

ARG API_SECRET_KEY
ENV API_SECRET_KEY=$API_SECRET_KEY

RUN apk update
RUN apk add --no-cache libc6-compat bash

RUN npm install npm@latest -g
RUN npm install turbo -g

WORKDIR /app

COPY .gitignore .gitignore

COPY --from=builder /app/out/json/ .
COPY --from=builder /app/out/package-lock.json ./package-lock.json

RUN npm install

COPY --from=builder /app/out/full/ .

COPY turbo.json turbo.json

RUN turbo run build --filter=web

###############
## ▲ Runner
###############

FROM --platform=linux/amd64 node:18.18-alpine AS runner

RUN apk update
RUN apk add --no-cache libc6-compat bash

RUN npm install npm@latest -g

WORKDIR /app

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
USER nextjs

COPY --from=installer --chown=nextjs:nodejs /app .

CMD [ "npm", "start" ]
