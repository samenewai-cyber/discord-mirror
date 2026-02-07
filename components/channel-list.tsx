import { Hash, Volume2, FolderOpen } from "lucide-react";

interface ChannelItem {
  id: string;
  name: string;
  type: number;
}

// Discord channel types: 0 = text, 2 = voice, 4 = category
function ChannelIcon({ type }: { type: number }) {
  if (type === 4) return <FolderOpen className="h-3.5 w-3.5 text-muted-foreground shrink-0" />;
  if (type === 2) return <Volume2 className="h-3.5 w-3.5 text-muted-foreground shrink-0" />;
  return <Hash className="h-3.5 w-3.5 text-muted-foreground shrink-0" />;
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
