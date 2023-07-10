// const redis = require('redis');

// // // Create a new Redis client
// // const client = redis.createClient({
// //   host: 'localhost', // Redis server host
// //   port: 6379, // Redis server port
// //   password: '', // Redis server password (if applicable)
// // });

// // // Redis client event handlers
// // client.on('connect', () => {
// //   console.log('Connected to Redis');
// // });

// // client.on('error', (error) => {
// //   console.error('Redis error:', error);
// // });

// // module.exports = client;

// const Redis = require("ioredis");
// // const redisClient = new Redis();
// const redisClient = redis.createClient({
//     host: 'localhost', // Redis server host
//     port: 6379, // Redis server port
//     password: '', // Redis server password (if applicable)
//   });
  

// export default redisClient;



// =========================
// const redis = require('redis');

// const redisClient = redis.createClient({});

// redisClient.connect().then(()=> {
//     console.log("redis client is connected");
// }).catch(() => {
//     console.log("redis client is not connected");
// })
// export default redisClient;


// // Create a Redis client
// const redis = require('redis');

// // Create a Redis client
// const redisClient = redis.createClient();

// // Connect to Redis
// redisClient.on('connect', () => {
//   console.log('Redis client is connected');
// });

// // Handle Redis connection errors
// redisClient.on('error', (err) => {
//   console.error('Redis client error:', err);
// });

// // Export the Redis client
// module.exports = redisClient;

// ==================================
const redis = require('redis');
const redisClient = redis.createClient();

// Connect to Redis
redisClient.connect().then(()=> {
  console.log("redis client is connected");
}).catch(() => {
  console.log("redis client is not connected");
})
module.exports = redisClient