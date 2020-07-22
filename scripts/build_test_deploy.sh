#!/bin/bash

set -e

image_name=$IMAGE_NAME
image_tag=$IMAGE_TAG
app_name=$APP_NAME
app_type=$APP_TYPE
github_token=$GITHUB_TOKEN

requiredParams=($image_name $image_tag $app_name $app_type $github_token $HEROKU_API_KEY)
if [[ "${#requiredParams[@]}" != 6 ]]; 
then 
    echo "Not all environment vars were set!"
    exit 1
fi;

gpr_image_name="docker.pkg.github.com/stem-c/casmm/$image_name"
heroku_image_name="registry.heroku.com/$app_name/$app_type"

# Build and tag image 
echo $GITHUB_TOKEN | docker login docker.pkg.github.com -u $GITHUB_ACTOR --password-stdin
docker pull "$gpr_image_name" || true
docker build -t "$gpr_image_name:$image_tag" -t "$gpr_image_name:latest" -t "$heroku_imgae_name" --cache-from "$gpr_image_name" .

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

# Push gpr image
docker push "$gpr_image_full_name"

# Push heroku image
heroku container:login
docker push "$heroku_image_name"
heroku container:release -a "$app_name" web