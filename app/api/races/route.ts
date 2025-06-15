import { randomUUID } from "crypto";

import { getRedisClient } from "@/lib/redis";

export async function GET() {
  try {
    const redis = getRedisClient();

    const racesString = await redis.get("races");

    if (!racesString) {
      return new Response(JSON.stringify({ error: "No race data found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    const races = JSON.parse(racesString);

    return new Response(JSON.stringify(races), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Failed to read races from Redis:", error);
    return new Response(JSON.stringify({ error: "Failed to read race data" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const haveAllValues = Object.values(body).every((value) => Boolean(value));
    if (!haveAllValues) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const redis = getRedisClient();

    const racesString = await redis.get("races");
    const races = racesString ? JSON.parse(racesString) : [];

    const newRace = {
      id: randomUUID(),
      ...body,
    };

    races.push(newRace);

    await redis.set("races", JSON.stringify(races));

    return new Response(JSON.stringify(newRace), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Failed to update races in Redis:", error);
    return new Response(JSON.stringify({ error: "Failed to update race data" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
