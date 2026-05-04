import type { Claim } from "@/types/claim";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExpandableSection } from "../ExpandableSection";
import { ChecklistSection } from "../ChecklistSection";
import { ActivityNotesSection } from "../ActivityNotesSection";
import { ObservationsSection } from "../ObservationsSection";
import { TabStateHeader } from "../TabStateHeader";
import { StatusPill } from "@/components/common/StatusPill";
import { CheckCircle2, Pencil, Save, X, Check } from "lucide-react";
import { DisplayField, EditField } from "@/components/common/EditableField";
import { useState } from "react";
import { useApp } from "@/state/AppContext";
import { toast } from "@/hooks/use-toast";

export function ClaimsTab({ claim }: { claim: Claim }) {
  const { updateClaim } = useApp();
  const all = claim.checklists.claims;
  const allMatch = all.every((i) => i.status === "verified");

  const [editingDeath, setEditingDeath] = useState(false);
  const [editingClaimant, setEditingClaimant] = useState(false);
  const [draftDeath, setDraftDeath] = useState(claim.death);
  const [draftClaimant, setDraftClaimant] = useState(claim.claimant);

  const startDeath = () => { setDraftDeath(claim.death); setEditingDeath(true); };
  const saveDeath = () => {
    updateClaim(claim.id, (c) => ({ ...c, death: draftDeath }));
    setEditingDeath(false);
    toast({ title: "Deceased details saved" });
  };

  const startClaimant = () => { setDraftClaimant(claim.claimant); setEditingClaimant(true); };
  const saveClaimant = () => {
    updateClaim(claim.id, (c) => ({ ...c, claimant: draftClaimant }));
    setEditingClaimant(false);
    toast({ title: "Claimant details saved" });
  };

  const death = editingDeath ? draftDeath : claim.death;
  const claimant = editingClaimant ? draftClaimant : claim.claimant;

  return (
    <div className="p-4 space-y-4">
      <TabStateHeader claim={claim} tab="claims" />
      <ExpandableSection
        label="Summary — Intimation, Deceased, Claimant, Policy"
        extended={
          <div className="p-4 space-y-3">
            <div className="label-tracked">Verified Intimation Trail</div>
            <Card className="p-3 space-y-1.5 text-xs">
              <Row k="Intimation source" v="Email from claimant on file" verified />
              <Row k="Intimation channel" v="Inbound email · auto-classified" verified />
              <Row k="FNOL created by" v={claim.assignedTo} verified />
              <Row k="DMF (Death Master File)" v="Match — DOD confirmed" verified />
              <Row k="EVVE (State vital records)" v="Match" verified />
              <Row k="OFAC screening" v="Clear" verified />
              <Row k="Policy lookup" v={`Active match on ${claim.policy.policyNumber}`} verified />
              <Row k="Carrier" v={claim.policy.carrier} verified />
              <Row k="Audit trail integrity" v="No gaps detected" verified />
            </Card>
          </div>
        }
      >
        <div className="p-4 space-y-4">
          {allMatch && (
            <div className="flex items-center gap-2 p-2 border-l-2 border-l-success text-sm">
              <CheckCircle2 className="h-4 w-4 text-success" />
              <span>Intimation step and claim creation completed in FNOL — all data points verified.</span>
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card className="p-3 space-y-2">
              <CardHeader title="Deceased" editing={editingDeath} onEdit={startDeath} onSave={saveDeath} onCancel={() => setEditingDeath(false)} />
              {editingDeath ? (
                <div className="space-y-2">
                  <EditField label="First Name" value={death.firstName} onChange={(v) => setDraftDeath((p) => ({ ...p, firstName: v }))} />
                  <EditField label="Last Name" value={death.lastName} onChange={(v) => setDraftDeath((p) => ({ ...p, lastName: v }))} />
                  <EditField label="Date of Death" value={death.dod} onChange={(v) => setDraftDeath((p) => ({ ...p, dod: v }))} />
                  <EditField label="Location" value={death.location} onChange={(v) => setDraftDeath((p) => ({ ...p, location: v }))} />
                  <EditField label="Cause" value={death.cause} onChange={(v) => setDraftDeath((p) => ({ ...p, cause: v }))} />
                </div>
              ) : (
                <div className="space-y-2">
                  <DisplayField label="Name" value={`${death.salutation} ${death.firstName} ${death.middleName} ${death.lastName}`} />
                  <DisplayField label="DOB / DOD" value={`${death.dob} → ${death.dod} ${death.dodTime}`} mono />
                  <DisplayField label="Location" value={death.location} />
                  <DisplayField label="Cause" value={death.cause} />
                </div>
              )}
            </Card>
            <Card className="p-3 space-y-2">
              <CardHeader title="Claimant" editing={editingClaimant} onEdit={startClaimant} onSave={saveClaimant} onCancel={() => setEditingClaimant(false)} />
              {editingClaimant ? (
                <div className="space-y-2">
                  <EditField label="Name" value={claimant.name} onChange={(v) => setDraftClaimant((p) => ({ ...p, name: v }))} />
                  <EditField label="Phone" value={claimant.phone} onChange={(v) => setDraftClaimant((p) => ({ ...p, phone: v }))} />
                  <EditField label="Email" value={claimant.email} onChange={(v) => setDraftClaimant((p) => ({ ...p, email: v }))} />
                </div>
              ) : (
                <div className="space-y-2">
                  <DisplayField label="Name" value={claimant.name} />
                  <DisplayField label="Relationship" value={claimant.relationship} />
                  <DisplayField label="Phone" value={claimant.phone} mono />
                  <DisplayField label="Email" value={claimant.email} mono />
                </div>
              )}
            </Card>
            <Card className="p-3 space-y-2">
              <div className="flex items-center justify-between">
                <div className="label-tracked">Policy</div>
                <StatusPill tone={claim.policy.status === "Active" ? "success" : claim.policy.status === "Paid-Up" ? "info" : "danger"}>{claim.policy.status}</StatusPill>
              </div>
              <DisplayField label="Policy #" value={claim.policy.policyNumber} mono />
              <DisplayField label="Carrier" value={claim.policy.carrier} />
              <DisplayField label="Face Amount" value={claim.policy.faceAmount} mono />
              <DisplayField label="Issue Date" value={claim.policy.issueDate} mono />
            </Card>
          </div>
        </div>
      </ExpandableSection>

      <ChecklistSection items={all} label="Checklist" />
      <ObservationsSection claim={claim} tab="claims" />
      <ActivityNotesSection claim={claim} tab="claims" />
    </div>
  );
}

function CardHeader({ title, editing, onEdit, onSave, onCancel }: { title: string; editing: boolean; onEdit: () => void; onSave: () => void; onCancel: () => void }) {
  return (
    <div className="flex items-center justify-between">
      <div className="label-tracked">{title}</div>
      {!editing ? (
        <Button size="sm" variant="ghost" className="h-6 text-xs" onClick={onEdit}><Pencil className="h-3 w-3" /> Edit</Button>
      ) : (
        <div className="flex gap-1">
          <Button size="sm" variant="ghost" className="h-6 text-xs" onClick={onCancel}><X className="h-3 w-3" /></Button>
          <Button size="sm" className="h-6 text-xs" onClick={onSave}><Save className="h-3 w-3" /> Save</Button>
        </div>
      )}
    </div>
  );
}

function Row({ k, v, verified }: { k: string; v: string; verified?: boolean }) {
  return (
    <div className="flex justify-between items-center gap-3">
      <span className="text-muted-foreground">{k}</span>
      <span className="flex items-center gap-1.5 text-right">
        {v}
        {verified && <Check className="h-3 w-3 text-success" />}
      </span>
    </div>
  );
}
