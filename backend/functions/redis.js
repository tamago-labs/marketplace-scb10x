//redis is used to store temp cache

const Redis = require("redis")

const redisClient = Redis.createClient(
  {
    url: process.env.REDIS_CLIENT_URL,
  }
)

const connectToRedis = async () => {
  await redisClient.connect()
  console.log("Server connected to Redis.")
}

module.exports = { redisClient, connectToRedis }