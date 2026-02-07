import { CheckCircle2, XCircle, Loader2 } from "lucide-react";

interface StatusCardProps {
  title: string;
  status: "success" | "error" | "loading" | "idle";
  children: React.ReactNode;
}

export function StatusCard({ title, status, children }: StatusCardProps) {
  return (
    <div className="rounded-lg border border-border bg-card p-5">
      <div className="flex items-center gap-3 mb-3">
        {status === "success" && (
          <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />
        )}
        {status === "error" && (
          <XCircle className="h-5 w-5 text-red-400 shrink-0" />
        )}
        {status === "loading" && (
          <Loader2 className="h-5 w-5 text-muted-foreground animate-spin shrink-0" />
        )}
        {status === "idle" && (
          <div className="h-5 w-5 rounded-full border-2 border-muted-foreground/40 shrink-0" />
        )}
        <h2 className="text-sm font-medium text-foreground">{title}</h2>
      </div>
      <div className="pl-8 text-sm text-muted-foreground">{children}</div>
    </div>
  );
}
