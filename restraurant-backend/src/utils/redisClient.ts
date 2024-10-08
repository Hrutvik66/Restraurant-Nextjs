import Redis from "ioredis";

const redisClient = new Redis({
  host: "localhost", // Replace with your Redis host
  port: 6379, // Replace with your Redis port
  db: 0, // Replace with your Redis database index
});

export default redisClient;
