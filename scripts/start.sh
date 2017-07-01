echo "Starting Reddis"
redis-server ../redis.conf
echo "Starting Prospector"
../npm start
