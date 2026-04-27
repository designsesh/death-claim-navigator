import type { Claim } from "@/types/claim";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { SectionLabel } from "@/components/common/SectionLabel";
import { DisplayField } from "@/components/common/EditableField";
import { Pencil, Save, X } from "lucide-react";
import { useApp } from "@/state/AppContext";
import { toast } from "@/hooks/use-toast";

export function FNOLPanel({ claim }: { claim: Claim }) {
  const { updateClaim } = useApp();
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState({ death: claim.death, claimant: claim.claimant });

  const startEdit = () => {
    setDraft({ death: claim.death, claimant: claim.claimant });
    setEditing(true);
  };
  const cancel = () => setEditing(false);
  const save = () => {
    updateClaim(claim.id, (c) => ({ ...c, death: draft.death, claimant: draft.claimant }));
    setEditing(false);
    toast({ title: "FNOL updated", description: "Death and claimant details saved." });
  };

  const d = editing ? draft.death : claim.death;
  const c = editing ? draft.claimant : claim.claimant;

  const setD = (k: keyof typeof d, v: string) => setDraft((p) => ({ ...p, death: { ...p.death, [k]: v } }));
  const setC = (k: keyof typeof c, v: string) => setDraft((p) => ({ ...p, claimant: { ...p.claimant, [k]: v } }));

  return (
    <div className="p-4 space-y-6">
      <div className="flex items-center justify-between">
        <div className="text-xs text-muted-foreground">First Notice of Loss · intake snapshot</div>
        {!editing ? (
          <Button size="sm" variant="outline" onClick={startEdit}>
            <Pencil className="h-3.5 w-3.5" /> Edit
          </Button>
        ) : (
          <div className="flex gap-1">
            <Button size="sm" variant="ghost" onClick={cancel}><X className="h-3.5 w-3.5" /> Cancel</Button>
            <Button size="sm" onClick={save}><Save className="h-3.5 w-3.5" /> Save</Button>
          </div>
        )}
      </div>

      <section className="space-y-3">
        <h3 className="text-sm font-semibold border-b pb-1">Death Information</h3>
        {editing ? (
          <>
            <div className="grid grid-cols-4 gap-3">
              <div className="space-y-1">
                <SectionLabel>Salutation</SectionLabel>
                <Select value={d.salutation} onValueChange={(v) => setD("salutation", v)}>
                  <SelectTrigger className="h-8 text-sm"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {["Mr.", "Mrs.", "Ms.", "Dr.", "Mx."].map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <Inp label="First Name" value={d.firstName} onChange={(v) => setD("firstName", v)} />
              <Inp label="Middle Name" value={d.middleName} onChange={(v) => setD("middleName", v)} />
              <Inp label="Last Name" value={d.lastName} onChange={(v) => setD("lastName", v)} />
              <Inp label="Date of Birth" value={d.dob} onChange={(v) => setD("dob", v)} />
              <Inp label="Date of Death" value={d.dod} onChange={(v) => setD("dod", v)} />
              <Inp label="Time of Death" value={d.dodTime} onChange={(v) => setD("dodTime", v)} />
              <Inp label="Policy #" value={d.policyNumber} onChange={(v) => setD("policyNumber", v)} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Inp label="Location of Death" value={d.location} onChange={(v) => setD("location", v)} />
              <Inp label="Cause of Death" value={d.cause} onChange={(v) => setD("cause", v)} />
            </div>
          </>
        ) : (
          <div className="grid grid-cols-2 gap-x-6 gap-y-3">
            <DisplayField label="Full Name" value={`${d.salutation} ${d.firstName} ${d.middleName} ${d.lastName}`} />
            <DisplayField label="Policy #" value={d.policyNumber} mono />
            <DisplayField label="Date of Birth" value={d.dob} mono />
            <DisplayField label="Date of Death" value={`${d.dod} ${d.dodTime}`} mono />
            <DisplayField label="Location of Death" value={d.location} />
            <DisplayField label="Cause of Death" value={d.cause} />
          </div>
        )}
      </section>

      <section className="space-y-3">
        <h3 className="text-sm font-semibold border-b pb-1">Claimant Information</h3>
        {editing ? (
          <div className="grid grid-cols-2 gap-3">
            <Inp label="Name" value={c.name} onChange={(v) => setC("name", v)} />
            <div className="space-y-1">
              <SectionLabel>Relationship</SectionLabel>
              <Select value={c.relationship} onValueChange={(v) => setC("relationship", v as any)}>
                <SelectTrigger className="h-8 text-sm"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {["Spouse", "Child", "Parent", "Sibling", "Trustee", "Other"].map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <Inp label="Phone" value={c.phone} onChange={(v) => setC("phone", v)} />
            <Inp label="Email" value={c.email} onChange={(v) => setC("email", v)} />
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-x-6 gap-y-3">
            <DisplayField label="Name" value={c.name} />
            <DisplayField label="Relationship" value={c.relationship} />
            <DisplayField label="Phone" value={c.phone} mono />
            <DisplayField label="Email" value={c.email} mono />
          </div>
        )}
      </section>
    </div>
  );
}

function Inp({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div className="space-y-1">
      <SectionLabel>{label}</SectionLabel>
      <Input value={value} onChange={(e) => onChange(e.target.value)} className="h-8 text-sm" />
    </div>
  );
}
