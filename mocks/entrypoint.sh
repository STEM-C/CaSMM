#!/bin/sh

set -e

if [[ "$#" != 3 ]];
then 
    echo "Expecting 3 arguments, got $#!"
    exit 0
fi;

image_tag=$1
app_name=$2
github_token=$3

gpr_base="docker.pkg.github.com/stem-c/casmm"
heroku_base="registry.heroku.com/$app_name"

# Log into gpr
echo "$github_token" | docker login docker.pkg.github.com -u "$GITHUB_ACTOR" --password-stdin

# Name and build server image
gpr_server="$gpr_base/server"
heroku_server="$heroku_base/web"

docker pull "$gpr_server" || true
docker build -t "$gpr_server:$image_tag" -t "$gpr_server:latest" -t "$heroku_server" --cache-from "$gpr_server" .

# Name and build compile image
gpr_compile="$gpr_base/compile"
heroku_compile="$heroku_base/compile"

docker pull "$gpr_compile" || true
docker build -t "$gpr_compile:$image_tag" -t "$gpr_compile:latest" -t "$heroku_compile" --cache-from "$gpr_compile" -f ./compile/Dockerfile ./compile

# Test
# docker-compose up -d
# ready=false
# do
#     ready=docker-compose logs | grep "strapi ready"
# while ("$ready" = false)
# cd test 
# yarn functional
# yarn integration
# yarn performance

# Push gpr images
docker push "$gpr_server"
docker push "$gpr_compile"

# Login to heroku container registry
heroku container:login

# Push heroku image
docker push "$heroku_server"
docker push "$heroku_compile"

# Deploy app
heroku container:release -a "$app_name" web compile