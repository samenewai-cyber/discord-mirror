import { NextResponse } from "next/server";

export async function GET() {
  const token = process.env.DISCORD_TOKEN;
  const serverId = process.env.SERVER_ID;

  const checks: {
    envVars: { token: boolean; serverId: boolean };
    bot: { connected: boolean; username?: string; discriminator?: string; id?: string; error?: string } | null;
    guild: { connected: boolean; name?: string; memberCount?: number; error?: string } | null;
    channels: { fetched: boolean; count?: number; list?: { id: string; name: string; type: number }[]; error?: string } | null;
  } = {
    envVars: {
      token: !!token,
      serverId: !!serverId,
    },
    bot: null,
    guild: null,
    channels: null,
  };

  if (!token) {
    return NextResponse.json(checks);
  }

  const headers = {
    Authorization: `Bot ${token}`,
    "Content-Type": "application/json",
  };

  // Check bot identity
  try {
    const botRes = await fetch("https://discord.com/api/v10/users/@me", { headers });
    if (botRes.ok) {
      const bot = await botRes.json();
      checks.bot = {
        connected: true,
        username: bot.username,
        discriminator: bot.discriminator,
        id: bot.id,
      };
    } else {
      const err = await botRes.json();
      checks.bot = { connected: false, error: err.message || `HTTP ${botRes.status}` };
    }
  } catch (e: unknown) {
    checks.bot = { connected: false, error: e instanceof Error ? e.message : "Unknown error" };
  }

  // Check guild access
  if (serverId) {
    try {
      const guildRes = await fetch(
        `https://discord.com/api/v10/guilds/${serverId}?with_counts=true`,
        { headers }
      );
      if (guildRes.ok) {
        const guild = await guildRes.json();
        checks.guild = {
          connected: true,
          name: guild.name,
          memberCount: guild.approximate_member_count,
        };
      } else {
        const err = await guildRes.json();
        checks.guild = { connected: false, error: err.message || `HTTP ${guildRes.status}` };
      }
    } catch (e: unknown) {
      checks.guild = { connected: false, error: e instanceof Error ? e.message : "Unknown error" };
    }

    // Fetch channels
    try {
      const channelRes = await fetch(
        `https://discord.com/api/v10/guilds/${serverId}/channels`,
        { headers }
      );
      if (channelRes.ok) {
        const channels = await channelRes.json();
        if (Array.isArray(channels)) {
          checks.channels = {
            fetched: true,
            count: channels.length,
            list: channels.map((c: { id: string; name: string; type: number }) => ({
              id: c.id,
              name: c.name,
              type: c.type,
            })),
          };
        } else {
          checks.channels = { fetched: false, error: "Response was not an array" };
        }
      } else {
        const err = await channelRes.json();
        checks.channels = { fetched: false, error: err.message || `HTTP ${channelRes.status}` };
      }
    } catch (e: unknown) {
      checks.channels = { fetched: false, error: e instanceof Error ? e.message : "Unknown error" };
    }
  }

  return NextResponse.json(checks);
}
