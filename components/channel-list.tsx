interface ChannelItem {
  id: string;
  name: string;
  type: number;
}

function HashIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <line x1="4" x2="20" y1="9" y2="9" /><line x1="4" x2="20" y1="15" y2="15" /><line x1="10" x2="8" y1="3" y2="21" /><line x1="16" x2="14" y1="3" y2="21" />
    </svg>
  );
}

function VolumeIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" /><path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
    </svg>
  );
}

function FolderIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="m6 14 1.5-2.9A2 2 0 0 1 9.24 10H20a2 2 0 0 1 1.94 2.5l-1.54 6a2 2 0 0 1-1.95 1.5H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3.9a2 2 0 0 1 1.69.9l.81 1.2a2 2 0 0 0 1.67.9H18a2 2 0 0 1 2 2v2" />
    </svg>
  );
}

// Discord channel types: 0 = text, 2 = voice, 4 = category
function ChannelIcon({ type }: { type: number }) {
  if (type === 4) return <FolderIcon className="h-3.5 w-3.5 text-muted-foreground shrink-0" />;
  if (type === 2) return <VolumeIcon className="h-3.5 w-3.5 text-muted-foreground shrink-0" />;
  return <HashIcon className="h-3.5 w-3.5 text-muted-foreground shrink-0" />;
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
          className="flex items-center gap-2 px-2 py-1.5 rounded text-xs font-semibold uppercase tracking-wider text-muted-foreground"
        >
          <ChannelIcon type={cat.type} />
          <span>{cat.name}</span>
        </div>
      ))}
      {others.map((ch) => (
        <div
          key={ch.id}
          className="flex items-center justify-between gap-2 px-2 py-1.5 rounded hover:bg-accent/50 transition-colors"
        >
          <div className="flex items-center gap-2 min-w-0">
            <ChannelIcon type={ch.type} />
            <span className="text-sm text-foreground truncate">{ch.name}</span>
          </div>
          <span className="text-xs text-muted-foreground shrink-0">
            {channelTypeName(ch.type)}
          </span>
        </div>
      ))}
    </div>
  );
}
