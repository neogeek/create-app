#!/bin/bash

PROJECT_NAME=create-app

docker container stop $(docker ps -a -q --filter name="${PROJECT_NAME}") &>/dev/null

docker container rm $(docker ps -a -q --filter name="${PROJECT_NAME}") &>/dev/null

docker rmi $(docker images -q "${PROJECT_NAME}*") &>/dev/null

exit 0
