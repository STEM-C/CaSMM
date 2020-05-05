#!/bin/sh
set -ea

if [ ! -d "node_modules" ]; then
    echo "Node modules not installed. Installing..."

    yarn install
fi

echo "Starting the client development server"

# Run the rest of the commands
exec "$@"