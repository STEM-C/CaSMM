# Start from the node image
FROM node:latest

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./
COPY yarn.lock ./
RUN yarn install

# Port mapping
EXPOSE 5000

# Run when the container is started
CMD ["yarn", "run", "start"]