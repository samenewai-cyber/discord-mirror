"use client";

import useSWR from "swr";
import { StatusCard } from "./status-card";
import { ChannelList } from "./channel-list";

interface StatusData {
  envVars: { token: boolean; serverId: boolean };
  bot: {
    connected: boolean;
    username?: string;
    discriminator?: string;
    id?: string;
    error?: string;
  } | null;
  guild: {
    connected: boolean;
    name?: string;
    memberCount?: number;
    error?: string;
  } | null;
  channels: {
    fetched: boolean;
    count?: number;
    list?: { id: string; name: string; type: number }[];
    error?: string;
  } | null;
}

const fetcher = (url: string) => fetch(url).then((r) => r.json());

function RefreshIcon({ spinning }: { spinning: boolean }) {
  return (
    <svg
      className={`h-4 w-4 mr-2 ${spinning ? "animate-spin" : ""}`}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
      />
    </svg>
  );
}

export function Dashboard() {
  const { data, error, isLoading, mutate } = useSWR<StatusData>(
    "/api/status",
    fetcher,
    { revalidateOnFocus: false }
  );

  return (
    <div className="min-h-screen bg-neutral-950">
      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-xl font-semibold text-neutral-100 tracking-tight">
              Discord Mirror
            </h1>
            <p className="text-sm text-neutral-400 mt-1">
              Bot status and connection diagnostics
            </p>
          </div>
          <button
            onClick={() => mutate()}
            disabled={isLoading}
            className="inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-md border border-neutral-700 bg-neutral-900 text-neutral-200 hover:bg-neutral-800 transition-colors disabled:opacity-50"
          >
            <RefreshIcon spinning={isLoading} />
            Refresh
          </button>
        </div>

        {error && (
          <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-4 mb-6">
            <p className="text-sm text-red-400">
              Failed to fetch status. Make sure the app is running.
            </p>
          </div>
        )}

        <div className="space-y-4">
          <StatusCard
            title="Environment Variables"
            status={
              isLoading
                ? "loading"
                : data?.envVars.token && data?.envVars.serverId
                  ? "success"
                  : "error"
            }
          >
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span
                  className={`inline-block h-2 w-2 rounded-full ${
                    data?.envVars.token ? "bg-emerald-400" : "bg-red-400"
                  }`}
                />
                <span>
                  {"DISCORD_TOKEN "}
                  {data?.envVars.token ? (
                    <span className="text-emerald-400">configured</span>
                  ) : (
                    <span className="text-red-400">missing</span>
                  )}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={`inline-block h-2 w-2 rounded-full ${
                    data?.envVars.serverId ? "bg-emerald-400" : "bg-red-400"
                  }`}
                />
                <span>
                  {"SERVER_ID "}
                  {data?.envVars.serverId ? (
                    <span className="text-emerald-400">configured</span>
                  ) : (
                    <span className="text-red-400">missing</span>
                  )}
                </span>
              </div>
            </div>
          </StatusCard>

          <StatusCard
            title="Bot Identity"
            status={
              isLoading
                ? "loading"
                : data?.bot === null
                  ? "idle"
                  : data?.bot?.connected
                    ? "success"
                    : "error"
            }
          >
            {data?.bot === null && (
              <p>Waiting for token to be configured...</p>
            )}
            {data?.bot?.connected && (
              <div className="space-y-1">
                <p className="text-neutral-100 font-medium">
                  {data.bot.username}
                  {data.bot.discriminator !== "0" &&
                    `#${data.bot.discriminator}`}
                </p>
                <p className="text-xs font-mono text-neutral-500">
                  {"ID: "}{data.bot.id}
                </p>
              </div>
            )}
            {data?.bot && !data.bot.connected && (
              <p className="text-red-400">{data.bot.error}</p>
            )}
          </StatusCard>

          <StatusCard
            title="Guild Access"
            status={
              isLoading
                ? "loading"
                : data?.guild === null
                  ? "idle"
                  : data?.guild?.connected
                    ? "success"
                    : "error"
            }
          >
            {data?.guild === null && (
              <p>Waiting for bot and server ID...</p>
            )}
            {data?.guild?.connected && (
              <div className="space-y-1">
                <p className="text-neutral-100 font-medium">
                  {data.guild.name}
                </p>
                {data.guild.memberCount && (
                  <p className="text-xs text-neutral-500">
                    {"~"}{data.guild.memberCount.toLocaleString()}{" members"}
                  </p>
                )}
              </div>
            )}
            {data?.guild && !data.guild.connected && (
              <p className="text-red-400">{data.guild.error}</p>
            )}
          </StatusCard>

          <StatusCard
            title="Channels"
            status={
              isLoading
                ? "loading"
                : data?.channels === null
                  ? "idle"
                  : data?.channels?.fetched
                    ? "success"
                    : "error"
            }
          >
            {data?.channels === null && (
              <p>Waiting for guild access...</p>
            )}
            {data?.channels?.fetched && (
              <div className="space-y-3">
                <p>
                  {"Found "}
                  <span className="text-neutral-100 font-medium">
                    {data.channels.count}
                  </span>
                  {" channels"}
                </p>
                {data.channels.list && data.channels.list.length > 0 && (
                  <ChannelList channels={data.channels.list} />
                )}
              </div>
            )}
            {data?.channels && !data.channels.fetched && (
              <p className="text-red-400">{data.channels.error}</p>
            )}
          </StatusCard>
        </div>

        <p className="text-xs text-neutral-600 text-center mt-8">
          discord-mirror status dashboard
        </p>
      </div>
    </div>
  );
}
