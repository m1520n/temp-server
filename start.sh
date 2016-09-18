#!/bin/bash

if [ "$EUID" -ne 0 ]
  then echo "Please run as root"
  exit
fi

IMAGE="mongo"
CONTAINER="mongo-dev"
HOSTPORT=32768
GUESTPORT=27017
RUNNING=$(docker inspect --format="{{ .State.Running }}" $CONTAINER)

docker ps -a | grep $CONTAINER

if [ $? -eq 0 ]; then
  docker inspect --format="{{ .State.Running }}" $CONTAINER
  if [ "$RUNNING" == "true" ]; then
    echo "Container is running, stopping"
    docker stop $CONTAINER
  fi
  echo "Removing container"
  docker rm $CONTAINER
fi
docker run --name $CONTAINER -d -v /opt/mongo:/data/db -p $HOSTPORT:$GUESTPORT $IMAGE
