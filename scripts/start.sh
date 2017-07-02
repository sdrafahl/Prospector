#!/bin/bash

echo "Starting Reddis"
sudo redis-server .. redis.conf
echo "Starting Prospector"
sudo ../ npm start
