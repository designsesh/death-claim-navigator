import type { Claim } from "@/types/claim";
import { Card } from "@/components/ui/card";
import { ExpandableSection } from "../ExpandableSection";
import { ChecklistSection } from "../ChecklistSection";
import { ActivityNotesSection } from "../ActivityNotesSection";
import { StatusPill } from "@/components/common/StatusPill";
import { Check, X } from "lucide-react";

export function BeneficiaryTab({ claim }: { claim: Claim }) {
  return (
    <div className="p-4 space-y-4">
      <ExpandableSection label={`Beneficiaries (${claim.beneficiaries.length})`}>
        <div className="p-4 grid grid-cols-1 lg:grid-cols-2 gap-3">
          {claim.beneficiaries.map((b) => (
            <Card key={b.id} className="p-3 space-y-2">
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-sm font-semibold">{b.name}</div>
                  <div className="text-xs text-muted-foreground">{b.relationship} · {b.share}% share</div>
                </div>
                <StatusPill tone={b.verified ? "success" : "warning"}>
                  {b.verified ? <><Check className="h-3 w-3" /> Verified</> : <><X className="h-3 w-3" /> Pending</>}
                </StatusPill>
              </div>
              <div className="space-y-1 text-xs pt-1 border-t">
                <Row k="Address" v={b.address} />
                <Row k="Phone" v={b.phone} mono />
                <Row k="Email" v={b.email} mono />
                <Row k="SSN (last 4)" v={`***-**-${b.ssnLast4}`} mono />
                <Row k="Account #" v={b.accountNumber} mono />
                <Row k="Routing #" v={b.routingNumber} mono />
                <Row k="Payout" v={b.payoutPreference} />
              </div>
            </Card>
          ))}
        </div>
      </ExpandableSection>

      <ChecklistSection items={claim.checklists.beneficiary} label="Verification Checklist" />
      <ActivityNotesSection claim={claim} tab="beneficiary" />
    </div>
  );
}

function Row({ k, v, mono }: { k: string; v: string; mono?: boolean }) {
  return (
    <div className="flex justify-between gap-3">
      <span className="text-muted-foreground shrink-0">{k}</span>
      <span className={`text-right ${mono ? "font-mono" : ""}`}>{v}</span>
    </div>
  );
}
