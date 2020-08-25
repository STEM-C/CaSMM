# Start from the node image
FROM node:latest

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package.json .
COPY yarn.lock .
RUN yarn

# Install arduino compiler
RUN curl https://downloads.arduino.cc/arduino-1.8.5-linux64.tar.xz | tar -xJ

# Bundle app source
COPY ./src .

# Run when container is started
CMD node cluster.js