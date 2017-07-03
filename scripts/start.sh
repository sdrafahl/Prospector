#!/bin/bash

./scripts/redis.sh -start
echo "Starting Prospector"
sudo ../ npm start
