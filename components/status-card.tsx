interface StatusCardProps {
  title: string;
  status: "success" | "error" | "loading" | "idle";
  children: React.ReactNode;
}

function CheckCircleIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="12" cy="12" r="10" /><path d="m9 12 2 2 4-4" />
    </svg>
  );
}

function XCircleIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="12" cy="12" r="10" /><path d="m15 9-6 6" /><path d="m9 9 6 6" />
    </svg>
  );
}

function LoaderIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  );
}

export function StatusCard({ title, status, children }: StatusCardProps) {
  return (
    <div className="rounded-lg border border-border bg-card p-5">
      <div className="flex items-center gap-3 mb-3">
        {status === "success" && (
          <CheckCircleIcon className="h-5 w-5 text-emerald-400 shrink-0" />
        )}
        {status === "error" && (
          <XCircleIcon className="h-5 w-5 text-red-400 shrink-0" />
        )}
        {status === "loading" && (
          <LoaderIcon className="h-5 w-5 text-muted-foreground animate-spin shrink-0" />
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
