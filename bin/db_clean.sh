#!/bin/bash

DATABASE_NAME=create-app

psql -c "DROP DATABASE \"${DATABASE_NAME}\"" || exit 0
psql -c "CREATE DATABASE \"${DATABASE_NAME}\""
