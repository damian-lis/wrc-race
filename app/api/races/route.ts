import { randomUUID } from "crypto";
import path from "path";
import fs from "fs/promises";
import { Race } from "@/types";

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), "app/api/races/races.json");
    const fileContents = await fs.readFile(filePath, "utf-8");
    const races = JSON.parse(fileContents);

    return new Response(JSON.stringify(races), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Failed to read races.json:", error);
    return new Response(JSON.stringify({ error: "Failed to read race data" }), { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    // Parse the request body
    const body = await request.json();

    const haveAllValues = Object.values(body).every((value) => Boolean(value));
    if (!haveAllValues) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), { status: 400 });
    }

    // Path to the JSON file
    const filePath = path.join(process.cwd(), "app/api/races/races.json");

    // Read existing races
    const fileContent = await fs.readFile(filePath, "utf-8");
    const races = JSON.parse(fileContent) as Race[];

    // Create new race entry, generating a new ID
    const newRace: Race = {
      id: randomUUID(), // generate a new UUID
      ...body,
    };

    // Add new race to the array
    races.push(newRace);

    // Write updated races back to file
    await fs.writeFile(filePath, JSON.stringify(races, null, 2), "utf-8");

    return new Response(JSON.stringify(newRace), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Failed to update races.json:", error);
    return new Response(JSON.stringify({ error: "Failed to update race data" }), { status: 500 });
  }
}
