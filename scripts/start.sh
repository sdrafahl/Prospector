#!/bin/bash

gnome-terminal -x bash -c "cd prospector;./scripts/redis.sh -start";
echo "Starting Prospector"
sudo npm start
