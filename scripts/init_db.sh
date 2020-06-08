#!/bin/bash

set -e

if [ -z "${APP_ENVIRONMENT}" ]; then

    echo "No app environment set. Building database from scratch."
elif [ "${APP_ENVIRONMENT}" == "review" ]; then

    echo "Heroku review app - ${DATABASE_URL} - ${APP_ENVIRONMENT}" 
    psql ${DATABASE_URL} < ./test_db.dump > output.txt
    echo "Successfully imported test_db.dump in the ${APP_ENVIRONMENT} environment."
else

    dump=""
    if [ "${APP_ENVIRONMENT}" == "development" ] ; then
        dump="dev_db.dump"
    elif [ "${APP_ENVIRONMENT}" == "test" ]; then
        dump="test_db.dump"
    fi

    psql -v ON_ERROR_STOP=1 strapi < /docker-entrypoint-initdb.d/$dump
    echo "Successfully imported $dump in ${APP_ENVIRONMENT} environment."
fi