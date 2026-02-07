import { NextResponse } from "next/server";

export async function GET() {
  const token = process.env.DISCORD_TOKEN;
  const serverId = process.env.SERVER_ID;

  const status: {
    tokenSet: boolean;
    serverIdSet: boolean;
    tokenValid: boolean | null;
    serverAccessible: boolean | null;
    serverName: string | null;
    channelCount: number | null;
    error: string | null;
  } = {
    tokenSet: !!token,
    serverIdSet: !!serverId,
    tokenValid: null,
    serverAccessible: null,
    serverName: null,
    channelCount: null,
    error: null,
  };

  if (!token || !serverId) {
    status.error = `Missing environment variables: ${[
      !token && "DISCORD_TOKEN",
      !serverId && "SERVER_ID",
    ]
      .filter(Boolean)
      .join(", ")}`;
    return NextResponse.json(status);
  }

  try {
    // Test token validity by fetching current bot user
    const userResp = await fetch("https://discord.com/api/v10/users/@me", {
      headers: { Authorization: `Bot ${token}` },
    });

    if (userResp.ok) {
      status.tokenValid = true;
    } else {
      const userErr = await userResp.json();
      status.tokenValid = false;
      status.error = `Token validation failed: ${userErr.message || userResp.statusText}`;
      return NextResponse.json(status);
    }

    // Test server access
    const guildResp = await fetch(
      `https://discord.com/api/v10/guilds/${serverId}`,
      {
        headers: { Authorization: `Bot ${token}` },
      }
    );

    if (guildResp.ok) {
      const guild = await guildResp.json();
      status.serverAccessible = true;
      status.serverName = guild.name;
    } else {
      status.serverAccessible = false;
      const guildErr = await guildResp.json();
      status.error = `Server access failed: ${guildErr.message || guildResp.statusText}`;
      return NextResponse.json(status);
    }

    // Fetch channels
    const channelsResp = await fetch(
      `https://discord.com/api/v10/guilds/${serverId}/channels`,
      {
        headers: { Authorization: `Bot ${token}` },
      }
    );

    if (channelsResp.ok) {
      const channels = await channelsResp.json();
      status.channelCount = Array.isArray(channels) ? channels.length : 0;
    } else {
      const chErr = await channelsResp.json();
      status.error = `Channel fetch failed: ${chErr.message || channelsResp.statusText}`;
    }
  } catch (err) {
    status.error = `Network error: ${err instanceof Error ? err.message : String(err)}`;
  }

  return NextResponse.json(status);
}
