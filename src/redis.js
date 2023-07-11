const redis = require('redis');
const redisClient = redis.createClient();

// Connect to Redis
redisClient.connect().then(()=> {
  console.log("redis client is connected");
}).catch(() => {
  console.log("redis client is not connected");
})
module.exports = redisClient