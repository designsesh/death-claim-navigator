import type { Claim, NoteEntry } from "@/types/claim";
import { useState } from "react";
import { Maximize2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { formatDateTimeUS, TAB_LABELS } from "@/lib/format";
import type { TabKey } from "@/types/claim";

const ORDER: TabKey[] = ["claims", "policy", "beneficiary", "settlement", "payout"];

function groupByTab(notes: NoteEntry[]) {
  const groups = new Map<string, NoteEntry[]>();
  for (const n of notes) {
    if (!groups.has(n.tab)) groups.set(n.tab, []);
    groups.get(n.tab)!.push(n);
  }
  for (const list of groups.values()) list.sort((a, b) => b.ts.localeCompare(a.ts));
  return groups;
}

function NotesList({ notes, dense }: { notes: NoteEntry[]; dense?: boolean }) {
  const groups = groupByTab(notes);
  if (notes.length === 0) {
    return <div className="text-[11px] italic text-muted-foreground">No notes yet.</div>;
  }
  return (
    <div className={dense ? "space-y-4" : "space-y-6"}>
      {ORDER.filter((k) => groups.has(k)).map((k) => {
        const list = groups.get(k)!;
        return (
          <div key={k}>
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground/70 mb-1.5">{TAB_LABELS[k]}</div>
            <ol className="space-y-2">
              {list.map((n) => (
                <li key={n.id} className="text-xs border-l-2 border-l-primary/60 pl-2">
                  <div className="leading-snug">{n.text}</div>
                  <div className="text-[10px] num text-muted-foreground mt-0.5">{n.author} · {formatDateTimeUS(n.ts)}</div>
                </li>
              ))}
            </ol>
          </div>
        );
      })}
    </div>
  );
}

export function NotesPanel({ claim }: { claim: Claim }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="flex flex-col">
      <div className="px-3 py-2 border-b flex items-center justify-end">
        <Button size="sm" variant="outline" className="h-7 text-[11px]" onClick={() => setOpen(true)}>
          <Maximize2 className="h-3 w-3 mr-1" /> Expand
        </Button>
      </div>
      <div className="p-3">
        <NotesList notes={claim.notes} dense />
      </div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-auto">
          <DialogHeader>
            <DialogTitle>Notes — {claim.id}</DialogTitle>
          </DialogHeader>
          <NotesList notes={claim.notes} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
