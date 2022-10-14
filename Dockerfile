FROM strapi/base
FROM node:14

RUN curl -f https://get.pnpm.io/v6.16.js | node - add --global pnpm

WORKDIR /usr/src/app/client

COPY pnpm-lock.yaml ./
COPY .npmrc ./
RUN pnpm fetch --prod

ADD ./client .
RUN pnpm install --prod
RUN PUBLIC_URL=/client pnpm build

WORKDIR /usr/src/app
COPY .npmrc ./
COPY ./server/package.json .
RUN pnpm install -r --prod
COPY ./server .
ENV NODE_ENV production
RUN PUBLIC_URL=/api pnpm build
RUN mv ./client/build/* ./public/client \
    && rm -rf ./client
CMD yarn start