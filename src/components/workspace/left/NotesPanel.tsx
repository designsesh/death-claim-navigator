import type { Claim } from "@/types/claim";
import { formatDateTimeUS, TAB_LABELS } from "@/lib/format";

export function NotesPanel({ claim }: { claim: Claim }) {
  const sorted = [...claim.notes].sort((a, b) => b.ts.localeCompare(a.ts));
  return (
    <div className="p-3 space-y-2">
      {sorted.length === 0 && <div className="text-[11px] italic text-muted-foreground">No notes yet.</div>}
      {sorted.map((n) => (
        <div key={n.id} className="border bg-card p-2">
          <div className="label-tracked">{TAB_LABELS[n.tab as keyof typeof TAB_LABELS] ?? n.tab}</div>
          <div className="text-xs mt-1">{n.text}</div>
          <div className="text-[10px] num text-muted-foreground mt-1">{n.author} · {formatDateTimeUS(n.ts)}</div>
        </div>
      ))}
    </div>
  );
}
