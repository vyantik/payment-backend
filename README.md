# Payment API

## Installation

```bash
bun install --frozen-lockfile
```

## Environment variables

Create a `.env` file in the root of the project and add the following variables:

```bash
NODE_ENV='development'

# HTTP
HTTP_PORT=4000
HTTP_HOST='http://localhost:4000'
HTTP_CORS='http://localhost:3000'

# JWT
JWT_SECRET='tvoroznie_nishtyaki'
JWT_ACCESS_TOKEN_TTL='2h'
JWT_REFRESH_TOKEN_TTL='7d'

# Cookies
COOKIES_SECRET='nishtyaki_tvoroznie'
COOKIES_DOMAIN='localhost'

# Postgres
POSTGRES_USER='postgres'
POSTGRES_PASSWORD='your_database_password'
POSTGRES_HOST='localhost'
POSTGRES_PORT=5433
POSTGRES_DATABASE='payment-backend'
POSTGRES_URI='postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@
${POSTGRES_HOST}:${POSTGRES_PORT}/${POSTGRES_DATABASE}'
```

## Running the app

```bash
# development
$ bun run start

# watch mode
$ bun run start:dev

# production mode
$ bun run start:prod
```

## Test

```bash
# unit tests
$ bun run test

# e2e tests
$ bun run test:e2e

# test coverage
$ bun run test:cov
```

## Support

Nest is an MIT-licensed open source project.
