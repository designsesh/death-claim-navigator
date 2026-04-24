import type { Claim, ExternalOrder } from "@/types/claim";
import { Button } from "@/components/ui/button";
import { StatusPill } from "@/components/common/StatusPill";
import { useApp } from "@/state/AppContext";
import { toast } from "@/hooks/use-toast";

export function ExternalOrderPanel({ claim }: { claim: Claim }) {
  const { updateClaim } = useApp();

  const tone = (s: ExternalOrder["status"]) => {
    switch (s) {
      case "Clear": return "success";
      case "Hit": return "danger";
      case "Received": return "info";
      case "Ordered": return "warning";
      default: return "muted";
    }
  };

  const order = (src: ExternalOrder["source"]) => {
    updateClaim(claim.id, (c) => ({
      ...c,
      externalOrders: c.externalOrders.map((o) =>
        o.source === src ? { ...o, status: "Ordered", orderedAt: new Date().toISOString().slice(0, 10) } : o,
      ),
    }));
    toast({ title: `Order placed`, description: `${src} request submitted.` });
  };

  return (
    <div className="p-4 space-y-2">
      <p className="text-xs text-muted-foreground mb-2">
        Contact US administrations for verification and screening data.
      </p>
      {claim.externalOrders.map((o) => (
        <div key={o.source} className="border bg-card p-3">
          <div className="flex items-center justify-between gap-2">
            <div className="min-w-0">
              <div className="text-sm font-semibold">{o.source}</div>
              <div className="text-xs text-muted-foreground truncate">{o.description}</div>
            </div>
            <StatusPill tone={tone(o.status) as any}>{o.status}</StatusPill>
          </div>
          <div className="mt-2 flex items-center justify-between">
            <div className="text-[11px] text-muted-foreground font-mono">
              {o.orderedAt ? `Ordered ${o.orderedAt}` : "—"}
              {o.receivedAt ? ` · Received ${o.receivedAt}` : ""}
            </div>
            {o.status === "Not Ordered" ? (
              <Button size="sm" variant="outline" onClick={() => order(o.source)}>Place Order</Button>
            ) : (
              <Button size="sm" variant="ghost">View Report</Button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
