# Start from strapi base
FROM strapi/base

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./
COPY yarn.lock ./
RUN yarn install

# Bundle app source
COPY . .

# Set the env to prod for build
ENV NODE_ENV production

# Build the app
RUN yarn build

# Port mapping
EXPOSE 1337

# Run when the container is started
CMD yarn start