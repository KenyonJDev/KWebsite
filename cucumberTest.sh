#!/usr/bin/env bash

# force the script to exit on first fail
set -e

# create any directories needed by the test script
mkdir -p screenshots

# delete any local databases (if you are using them)
rm -rf *.db

# install packages if none found
# [ ! -d "node_modules" ] && echo "INSTALLING MODULES" && npm install

# start the web server in background mode
node index.js&

# run the test suite in background mode
node_modules/.bin/cucumber-js ./features -r ./steps &

# wait for the tests to complete
sleep 10

# kill the web server
taskkill -f -im node.exe
