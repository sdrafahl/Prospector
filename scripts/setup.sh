#!/bin/bash

if [ $# -eq 0 ]
  then
    echo "No arguments supplied"
    echo "Please give a argument of your MySQL username"
    echo "If you do not have MySQL please download that."
    exit 1
fi

echo "Setting up the database..."
mysql -u $1 -p < db.sql
echo "Setting up NPM packages..."
sudo npm install
