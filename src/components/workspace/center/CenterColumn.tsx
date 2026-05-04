import type { Claim, TabKey } from "@/types/claim";
import { ClaimsTab } from "./tabs/ClaimsTab";
import { PolicyTab } from "./tabs/PolicyTab";
import { BeneficiaryTab } from "./tabs/BeneficiaryTab";
import { SettlementTab } from "./tabs/SettlementTab";
import { PayoutTab } from "./tabs/PayoutTab";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { TAB_LABELS, TAB_ORDER } from "@/lib/format";

export function CenterColumn({ claim }: { claim: Claim }) {
  const [active, setActive] = useState<TabKey>("claims");

  return (
    <div className="h-full flex flex-col bg-background min-w-0">
      <div className="px-4 pt-3 border-b">
        <div className="flex items-end gap-1">
          {TAB_ORDER.map((id) => {
            const isActive = active === id;
            const isDone = claim.tabStates[id] === "done";
            const color = isDone ? "text-success" : "text-warning";
            const indicator = isDone ? "bg-success" : "bg-warning";
            return (
              <button
                key={id}
                onClick={() => setActive(id)}
                className={cn(
                  "relative px-3 py-2 text-sm font-medium transition-colors",
                  color,
                  !isActive && "opacity-60 hover:opacity-100",
                )}
              >
                {TAB_LABELS[id]}
                {isActive && (
                  <span className={cn("absolute -bottom-px left-0 right-0 h-0.5", indicator)} />
                )}
              </button>
            );
          })}
        </div>
      </div>
      <div className="flex-1 overflow-auto">
        {active === "claims" && <ClaimsTab claim={claim} />}
        {active === "policy" && <PolicyTab claim={claim} />}
        {active === "beneficiary" && <BeneficiaryTab claim={claim} />}
        {active === "settlement" && <SettlementTab claim={claim} />}
        {active === "payout" && <PayoutTab claim={claim} />}
      </div>
    </div>
  );
}
