#!/bin/sh

SCRIPT_DIR=$(cd $(dirname $(readlink $0 || echo $0)); pwd)
ROOT_DIR=$SCRIPT_DIR/..
PROJECT_DIR=$ROOT_DIR/..
PROJECT_NAME=$(echo ${PROJECT_DIR} | awk -F "/" '{ print $NF }')
WEB_CONF_PATH=/etc/nginx/conf.d/$PROJECT_NAME.conf
DIST=$(get_os_info | head -n1)


get_os_distribution() {
    if [ -e /etc/debian_version ] ||
       [ -e /etc/debian_release ]; then
        distri_name="debian"
    elif [ -e /etc/fedora-release ] ||
        [ -e /etc/redhat-release ]; then
        distri_name="redhat"
    elif [ -e /etc/arch-release ]; then
        distri_name="arch"
    elif [ -e /etc/turbolinux-release ]; then
        distri_name="turbol"
    elif [ -e /etc/SuSE-release ]; then
        distri_name="suse"
    elif [ -e /etc/mandriva-release ]; then
        distri_name="mandriva"
    elif [ -e /etc/vine-release ]; then
        distri_name="vine"
    elif [ -e /etc/gentoo-release ]; then
        distri_name="gentoo"
    else
        distri_name="unknown"
    fi

    echo ${distri_name}
}

get_os_bit() {
    echo $(uname -m);
}

get_os_info() {
   echo $(get_os_distribution)
   echo $(get_os_bit)
}

if [ $DIST = "redhat" ]; then
    yum install -y epel-release
    yum install -y python-devel python-setuptools mysql-devel psmisc nginx curl gcc
elif [ $DIST = "debian" ]; then
    apt update -y
    apt install -y python-dev python-setuptools libmysqlclient-dev psmisc nginx curl
else
    echo "unknown destribution"
fi

easy_install pip
pip install -r requirements.txt

ln -sfv $PROJECT_DIR /usr/local/

cp -a $ROOT_DIR/misc/conf/nginx/app.conf $WEB_CONF_PATH
sed -i -e "s|\[project path\]|/usr/local/$PROJECT_NAME|" $WEB_CONF_PATH

if [ $DIST = "redhat" ]; then
    systemctl enable nginx
    systemctl restart nginx
elif [ $DIST = "debian" ]; then
    service nginx start
fi

