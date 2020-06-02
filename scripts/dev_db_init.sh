#!/bin/bash

set -e

psql -v ON_ERROR_STOP=1 strapi < /docker-entrypoint-initdb.d/dev_db.dump

echo Successfully imported dev db