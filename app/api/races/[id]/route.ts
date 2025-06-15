import { NextRequest } from "next/server";
import { getRedisClient } from "@/lib/redis";

type Params = { params: Promise<{ id: string }> };

export async function PUT(request: NextRequest, { params }: Params) {
  try {
    const updatedRace = await request.json();

    if (!updatedRace) {
      return new Response(JSON.stringify({ error: "Missing updated race object!" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const redis = getRedisClient();

    const racesString = await redis.get("races");
    const races = racesString ? JSON.parse(racesString) : [];

    const { id } = await params;

    const raceIndex = races.findIndex((r) => r.id === id);

    if (raceIndex === -1) {
      return new Response(JSON.stringify({ error: "Race not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    races[raceIndex] = updatedRace;

    await redis.set("races", JSON.stringify(races));

    return new Response(JSON.stringify(races[raceIndex]), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Failed to update race in Redis:", error);
    return new Response(JSON.stringify({ error: "Failed to update race data" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
