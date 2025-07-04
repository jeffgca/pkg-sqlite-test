#!/bin/bash

DB_DIR=`pwd`/data
SCHEMA_FILE=`pwd`/schema/schema.sql

# echo $DB_DIR
# echo $SCHEMA_FILE

echo "Running the build product."

./server -d $DB_DIR -s $SCHEMA_FILE

