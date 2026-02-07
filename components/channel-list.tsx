interface ChannelItem {
  id: string;
  name: string;
  type: number;
}

function HashIcon() {
  return (
    <svg className="h-3.5 w-3.5 text-neutral-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
    </svg>
  );
}

function VolumeIcon() {
  return (
    <svg className="h-3.5 w-3.5 text-neutral-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.536 8.464a5 5 0 010 7.072M12 6l-4 4H4v4h4l4 4V6z" />
    </svg>
  );
}

function FolderIcon() {
  return (
    <svg className="h-3.5 w-3.5 text-neutral-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 19a2 2 0 01-2-2V7a2 2 0 012-2h4l2 2h4a2 2 0 012 2v1M5 19h14a2 2 0 002-2v-5a2 2 0 00-2-2H9a2 2 0 00-2 2v5a2 2 0 01-2 2z" />
    </svg>
  );
}

function ChannelIcon({ type }: { type: number }) {
  if (type === 4) return <FolderIcon />;
  if (type === 2) return <VolumeIcon />;
  return <HashIcon />;
}

function channelTypeName(type: number) {
  if (type === 0) return "Text";
  if (type === 2) return "Voice";
  if (type === 4) return "Category";
  if (type === 5) return "Announcement";
  if (type === 13) return "Stage";
  if (type === 15) return "Forum";
  return `Type ${type}`;
}

export function ChannelList({ channels }: { channels: ChannelItem[] }) {
  const categories = channels.filter((c) => c.type === 4);
  const others = channels.filter((c) => c.type !== 4);

  return (
    <div className="space-y-1 max-h-64 overflow-y-auto pr-1">
      {categories.map((cat) => (
        <div
          key={cat.id}
          className="flex items-center gap-2 px-2 py-1.5 rounded text-xs font-semibold uppercase tracking-wider text-neutral-500"
        >
          <ChannelIcon type={cat.type} />
          <span>{cat.name}</span>
        </div>
      ))}
      {others.map((ch) => (
        <div
          key={ch.id}
          className="flex items-center justify-between gap-2 px-2 py-1.5 rounded hover:bg-neutral-800/50 transition-colors"
        >
          <div className="flex items-center gap-2 min-w-0">
            <ChannelIcon type={ch.type} />
            <span className="text-sm text-neutral-200 truncate">{ch.name}</span>
          </div>
          <span className="text-xs text-neutral-500 shrink-0">
            {channelTypeName(ch.type)}
          </span>
        </div>
      ))}
    </div>
  );
}
