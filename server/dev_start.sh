#!/bin/bash

# Note: hot reloading and clustering don't always work well together so you may want to disable clustering in dev
export NODE_HOT_RELOAD=1
export NODE_LOGGER_GRANULARLEVELS=1

if jshint server.js; then
    ./start.sh
else
    echo Server not started because of lint errors
fi
