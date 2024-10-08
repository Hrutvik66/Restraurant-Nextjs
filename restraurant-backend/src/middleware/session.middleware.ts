// src/middlewares/session.middleware.ts
import session from "express-session";
import Redis from "ioredis";
import { RequestHandler } from "express";
import RedisStore from "connect-redis";

// Create Redis client
export const redisClient = new Redis({
  port: 6379, // Redis port
  host: "127.0.0.1", // Redis host
  username: "default", // needs Redis >= 6
  password: "my-top-secret",
  db: 0, // Defaults to 0
});

redisClient.on("connect", () => {
  console.log("Connected to Redis");
});

redisClient.on("error", (err) => {
  console.error("Redis error: ", err);
});

// Configure session middleware
const sessionMiddleware: RequestHandler = session({
  store: new RedisStore({ client: redisClient }),
  secret: "CartRedisSessionStorage", // Use a strong secret in production
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false, // Set true if using HTTPS
    httpOnly: true,
    maxAge: 86400000, // 1 day
  },
});

export default sessionMiddleware;
