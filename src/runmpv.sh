#!/bin/bash

pid=$(pidof "mpv")

if [[ "$pid" ]]; then
    wmctrl -x -R gl.mpv
    echo "{ \"command\": [\"loadfile\", \"$1\"] }" | socat - "/tmp/mpvsocket"
else
    mpv --no-video --ytdl-format=140 --log-file=./mpv.log --ytdl-raw-options=force-ipv4= --input-ipc-server=/tmp/mpvsocket "$1"
fi
