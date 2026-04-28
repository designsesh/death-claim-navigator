import { useState } from "react";
import type { ChecklistItem } from "@/types/claim";
import { Button } from "@/components/ui/button";
import { StatusPill } from "@/components/common/StatusPill";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertTriangle, MessageSquare, UserPlus, ChevronDown, ChevronRight } from "lucide-react";
import { ExpandableSection } from "./ExpandableSection";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

export function ChecklistSection({ items, label = "Checklist" }: { items: ChecklistItem[]; label?: string }) {
  const verified = items.filter((i) => i.status === "verified").length;
  const mismatches = items.filter((i) => i.status === "mismatch");
  const pending = items.filter((i) => i.status === "pending");
  const total = items.length;
  const [showAll, setShowAll] = useState(false);

  return (
    <ExpandableSection
      label="Checklist"
      rightSlot={
        <div className="flex items-center gap-1.5 text-[11px]">
          <StatusPill tone="success">{verified}/{total} verified</StatusPill>
          {mismatches.length > 0 && <StatusPill tone="danger">{mismatches.length} mismatch</StatusPill>}
          {pending.length > 0 && <StatusPill tone="warning">{pending.length} pending</StatusPill>}
        </div>
      }
    >
      <div className="p-3 space-y-3">
        {mismatches.length === 0 ? (
          <div className="text-sm text-success border-l-2 border-l-success bg-success-muted p-3">
            {verified}/{total} verified — no mismatches.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {mismatches.map((it) => <MismatchCard key={it.id} item={it} />)}
          </div>
        )}

        <button
          onClick={() => setShowAll((s) => !s)}
          className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
        >
          {showAll ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />}
          View full checklist ({total} items verified by agent)
        </button>

        {showAll && (
          <div className="border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Check</TableHead>
                  <TableHead>Expected</TableHead>
                  <TableHead>Found</TableHead>
                  <TableHead>Source</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((it) => (
                  <TableRow key={it.id}>
                    <TableCell className="font-medium">{it.label}</TableCell>
                    <TableCell className="font-mono text-xs">{it.expected ?? "—"}</TableCell>
                    <TableCell className={cn("font-mono text-xs", it.status === "mismatch" && "text-danger")}>{it.found ?? "—"}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">{it.source ?? "—"}</TableCell>
                    <TableCell>
                      <StatusPill tone={it.status === "verified" ? "success" : it.status === "mismatch" ? "danger" : "warning"}>
                        {it.status}
                      </StatusPill>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </ExpandableSection>
  );
}

function MismatchCard({ item }: { item: ChecklistItem }) {
  const assign = () =>
    toast({
      title: `Task assigned: ${item.label}`,
      description: `Expected ${item.expected ?? "—"}, found ${item.found ?? "—"}${item.source ? ` (${item.source})` : ""}.`,
    });
  const communicate = () =>
    toast({
      title: `Communication drafted: ${item.label}`,
      description: `Requesting clarification on mismatch — expected ${item.expected ?? "—"}, found ${item.found ?? "—"}.`,
    });

  return (
    <div className="border bg-card p-3 border-l-2 border-l-danger">
      <div className="flex items-start gap-2">
        <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0 text-danger" />
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
          <div className="flex gap-1 mt-2">
            <Button size="sm" variant="outline" className="h-7 text-xs" onClick={assign}>
              <UserPlus className="h-3 w-3" /> Assign
            </Button>
            <Button size="sm" variant="ghost" className="h-7 text-xs" onClick={communicate}>
              <MessageSquare className="h-3 w-3" /> Communicate
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
