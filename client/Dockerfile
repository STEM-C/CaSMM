# Start from the node image
FROM node:latest

# Create app directory for volume
WORKDIR /usr/src/app
VOLUME /usr/src/app

# Port mapping
EXPOSE 3000

# Run script 
COPY docker-entrypoint.sh /usr/local/bin/
ENTRYPOINT ["docker-entrypoint.sh"]

# Run when the container is started
CMD ["yarn", "start"]