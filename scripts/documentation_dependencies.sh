#!/bin/bash

set -e
TEMP_DIR=$(mktemp -d)

RCLONE_SHA256SUM="e4b7a63ca6fa2bee37cbb33afeaa3fa60be2c595ef95a0b262ad8c8e770ea3b3  rclone-v1.48.0-linux-amd64.deb"
HUGO_SHA256SUM="afab8eaf12a9d72a072288f4ec5012cd889374cd56a855639b6ee1ba1686d174  hugo_0.55.6_Linux-64bit.deb"

curl --output $TEMP_DIR/rclone-v1.48.0-linux-amd64.deb -L "https://github.com/ncw/rclone/releases/download/v1.48.0/rclone-v1.48.0-linux-amd64.deb"
(cd $TEMP_DIR && echo $RCLONE_SHA256SUM | sha256sum -c || exit 1)
sudo apt-get install -y $TEMP_DIR/rclone-v1.48.0-linux-amd64.deb

curl --output $TEMP_DIR/hugo_0.55.6_Linux-64bit.deb -L "https://github.com/gohugoio/hugo/releases/download/v0.55.6/hugo_0.55.6_Linux-64bit.deb"
(cd $TEMP_DIR && echo $HUGO_SHA256SUM | sha256sum -c || exit 1)
sudo apt-get install -y $TEMP_DIR/hugo_0.55.6_Linux-64bit.deb
