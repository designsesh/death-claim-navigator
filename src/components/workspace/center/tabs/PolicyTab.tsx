import type { Claim } from "@/types/claim";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ExpandableSection } from "../ExpandableSection";
import { ChecklistSection } from "../ChecklistSection";
import { ActivityNotesSection } from "../ActivityNotesSection";
import { StatusPill } from "@/components/common/StatusPill";

export function PolicyTab({ claim }: { claim: Claim }) {
  const Field = ({ k, v, mono }: { k: string; v: string; mono?: boolean }) => (
    <div className="flex justify-between text-sm py-1.5 border-b last:border-0">
      <span className="text-muted-foreground">{k}</span>
      <span className={mono ? "font-mono" : "font-medium"}>{v}</span>
    </div>
  );

  return (
    <div className="p-4 space-y-4">
      <ExpandableSection label="Summary — Policy & Listed Beneficiaries">
        <div className="p-4 grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card className="p-3">
            <div className="label-tracked mb-2">Policy Details</div>
            <Field k="Policy #" v={claim.policy.policyNumber} mono />
            <Field k="Carrier" v={claim.policy.carrier} />
            <Field k="Insured" v={claim.policy.insuredName} />
            <Field k="Face Amount" v={claim.policy.faceAmount} mono />
            <Field k="Premium" v={claim.policy.premium} mono />
            <Field k="Issue Date" v={claim.policy.issueDate} mono />
            <div className="flex justify-between pt-2">
              <span className="text-sm text-muted-foreground">Status</span>
              <StatusPill tone={claim.policy.status === "Active" ? "success" : "info"}>{claim.policy.status}</StatusPill>
            </div>
          </Card>
          <Card className="p-0 overflow-hidden">
            <div className="p-3 border-b label-tracked">Beneficiaries listed in policy</div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Relationship</TableHead>
                  <TableHead className="text-right">Share</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {claim.policyBeneficiariesListed.map((b) => (
                  <TableRow key={b.name}>
                    <TableCell className="font-medium">{b.name}</TableCell>
                    <TableCell>{b.relationship}</TableCell>
                    <TableCell className="text-right font-mono">{b.share}%</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </div>
      </ExpandableSection>

      <ChecklistSection items={claim.checklists.policy} label="Mismatches & Fraud Analysis" />
      <ActivityNotesSection claim={claim} tab="policy" />
    </div>
  );
}
