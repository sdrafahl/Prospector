#!/bin/bash
echo "Dumping MySQL schema into db.sql"
mysqldump -u root -p --no-data --databases PROSPECTOR > db.sql
