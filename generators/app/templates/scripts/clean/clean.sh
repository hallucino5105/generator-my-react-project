#!/bin/sh

SCRIPT_DIR=$(cd $(dirname $(readlink $0 || echo $0)); pwd)
PROJECT_DIR=$(cd $SCRIPT_DIR/../../..; pwd)
ROOT_DIR=$(cd $PROJECT_DIR/frontend; pwd)

rm -rf $ROOT_DIR/stag/*
rm -rf $ROOT_DIR/prod/*
rm -rf $ROOT_DIR/dist/*

