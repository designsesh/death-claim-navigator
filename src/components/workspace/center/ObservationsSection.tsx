import type { Claim, ChecklistItem, TabKey } from "@/types/claim";
import { ExpandableSection } from "./ExpandableSection";
import { Button } from "@/components/ui/button";
import { AlertTriangle, UserPlus, MessageSquare, Check } from "lucide-react";
import { useState } from "react";
import { NewTaskDialog } from "../NewTaskDialog";
import { toast } from "@/hooks/use-toast";

function buildObservation(item: ChecklistItem): string {
  if (item.expected && item.found) {
    return `${item.source ?? "Verification"} returned "${item.found}" but expected "${item.expected}". ${item.detail ?? "Likely data-entry or source-record discrepancy."} Recommend confirming with claimant and updating the source record.`;
  }
  if (item.detail) return `${item.detail} Recommend reviewing the underlying record and confirming with the claimant.`;
  return `${item.label} requires further review before this stage can be closed.`;
}

export function ObservationsSection({ claim, tab }: { claim: Claim; tab: TabKey }) {
  const items = claim.checklists[tab].filter((i) => i.status === "mismatch");
  const [taskOpen, setTaskOpen] = useState(false);
  const [prefill, setPrefill] = useState<{ title: string; description: string; section: TabKey } | null>(null);

  const onAssign = (item: ChecklistItem) => {
    setPrefill({
      title: `Resolve mismatch — ${item.label}`,
      description: buildObservation(item),
      section: tab,
    });
    setTaskOpen(true);
  };

  return (
    <>
      <ExpandableSection
        label="Observations"
        rightSlot={
          <span className="text-[11px] text-muted-foreground">
            {items.length === 0 ? "All clear" : `${items.length} flagged`}
          </span>
        }
      >
        <div className="p-3 space-y-2">
          {items.length === 0 ? (
            <div className="text-sm text-muted-foreground italic">No observations — all checks verified.</div>
          ) : (
            items.map((item) => (
              <div key={item.id} className="border bg-card p-3 border-l-2 border-l-danger">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0 text-danger" />
                  <div className="flex-1 min-w-0 space-y-2">
                    <div>
                      <div className="text-sm font-semibold">{item.label}</div>
                      {item.expected && (
                        <div className="text-[11px] num mt-0.5 space-x-3">
                          <span><span className="text-muted-foreground">Expected:</span> {item.expected}</span>
                          <span><span className="text-muted-foreground">Found:</span> {item.found}</span>
                          {item.source && <span className="text-muted-foreground">· {item.source}</span>}
                        </div>
                      )}
                    </div>
                    <div className="text-xs leading-relaxed">
                      <span className="label-tracked mr-2">AI Observation</span>
                      {buildObservation(item)}
                    </div>
                    <div className="flex items-center gap-2 pt-1">
                      <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => onAssign(item)}>
                        <UserPlus className="h-3 w-3" /> Assign Task
                      </Button>
                      <Button size="sm" variant="ghost" className="h-7 text-xs" onClick={() => toast({ title: "Communication drafted" })}>
                        <MessageSquare className="h-3 w-3" /> Communicate
                      </Button>
                      <Button size="sm" variant="ghost" className="h-7 text-xs" onClick={() => toast({ title: "Marked resolved" })}>
                        <Check className="h-3 w-3" /> Mark Resolved
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </ExpandableSection>
      <NewTaskDialog claim={claim} open={taskOpen} onOpenChange={setTaskOpen} prefill={prefill ?? undefined} />
    </>
  );
}
