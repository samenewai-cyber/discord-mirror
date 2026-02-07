import { NextResponse } from "next/server";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ guildId: string }> }
) {
  const { guildId } = await params;
  const token = process.env.DISCORD_TOKEN;

  if (!token) {
    return NextResponse.json(
      { error: "DISCORD_TOKEN is not configured" },
      { status: 500 }
    );
  }

  const headers = {
    Authorization: `Bot ${token}`,
    "Content-Type": "application/json",
  };

  try {
    const res = await fetch(
      `https://discord.com/api/v10/guilds/${guildId}/channels`,
      { headers }
    );

    if (!res.ok) {
      const err = await res.json();
      return NextResponse.json(
        { error: err.message || `HTTP ${res.status}` },
        { status: res.status }
      );
    }

    const channels = await res.json();

    if (!Array.isArray(channels)) {
      return NextResponse.json(
        { error: "Unexpected response from Discord" },
        { status: 500 }
      );
    }

    // Only return text channels (type 0) and categories (type 4) for context
    const textChannels = channels
      .filter((c: { type: number }) => c.type === 0)
      .map(
        (c: {
          id: string;
          name: string;
          type: number;
          position: number;
          parent_id?: string;
        }) => ({
          id: c.id,
          name: c.name,
          type: c.type,
          position: c.position,
          parent_id: c.parent_id,
        })
      )
      .sort(
        (a: { position: number }, b: { position: number }) =>
          a.position - b.position
      );

    return NextResponse.json(textChannels);
  } catch (e: unknown) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Unknown error" },
      { status: 500 }
    );
  }
}
