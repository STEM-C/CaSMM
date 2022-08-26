FROM strapi/base
FROM node:14

WORKDIR /usr/src/app/client
COPY ./client/package.json .
COPY ./client/yarn.lock .
RUN yarn install
COPY ./client .
RUN PUBLIC_URL=/client yarn build

WORKDIR /usr/src/app
COPY ./server/package.json .
COPY ./server/yarn.lock .
RUN yarn install
COPY ./server .
ENV NODE_ENV production
RUN PUBLIC_URL=/api yarn build
RUN mv ./client/build/* ./public/client \
    && rm -rf ./client
CMD yarn start