#!/bin/sh

ROOT_DIR=$1


if [ -e $ROOT_DIR/prod ]; then
  ln -sfv $ROOT_DIR/VERSION $ROOT_DIR/prod/VERSION
fi

if [ -e $ROOT_DIR/dist ]; then
  ln -sfv $ROOT_DIR/VERSION $ROOT_DIR/dist/VERSION
fi

