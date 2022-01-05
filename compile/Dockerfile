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
# Install the DHT library AND its dependency
RUN cd arduino-1.8.5/libraries && wget -c https://codeload.github.com/adafruit/DHT-sensor-library/tar.gz/refs/tags/1.4.3 -O - | tar -xz && wget -c https://codeload.github.com/adafruit/Adafruit_Sensor/tar.gz/refs/tags/1.1.4 -O - | tar -xz

# Bundle app source
COPY ./src .

# Run when container is started
CMD node cluster.js