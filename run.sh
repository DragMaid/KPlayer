#!/bin/sh
fdate=$(date '+%Y-%m-%d')
nodemon -e html,css,js --ignore .git/ ,node_modules/ -- ./src/server-dev.js >> "./logs/$fdate.log"
#node ./src/server-dev.js
