import { createClient } from "redis";

let client: ReturnType<typeof createClient> | null = null;

export const getRedisClient = () => {
  if (!client) {
    client = createClient({
      url: process.env.REDIS_URL,
    });
    client.connect().catch(console.error);
  }
  return client;
};
