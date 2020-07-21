#
# client stage
#
FROM node:latest as client

WORKDIR /client
COPY ./client/package.json .
COPY ./client/yarn.lock .
RUN yarn install
COPY ./client .
RUN PUBLIC_URL=/frontend yarn build

#
# server stage
#
FROM node:latest as server

WORKDIR /server
COPY ./server/package.json .
COPY ./server/yarn.lock .
RUN yarn install
COPY ./server .
RUN rm -rf ./public/frontend \
    mkdir ./public/frontend 
ENV NODE_ENV production
RUN yarn build

#
# final stage
#
FROM strapi/base

WORKDIR /usr/src/app
COPY --from=server /server .
COPY --from=client /client/build ./public/frontend
EXPOSE 1337
CMD yarn start