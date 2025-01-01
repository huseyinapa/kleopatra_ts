import Redis from "ioredis";
import Logger from "./logger";
import { NODE_ENV } from "./api";

const REDIS_URL = process.env.REDIS_URL || "redis://localhost:6379";

export const redisClient = new Redis(REDIS_URL);

redisClient.on("error", (err) => {
  if (NODE_ENV === "development")
    Logger.log("Redis connection error:" + err, "error");
});
