#!/bin/sh

ROOT_DIR=$1


if [ -e $ROOT_DIR/backend/app ]; then
  ln -sfv $ROOT_DIR/config.json $ROOT_DIR/backend/app/config.json
fi

