#!/bin/sh

docker build -f Dockerfile.build -t nionata/casmm-build .
docker push nionata/casmm-build

# GitHub Actions doesn't allow you to use public gpr images, for now use dockerhub
# - https://github.community/t/docker-pull-from-public-github-package-registry-fail-with-no-basic-auth-credentials-error/16358/40
# docker build -f Dockerfile.build -t docker.pkg.github.com/stem-c/casmm/build .
# docker push docker.pkg.github.com/stem-c/casmm/build