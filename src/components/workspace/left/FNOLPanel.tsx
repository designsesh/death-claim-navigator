import type { Claim } from "@/types/claim";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SectionLabel } from "@/components/common/SectionLabel";

export function FNOLPanel({ claim }: { claim: Claim }) {
  const d = claim.death;
  const c = claim.claimant;
  const Field = ({ label, value }: { label: string; value: string }) => (
    <div className="space-y-1">
      <SectionLabel>{label}</SectionLabel>
      <Input defaultValue={value} className="h-8 text-sm" />
    </div>
  );

  return (
    <div className="p-4 space-y-6">
      <section className="space-y-3">
        <h3 className="text-sm font-semibold">Death Information</h3>
        <div className="grid grid-cols-4 gap-3">
          <div className="space-y-1">
            <SectionLabel>Salutation</SectionLabel>
            <Select defaultValue={d.salutation}>
              <SelectTrigger className="h-8 text-sm"><SelectValue /></SelectTrigger>
              <SelectContent>
                {["Mr.", "Mrs.", "Ms.", "Dr.", "Mx."].map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <Field label="First Name" value={d.firstName} />
          <Field label="Middle Name" value={d.middleName} />
          <Field label="Last Name" value={d.lastName} />
          <Field label="Date of Birth" value={d.dob} />
          <Field label="Date of Death" value={d.dod} />
          <Field label="Time of Death" value={d.dodTime} />
          <Field label="Policy #" value={d.policyNumber} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Location of Death" value={d.location} />
          <Field label="Cause of Death" value={d.cause} />
        </div>
      </section>

      <section className="space-y-3">
        <h3 className="text-sm font-semibold">Claimant Information</h3>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Name" value={c.name} />
          <div className="space-y-1">
            <SectionLabel>Relationship</SectionLabel>
            <Select defaultValue={c.relationship}>
              <SelectTrigger className="h-8 text-sm"><SelectValue /></SelectTrigger>
              <SelectContent>
                {["Spouse", "Child", "Parent", "Sibling", "Trustee", "Other"].map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <Field label="Phone" value={c.phone} />
          <Field label="Email" value={c.email} />
        </div>
      </section>
    </div>
  );
}
