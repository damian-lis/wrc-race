import { NextRequest } from 'next/server';
import { getRedisClient } from '@/lib/redis';
import { Race } from '@/types';

type Params = { params: Promise<{ id: string }> };

export async function PUT(request: NextRequest, { params }: Params) {
  try {
    const body = await request.json(); // { name, date, … } – no id expected
    if (!body) {
      return Response.json({ error: 'Missing body' }, { status: 400 });
    }

    const redis = getRedisClient();
    const races: Race[] = JSON.parse((await redis.get('races')) ?? '[]');

    const { id } = await params;
    const idx = races.findIndex((r) => String(r.id) === String(id));

    if (idx === -1) {
      return Response.json({ error: 'Race not found' }, { status: 404 });
    }

    // build the new version, keeping the original id
    const updated: Race = {
      ...races[idx], // everything that exists now
      ...body, // overwrite the fields that came from the client
      id: races[idx].id, // guarantee the id stays unchanged
    };

    races[idx] = updated;
    await redis.set('races', JSON.stringify(races));

    return Response.json(updated, { status: 200 });
  } catch (err) {
    console.error('Failed to update race', err);
    return Response.json({ error: 'Internal error' }, { status: 500 });
  }
}

export async function DELETE(_request: NextRequest, { params }: Params) {
  try {
    // 1. Grab the race id from the dynamic route segment
    const { id } = await params;

    if (!id) {
      return new Response(
        JSON.stringify({ error: 'Missing race id in route parameters!' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } },
      );
    }

    // 2. Fetch the array of races from Redis
    const redis = getRedisClient();
    const racesString = await redis.get('races');
    const races: Race[] = racesString ? JSON.parse(racesString) : [];

    // 3. Locate the race to delete
    const raceIndex = races.findIndex((r) => r.id === id);

    if (raceIndex === -1) {
      return new Response(JSON.stringify({ error: 'Race not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // 4. Remove the race and persist the new array
    const [deletedRace] = races.splice(raceIndex, 1);
    await redis.set('races', JSON.stringify(races));

    // 5. Return the deleted record (or switch to 204 No Content if you prefer)
    return new Response(JSON.stringify(deletedRace), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Failed to delete race from Redis:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to delete race data' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      },
    );
  }
}
