import { NextRequest } from "next/server";
import { Race } from "@/types"; // adjust your Race type import
import path from "path";
import { promises as fs } from "fs";

type Params = { params: Promise<{ id: string }> };

export async function PUT(request: NextRequest, { params }: Params) {
  try {
    const updatedRace = await request.json();

    if (!updatedRace) {
      return new Response(JSON.stringify({ error: "Missing updated race object!" }), {
        status: 400,
      });
    }

    const filePath = path.join(process.cwd(), "app/api/races/races.json");
    const fileContent = await fs.readFile(filePath, "utf-8");
    const races = JSON.parse(fileContent) as Race[];

    const { id } = await params;

    const raceIndex = races.findIndex((r) => r.id === id);

    if (raceIndex === -1) {
      return new Response(JSON.stringify({ error: "Race not found" }), {
        status: 404,
      });
    }

    races[raceIndex] = updatedRace;

    await fs.writeFile(filePath, JSON.stringify(races, null, 2), "utf-8");

    return new Response(JSON.stringify(races[raceIndex]), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Failed to update race:", error);
    return new Response(JSON.stringify({ error: "Failed to update race data" }), { status: 500 });
  }
}
