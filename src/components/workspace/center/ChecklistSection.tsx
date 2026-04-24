import type { ChecklistItem } from "@/types/claim";
import { Button } from "@/components/ui/button";
import { StatusPill } from "@/components/common/StatusPill";
import { Check, AlertTriangle, Clock, MessageSquare, UserPlus } from "lucide-react";
import { ExpandableSection } from "./ExpandableSection";
import { toast } from "@/hooks/use-toast";

export function ChecklistSection({ items, label = "Checklist" }: { items: ChecklistItem[]; label?: string }) {
  const verified = items.filter((i) => i.status === "verified").length;
  const mismatches = items.filter((i) => i.status === "mismatch");
  const pending = items.filter((i) => i.status === "pending");
  const total = items.length;

  return (
    <ExpandableSection
      label={label}
      rightSlot={
        <div className="flex items-center gap-1.5 text-[11px]">
          <StatusPill tone="success">{verified}/{total} verified</StatusPill>
          {mismatches.length > 0 && <StatusPill tone="danger">{mismatches.length} mismatch</StatusPill>}
          {pending.length > 0 && <StatusPill tone="warning">{pending.length} pending</StatusPill>}
        </div>
      }
    >
      <div className="p-3 grid grid-cols-1 md:grid-cols-2 gap-2">
        {items.map((it) => <ChecklistCard key={it.id} item={it} />)}
      </div>
    </ExpandableSection>
  );
}

function ChecklistCard({ item }: { item: ChecklistItem }) {
  const Icon = item.status === "verified" ? Check : item.status === "mismatch" ? AlertTriangle : Clock;
  const tone = item.status === "verified" ? "success" : item.status === "mismatch" ? "danger" : "warning";

  return (
    <div
      className={`border bg-card p-3 ${
        item.status === "mismatch" ? "border-l-2 border-l-danger" : item.status === "pending" ? "border-l-2 border-l-warning" : "border-l-2 border-l-success"
      }`}
    >
      <div className="flex items-start gap-2">
        <Icon className={`h-4 w-4 mt-0.5 shrink-0 ${tone === "success" ? "text-success" : tone === "danger" ? "text-danger" : "text-warning"}`} />
        <div className="flex-1 min-w-0">
          <div className="text-sm font-medium">{item.label}</div>
          {item.detail && <div className="text-xs text-muted-foreground mt-0.5">{item.detail}</div>}
          {item.expected && (
            <div className="mt-1 text-[11px] font-mono space-y-0.5">
              <div><span className="text-muted-foreground">Expected:</span> {item.expected}</div>
              <div><span className="text-muted-foreground">Found:</span> {item.found}</div>
            </div>
          )}
          {item.source && <div className="text-[11px] text-muted-foreground mt-1">Source: {item.source}</div>}
          {item.status === "mismatch" && (
            <div className="flex gap-1 mt-2">
              <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => toast({ title: "Task assigned", description: item.label })}>
                <UserPlus className="h-3 w-3" /> Assign
              </Button>
              <Button size="sm" variant="ghost" className="h-7 text-xs" onClick={() => toast({ title: "Communication started", description: item.label })}>
                <MessageSquare className="h-3 w-3" /> Communicate
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
