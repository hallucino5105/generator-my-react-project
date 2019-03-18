#!/bin/sh

SCRIPT_DIR=$(cd $(dirname $(readlink $0 || echo $0)); pwd)
ROOT_DIR=$SCRIPT_DIR/..


cd $ROOT_DIR

if [ ! -e $HOME/.nodebrew/current/bin/nodebrew ]; then
    curl -L git.io/nodebrew | perl - setup
    export PATH=$HOME/.nodebrew/current/bin:$PATH
    nodebrew install-binary stable
    nodebrew use stable
fi

npm run init
npm run build:prod

killall uwsgi
nohup uwsgi --ini uwsgi.conf > /dev/null 2>&1 &

