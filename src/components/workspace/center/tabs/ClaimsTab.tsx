import type { Claim } from "@/types/claim";
import { Card } from "@/components/ui/card";
import { ExpandableSection } from "../ExpandableSection";
import { ChecklistSection } from "../ChecklistSection";
import { ActivityNotesSection } from "../ActivityNotesSection";
import { StatusPill } from "@/components/common/StatusPill";
import { CheckCircle2 } from "lucide-react";

export function ClaimsTab({ claim }: { claim: Claim }) {
  const all = claim.checklists.claims;
  const allMatch = all.every((i) => i.status === "verified");

  const Field = ({ k, v, mono }: { k: string; v: string; mono?: boolean }) => (
    <div>
      <div className="label-tracked">{k}</div>
      <div className={`text-sm ${mono ? "font-mono" : "font-medium"}`}>{v}</div>
    </div>
  );

  return (
    <div className="p-4 space-y-4">
      <ExpandableSection label="Summary — Intimation, Deceased, Claimant, Policy">
        <div className="p-4 space-y-4">
          {allMatch && (
            <div className="flex items-center gap-2 p-2 border-l-2 border-l-success bg-success-muted text-sm">
              <CheckCircle2 className="h-4 w-4 text-success" />
              <span>Intimation step and claim creation completed in FNOL — all data points verified.</span>
            </div>
          )}
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
            <Card className="p-3 space-y-2">
              <div className="label-tracked">Deceased</div>
              <Field k="Name" v={`${claim.death.salutation} ${claim.death.firstName} ${claim.death.middleName} ${claim.death.lastName}`} />
              <Field k="DOB / DOD" v={`${claim.death.dob} → ${claim.death.dod} ${claim.death.dodTime}`} mono />
              <Field k="Location" v={claim.death.location} />
              <Field k="Cause" v={claim.death.cause} />
            </Card>
            <Card className="p-3 space-y-2">
              <div className="label-tracked">Claimant</div>
              <Field k="Name" v={claim.claimant.name} />
              <Field k="Relationship" v={claim.claimant.relationship} />
              <Field k="Phone" v={claim.claimant.phone} mono />
              <Field k="Email" v={claim.claimant.email} mono />
            </Card>
            <Card className="p-3 space-y-2">
              <div className="flex items-center justify-between">
                <div className="label-tracked">Policy</div>
                <StatusPill tone={claim.policy.status === "Active" ? "success" : claim.policy.status === "Paid-Up" ? "info" : "danger"}>{claim.policy.status}</StatusPill>
              </div>
              <Field k="Policy #" v={claim.policy.policyNumber} mono />
              <Field k="Carrier" v={claim.policy.carrier} />
              <Field k="Face Amount" v={claim.policy.faceAmount} mono />
              <Field k="Issue Date" v={claim.policy.issueDate} mono />
            </Card>
          </div>
        </div>
      </ExpandableSection>

      <ChecklistSection items={all} label="Audit Checklist" />
      <ActivityNotesSection claim={claim} tab="claims" />
    </div>
  );
}
