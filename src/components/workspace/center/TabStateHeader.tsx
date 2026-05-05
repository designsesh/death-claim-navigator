import type { Claim, TabKey } from "@/types/claim";
import { useApp } from "@/state/AppContext";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { Send } from "lucide-react";

/**
 * Compact inline control for marking a workspace stage as done.
 * Designed to be placed in the `rightSlot` of an ExpandableSection header,
 * inline with the section title. Renders: "Mark stage done" label + toggle,
 * plus an optional "Submit for Review" button (used on the Settlement stage).
 */
export function TabStateHeader({
  claim,
  tab,
  showSubmitForReview = false,
}: {
  claim: Claim;
  tab: TabKey;
  showSubmitForReview?: boolean;
}) {
  const { updateClaim } = useApp();
  const state = claim.tabStates[tab];
  const isDone = state === "done";

  const setState = (next: "pending" | "done") =>
    updateClaim(claim.id, (c) => ({ ...c, tabStates: { ...c.tabStates, [tab]: next } }));

  const toggle = () => setState(isDone ? "pending" : "done");

  const submitForReview = () => {
    setState("done");
    toast({ title: "Submitted for review", description: "Settlement marked done and routed for approval." });
  };

  return (
    <div className="flex items-center gap-3">
      {showSubmitForReview && (
        <Button size="sm" variant="outline" className="h-7 text-xs" onClick={submitForReview} disabled={isDone}>
          <Send className="h-3 w-3" /> Submit for Review
        </Button>
      )}
      <label className="flex items-center gap-2 cursor-pointer select-none">
        <span className="text-[11px] text-muted-foreground">Mark stage done</span>
        <button
          type="button"
          role="switch"
          aria-checked={isDone}
          onClick={toggle}
          className={cn(
            "relative inline-flex h-4 w-7 shrink-0 items-center rounded-full transition-colors",
            isDone ? "bg-success" : "bg-muted-foreground/30",
          )}
        >
          <span
            className={cn(
              "inline-block h-3 w-3 transform rounded-full bg-white shadow transition-transform",
              isDone ? "translate-x-[14px]" : "translate-x-[2px]",
            )}
          />
        </button>
      </label>
    </div>
  );
}
