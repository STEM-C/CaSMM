#!/bin/bash

set -e

if [ -z "${APP_ENVIRONMENT}" ]; then

    echo "No app environment set. Building database from scratch."
else

    dump=""
    if [ "${APP_ENVIRONMENT}" == "development" ] ; then
        dump="dev_db.dump"
    elif [ "${APP_ENVIRONMENT}" == "staging" ] || [ "${APP_ENVIRONMENT}" == "production" ]; then
        dump="test_db.dump"
    fi

    psql -v ON_ERROR_STOP=1 strapi < /docker-entrypoint-initdb.d/$dump
    echo "Successfully imported $dump in ${APP_ENVIRONMENT} environment."
fi