import { generateOpenApiDocument } from 'trpc-openapi';

import { appRouter } from '../server/router';

export const openApiDocument = generateOpenApiDocument(appRouter, {
  title: 'create-app - tRPC OpenAPI',
  version: '0.0.1',
  baseUrl: 'http://localhost:3000/api',
});
