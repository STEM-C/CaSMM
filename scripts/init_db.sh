#!/bin/bash

set -e

env=$ENVIRONMENT
db_url=$DATABASE_URL
script_path=$SCRIPT_PATH

if [[ -n $env ]] && [[ -n $db_url ]] && [[ -n $script_path ]];
then

    dump="${env}_db.dump"
    path="$script_path/$dump"

    if [[ -f $path ]]; 
    then 

        psql "$DATABASE_URL" < "$path"
        echo "Successfully imported $dump"
    else
        echo "Missing $dump" 
    fi;
else 
    echo "Missing environment variable(s):"
    echo "ENVIRONMENT=$env or DATABASE_URL=$db_url or SCRIPT_PATH=$script_path"
fi;