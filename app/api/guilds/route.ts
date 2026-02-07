import { NextResponse } from "next/server";

export async function GET() {
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
      "https://discord.com/api/v10/users/@me/guilds",
      { headers }
    );

    if (!res.ok) {
      const err = await res.json();
      return NextResponse.json(
        { error: err.message || `HTTP ${res.status}` },
        { status: res.status }
      );
    }

    const guilds = await res.json();

    if (!Array.isArray(guilds)) {
      return NextResponse.json(
        { error: "Unexpected response from Discord" },
        { status: 500 }
      );
    }

    const simplified = guilds.map(
      (g: { id: string; name: string; icon: string | null }) => ({
        id: g.id,
        name: g.name,
        icon: g.icon,
      })
    );

    return NextResponse.json(simplified);
  } catch (e: unknown) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Unknown error" },
      { status: 500 }
    );
  }
}
