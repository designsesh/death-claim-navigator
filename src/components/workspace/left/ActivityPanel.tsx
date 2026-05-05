import type { Claim, ActivityEntry } from "@/types/claim";
import { useState } from "react";
import { Bot, User, Cog, Maximize2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { formatDateTimeUS, TAB_LABELS } from "@/lib/format";
import type { TabKey } from "@/types/claim";

const ORDER: (TabKey | "fnol")[] = ["fnol", "claims", "policy", "beneficiary", "settlement", "payout"];
const FNOL_LABEL = "FNOL · Intake";

function groupByTab(activity: ActivityEntry[]) {
  const groups = new Map<string, ActivityEntry[]>();
  for (const a of activity) {
    const k = a.tab;
    if (!groups.has(k)) groups.set(k, []);
    groups.get(k)!.push(a);
  }
  for (const list of groups.values()) {
    list.sort((a, b) => b.ts.localeCompare(a.ts));
  }
  return groups;
}

function ActorIcon({ type }: { type: ActivityEntry["actorType"] }) {
  const I = type === "ai" ? Bot : type === "system" ? Cog : User;
  const cls = type === "ai" ? "text-primary" : type === "system" ? "text-warning" : "text-muted-foreground";
  return <I className={`h-3 w-3 mt-0.5 shrink-0 ${cls}`} />;
}

function ActivityList({ activity, dense }: { activity: ActivityEntry[]; dense?: boolean }) {
  const groups = groupByTab(activity);
  return (
    <div className={dense ? "space-y-4" : "space-y-6"}>
      {ORDER.filter((k) => groups.has(k)).map((k) => {
        const list = groups.get(k)!;
        const label = k === "fnol" ? FNOL_LABEL : TAB_LABELS[k as TabKey];
        return (
          <div key={k}>
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground/70 mb-1.5">{label}</div>
            <ol className="space-y-1.5">
              {list.map((a) => (
                <li key={a.id} className="flex gap-2 text-xs">
                  <ActorIcon type={a.actorType} />
                  <div className="flex-1 min-w-0">
                    <div className="leading-snug">
                      <span className="font-medium">{a.actor}</span>
                      <span className="text-muted-foreground"> · {a.action}</span>
                    </div>
                    {a.detail && <div className="text-[11px] text-muted-foreground leading-snug">{a.detail}</div>}
                    <div className="num text-[10px] text-muted-foreground/80">{formatDateTimeUS(a.ts)}</div>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        );
      })}
    </div>
  );
}

export function ActivityPanel({ claim }: { claim: Claim }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="flex flex-col">
      <div className="px-3 py-2 border-b flex items-center justify-end">
        <Button size="sm" variant="outline" className="h-7 text-[11px]" onClick={() => setOpen(true)}>
          <Maximize2 className="h-3 w-3 mr-1" /> Expand
        </Button>
      </div>
      <div className="p-3">
        <ActivityList activity={claim.activity} dense />
      </div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-auto">
          <DialogHeader>
            <DialogTitle>Activity — {claim.id}</DialogTitle>
          </DialogHeader>
          <ActivityList activity={claim.activity} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
