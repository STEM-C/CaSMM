#!/bin/bash

set -e

image_name=$IMAGE_NAME
image_tag=$IMAGE_TAG
app_name=$APP_NAME
app_type=$APP_TYPE

valid=true
for param in image_name image_tag app_name app_type HEROKU_API_KEY
do
    if [[ -n param ]];
    then
        echo "missing $param"
        valid=false
    fi;
done

if [[ "$valid" = false ]]; 
then 
    echo "set all environment vars!"
    exit 1
fi;

gpr_image_name="docker.pkg.github.com/stem-c/casmm/$image_name"
heroku_image_name="registry.heroku.com/$app_name/$app_type"

# Build and tag image 
echo ${{ secrets.GITHUB_TOKEN }} | docker login docker.pkg.github.com -u $GITHUB_ACTOR --password-stdin
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