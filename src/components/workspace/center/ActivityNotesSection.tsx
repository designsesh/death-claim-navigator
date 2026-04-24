import type { Claim } from "@/types/claim";
import { useApp } from "@/state/AppContext";
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { SectionLabel } from "@/components/common/SectionLabel";
import { Bot, User, Cog, Plus } from "lucide-react";

const TabKey = {
  claims: "claims" as const,
  policy: "policy" as const,
  beneficiary: "beneficiary" as const,
  settlement: "settlement" as const,
  payout: "payout" as const,
};

type TabKeyT = keyof typeof TabKey;

export function ActivityNotesSection({ claim, tab }: { claim: Claim; tab: TabKeyT }) {
  const { updateClaim } = useApp();
  const [note, setNote] = useState("");

  const activity = claim.activity.filter((a) => a.tab === tab || (tab === "claims" && a.tab === "fnol"));
  const notes = claim.notes.filter((n) => n.tab === tab);

  const addNote = () => {
    if (!note.trim()) return;
    updateClaim(claim.id, (c) => ({
      ...c,
      notes: [
        ...c.notes,
        { id: `N-${Date.now()}`, ts: new Date().toISOString().slice(0, 16).replace("T", " "), author: "Sarah Mitchell", text: note.trim(), tab },
      ],
    }));
    setNote("");
  };

  const Icon = (t: string) => (t === "ai" ? Bot : t === "system" ? Cog : User);

  return (
    <section className="border bg-card">
      <header className="px-3 py-2 border-b">
        <SectionLabel>Activity Log &amp; Notes — {tab}</SectionLabel>
      </header>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-0 max-h-[280px]">
        <div className="overflow-auto p-3 border-r">
          <div className="label-tracked mb-2">Activity</div>
          {activity.length === 0 ? (
            <div className="text-xs text-muted-foreground italic">No activity yet on this tab.</div>
          ) : (
            <ol className="space-y-2">
              {activity.map((a) => {
                const I = Icon(a.actorType);
                return (
                  <li key={a.id} className="flex gap-2 text-xs">
                    <I className={`h-3.5 w-3.5 mt-0.5 shrink-0 ${a.actorType === "ai" ? "text-primary" : a.actorType === "system" ? "text-warning" : "text-muted-foreground"}`} />
                    <div className="flex-1">
                      <div><span className="font-medium">{a.actor}</span> · {a.action}</div>
                      {a.detail && <div className="text-muted-foreground">{a.detail}</div>}
                      <div className="font-mono text-[10px] text-muted-foreground">{a.ts}</div>
                    </div>
                  </li>
                );
              })}
            </ol>
          )}
        </div>
        <div className="flex flex-col">
          <div className="overflow-auto p-3 flex-1">
            <div className="label-tracked mb-2">Notes</div>
            {notes.length === 0 ? (
              <div className="text-xs text-muted-foreground italic">No notes yet.</div>
            ) : (
              <ol className="space-y-2">
                {notes.map((n) => (
                  <li key={n.id} className="text-xs border-l-2 border-l-primary pl-2">
                    <div>{n.text}</div>
                    <div className="text-muted-foreground font-mono text-[10px] mt-0.5">{n.author} · {n.ts}</div>
                  </li>
                ))}
              </ol>
            )}
          </div>
          <div className="border-t p-2 flex gap-2">
            <Textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Add a note for the next handler…"
              className="text-xs min-h-[36px] h-9"
            />
            <Button size="sm" onClick={addNote} disabled={!note.trim()}><Plus className="h-3.5 w-3.5" /> Note</Button>
          </div>
        </div>
      </div>
    </section>
  );
}
