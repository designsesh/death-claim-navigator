import type { Claim } from "@/types/claim";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusPill } from "@/components/common/StatusPill";
import { SectionLabel } from "@/components/common/SectionLabel";
import { ExternalLink } from "lucide-react";

export function PolicyPanel({ claim }: { claim: Claim }) {
  const p = claim.policy;
  const Row = ({ label, value, mono }: { label: string; value: string; mono?: boolean }) => (
    <div className="flex justify-between py-2 border-b last:border-b-0 text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className={mono ? "font-mono" : "font-medium"}>{value}</span>
    </div>
  );

  return (
    <div className="p-4 space-y-4">
      <Card className="p-4">
        <div className="flex items-center justify-between mb-2">
          <SectionLabel>Policy Snapshot</SectionLabel>
          <StatusPill tone={p.status === "Active" ? "success" : p.status === "Paid-Up" ? "info" : "danger"}>
            {p.status}
          </StatusPill>
        </div>
        <div>
          <Row label="Policy #" value={p.policyNumber} mono />
          <Row label="Carrier" value={p.carrier} />
          <Row label="Insured Name" value={p.insuredName} />
          <Row label="Beneficiary" value={p.beneficiary} />
          <Row label="Face Amount" value={p.faceAmount} mono />
          <Row label="Premium" value={p.premium} mono />
          <Row label="Issue Date" value={p.issueDate} mono />
        </div>
      </Card>
      <Button variant="outline" className="w-full">
        <ExternalLink className="h-4 w-4" /> Open Full Policy
      </Button>
    </div>
  );
}
