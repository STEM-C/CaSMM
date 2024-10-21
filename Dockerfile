FROM strapi/base
FROM node:20 as client-build

WORKDIR /usr/src/app/client
COPY ./client/package.json .
COPY ./client/yarn.lock .
RUN yarn install
COPY ./client .
RUN PUBLIC_URL=/client yarn build

FROM node:14 as server-build
WORKDIR /usr/src/app
COPY ./server/package.json .
COPY ./server/yarn.lock .
RUN yarn install
COPY ./server .
ENV NODE_ENV production
RUN PUBLIC_URL=/api yarn build

FROM node:14 as final
WORKDIR /usr/src/app
COPY --from=server-build /usr/src/app ./
COPY --from=client-build /usr/src/app/client/build ./public/client

CMD yarn start