import type { Claim, ChecklistItem, ActivityEntry } from "@/types/claim";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronRight, Bot, User, Cog, Circle } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { formatDateTimeUS } from "@/lib/format";

const PROCESS_SECTIONS: { key: ActivityEntry["tab"]; label: string; checklistKey?: keyof Claim["checklists"] }[] = [
  { key: "fnol", label: "FNOL" },
  { key: "claims", label: "Claims", checklistKey: "claims" },
  { key: "policy", label: "Policy", checklistKey: "policy" },
  { key: "beneficiary", label: "Beneficiary", checklistKey: "beneficiary" },
  { key: "settlement", label: "Beneficiary Settlement", checklistKey: "settlement" },
  { key: "payout", label: "Payout", checklistKey: "payout" },
];

export function ProcessWallPanel({ claim }: { claim: Claim }) {
  const [openMap, setOpenMap] = useState<Record<string, boolean>>(
    () => Object.fromEntries(PROCESS_SECTIONS.map((s, i) => [s.key, i < 2])),
  );

  return (
    <div className="px-3 py-3 space-y-2">
      {PROCESS_SECTIONS.map((section) => {
        const items = claim.activity
          .filter((a) => a.tab === section.key)
          .sort((a, b) => a.ts.localeCompare(b.ts));
        const remaining: ChecklistItem[] = section.checklistKey
          ? claim.checklists[section.checklistKey].filter((i) => i.status !== "verified")
          : [];
        const open = openMap[section.key];
        return (
          <Collapsible
            key={section.key}
            open={open}
            onOpenChange={(o) => setOpenMap((m) => ({ ...m, [section.key]: o }))}
            className="border bg-card"
          >
            <CollapsibleTrigger className="w-full px-2 py-1.5 flex items-center gap-2 hover:bg-surface text-left">
              <ChevronRight className={cn("h-3.5 w-3.5 transition-transform shrink-0", open && "rotate-90")} />
              <span className="text-xs font-semibold flex-1">{section.label}</span>
              <span className="num text-[10px] text-muted-foreground">{items.length} done</span>
              {remaining.length > 0 && (
                <span className="num text-[10px] text-warning">{remaining.length} todo</span>
              )}
            </CollapsibleTrigger>
            <CollapsibleContent className="border-t px-2 py-2 space-y-3">
              <div>
                <div className="label-tracked mb-1.5">Activity</div>
                {items.length === 0 ? (
                  <div className="text-[11px] italic text-muted-foreground">No activity yet.</div>
                ) : (
                  <ol className="relative border-l ml-1.5 space-y-2 py-1">
                    {items.map((a) => {
                      const I = a.actorType === "ai" ? Bot : a.actorType === "system" ? Cog : User;
                      return (
                        <li key={a.id} className="ml-3 relative">
                          <div className="absolute -left-[7px] mt-1 h-2 w-2 bg-card border border-primary" />
                          <div className="text-[11px]">
                            <div className="flex items-center gap-1">
                              <I className={cn("h-3 w-3 shrink-0", a.actorType === "ai" ? "text-primary" : a.actorType === "system" ? "text-warning" : "text-muted-foreground")} />
                              <span className="font-medium">{a.actor}</span>
                            </div>
                            <div>{a.action}</div>
                            {a.detail && <div className="text-muted-foreground">{a.detail}</div>}
                            <div className="num text-[10px] text-muted-foreground">{formatDateTimeUS(a.ts)}</div>
                          </div>
                        </li>
                      );
                    })}
                  </ol>
                )}
              </div>
              {remaining.length > 0 && (
                <div>
                  <div className="label-tracked mb-1.5">Remaining</div>
                  <ul className="space-y-1.5">
                    {remaining.map((r) => (
                      <li key={r.id} className="flex items-start gap-2 text-[11px]">
                        <Circle className={cn("h-3 w-3 mt-0.5 shrink-0", r.status === "mismatch" ? "text-danger" : "text-warning")} />
                        <div className="flex-1">
                          <div>{r.label}</div>
                          {r.detail && <div className="text-muted-foreground">{r.detail}</div>}
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </CollapsibleContent>
          </Collapsible>
        );
      })}
    </div>
  );
}
