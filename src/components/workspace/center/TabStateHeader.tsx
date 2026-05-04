import type { Claim, TabKey } from "@/types/claim";
import { useApp } from "@/state/AppContext";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { Send } from "lucide-react";

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
    <div className="flex items-center gap-3 px-1">
      <span
        className={cn(
          "text-xs font-medium uppercase tracking-wider px-2 py-1 border",
          isDone ? "text-success border-success/40" : "text-warning border-warning/40",
        )}
      >
        {isDone ? "Done" : "Pending"}
      </span>

      <button
        type="button"
        role="switch"
        aria-checked={isDone}
        onClick={toggle}
        className={cn(
          "relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors",
          isDone ? "bg-success" : "bg-warning",
        )}
      >
        <span
          className={cn(
            "inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform",
            isDone ? "translate-x-[18px]" : "translate-x-[2px]",
          )}
        />
      </button>

      {showSubmitForReview && (
        <Button size="sm" variant="outline" className="h-8 ml-1" onClick={submitForReview} disabled={isDone}>
          <Send className="h-3.5 w-3.5" /> Submit for Review
        </Button>
      )}
    </div>
  );
}
