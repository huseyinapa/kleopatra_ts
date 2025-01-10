import Redis from "ioredis";
import Logger from "./logger";
import { NodeEnv } from "./api";

const REDIS_URL = process.env.REDIS_URL || "redis://localhost:6379";

export const redisClient = new Redis(REDIS_URL);

redisClient.on("error", (err) => {
  if (NodeEnv === "development")
    Logger.log("Redis connection error:" + err, "error");
});
