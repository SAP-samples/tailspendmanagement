#!/bin/bash
mkdir -p gen/pg/db
# Works only the first time until https://github.com/cap-js/cds-dbs/issues/100 is fixed
# cp -r db/data gen/pg
cp db-deployer/package.json gen/pg/package.json
