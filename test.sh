#!/usr/bin/env bash

node index.js&
node_modules/.bin/jest --detectOpenHandles tests/acceptance/
kill %1
