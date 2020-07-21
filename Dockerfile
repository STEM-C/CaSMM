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
# final stage
#
FROM strapi/base

WORKDIR /usr/src/app
COPY ./server/package.json .
COPY ./server/yarn.lock .
RUN yarn install
COPY ./server .
ENV NODE_ENV production
RUN yarn build
RUN rm -rf ./public/frontend \
    mkdir ./public/frontend 
COPY --from=client /client/build ./public/frontend
CMD yarn start