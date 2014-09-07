#!/bin/bash

if [ !$NODE_LAUNCH_SCRIPT ]; then
  export NODE_LAUNCH_SCRIPT="server.coffee"
fi

forever stop $NODE_LAUNCH_SCRIPT
