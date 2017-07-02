#!/bin/bash
echo "Dumping MySQL schema into db.sql"
mysqldump -u root -p --no-data PROSPECTOR > db.sql
