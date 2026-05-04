import type { Claim, Beneficiary } from "@/types/claim";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ExpandableSection } from "../ExpandableSection";
import { ChecklistSection } from "../ChecklistSection";
import { ActivityNotesSection } from "../ActivityNotesSection";
import { ObservationsSection } from "../ObservationsSection";
import { TabStateHeader } from "../TabStateHeader";
import { StatusPill } from "@/components/common/StatusPill";
import { Check, X, Pencil, Save } from "lucide-react";
import { DisplayField, EditField } from "@/components/common/EditableField";
import { useState } from "react";
import { useApp } from "@/state/AppContext";
import { toast } from "@/hooks/use-toast";

export function BeneficiaryTab({ claim }: { claim: Claim }) {
  return (
    <div className="p-4 space-y-4">
      <TabStateHeader claim={claim} tab="beneficiary" />
      <ExpandableSection
        label={`Beneficiaries (${claim.beneficiaries.length})`}
        extended={
          <div className="p-4 space-y-4">
            <div>
              <div className="label-tracked mb-2">Verification Matrix</div>
              <Card className="p-0 overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Beneficiary</TableHead>
                      <TableHead className="text-center">ID</TableHead>
                      <TableHead className="text-center">Address</TableHead>
                      <TableHead className="text-center">ACH</TableHead>
                      <TableHead className="text-center">OFAC</TableHead>
                      <TableHead>KYC Source</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {claim.beneficiaries.map((b) => {
                      const m = b.verificationMatrix;
                      return (
                        <TableRow key={b.id}>
                          <TableCell className="font-medium">{b.name}</TableCell>
                          <TableCell className="text-center"><Tick ok={m?.idVerified} /></TableCell>
                          <TableCell className="text-center"><Tick ok={m?.addressVerified} /></TableCell>
                          <TableCell className="text-center"><Tick ok={m?.achVerified} /></TableCell>
                          <TableCell className="text-center"><Tick ok={m?.ofacClear} /></TableCell>
                          <TableCell className="text-xs text-muted-foreground">{m?.kycSource ?? "—"}</TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </Card>
            </div>
            <div>
              <div className="label-tracked mb-2">Designation Compare — Policy vs Claim</div>
              <Card className="p-0 overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Beneficiary</TableHead>
                      <TableHead className="text-right">Policy Share</TableHead>
                      <TableHead className="text-right">Claimed Share</TableHead>
                      <TableHead>Match</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {claim.beneficiaries.map((b) => {
                      const listed = claim.policyBeneficiariesListed.find((p) => p.name === b.name);
                      const match = listed?.share === b.share;
                      return (
                        <TableRow key={b.id}>
                          <TableCell className="font-medium">{b.name}</TableCell>
                          <TableCell className="text-right font-mono">{listed?.share ?? "—"}%</TableCell>
                          <TableCell className="text-right font-mono">{b.share}%</TableCell>
                          <TableCell>
                            <StatusPill tone={match ? "success" : "danger"}>
                              {match ? <><Check className="h-3 w-3" /> Match</> : <><X className="h-3 w-3" /> Mismatch</>}
                            </StatusPill>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </Card>
            </div>
          </div>
        }
      >
        <div className="p-4 grid grid-cols-1 lg:grid-cols-2 gap-3">
          {claim.beneficiaries.map((b) => (
            <BeneficiaryCard key={b.id} beneficiary={b} claimId={claim.id} />
          ))}
        </div>
      </ExpandableSection>

      <ChecklistSection items={claim.checklists.beneficiary} label="Checklist" />
      <ObservationsSection claim={claim} tab="beneficiary" />
      <ActivityNotesSection claim={claim} tab="beneficiary" />
    </div>
  );
}

function BeneficiaryCard({ beneficiary, claimId }: { beneficiary: Beneficiary; claimId: string }) {
  const { updateClaim } = useApp();
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(beneficiary);
  const b = editing ? draft : beneficiary;

  const save = () => {
    updateClaim(claimId, (c) => ({ ...c, beneficiaries: c.beneficiaries.map((x) => (x.id === beneficiary.id ? draft : x)) }));
    setEditing(false);
    toast({ title: "Beneficiary updated", description: draft.name });
  };

  return (
    <Card className="p-5 space-y-4">
      {/* Header — name as the hero, subtitle */}
      <div className="space-y-1">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="label-tracked">{b.relationship} · {b.share}% share</div>
            <div className="text-xl font-semibold leading-tight mt-1">{b.name}</div>
            <div className="text-sm text-muted-foreground mt-0.5">
              {b.payoutPreference} payout · {b.verified ? "Verified" : "Verification pending"}
            </div>
          </div>
          <div className="flex items-start gap-2">
            <StatusPill tone={b.verified ? "success" : "warning"}>
              {b.verified ? "Verified" : "Pending"}
            </StatusPill>
            {!editing ? (
              <Button size="sm" variant="ghost" className="h-7 text-xs" onClick={() => { setDraft(beneficiary); setEditing(true); }}>
                <Pencil className="h-3 w-3" /> Edit
              </Button>
            ) : (
              <div className="flex gap-1">
                <Button size="sm" variant="ghost" className="h-7 text-xs" onClick={() => setEditing(false)}>
                  <X className="h-3 w-3" />
                </Button>
                <Button size="sm" className="h-7 text-xs" onClick={save}>
                  <Save className="h-3 w-3" /> Save
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {editing ? (
        <div className="space-y-2 pt-3 border-t">
          <EditField label="Address" value={b.address} onChange={(v) => setDraft((p) => ({ ...p, address: v }))} />
          <EditField label="Phone" value={b.phone} onChange={(v) => setDraft((p) => ({ ...p, phone: v }))} />
          <EditField label="Email" value={b.email} onChange={(v) => setDraft((p) => ({ ...p, email: v }))} />
          <EditField label="Account #" value={b.accountNumber} onChange={(v) => setDraft((p) => ({ ...p, accountNumber: v }))} />
          <EditField label="Routing #" value={b.routingNumber} onChange={(v) => setDraft((p) => ({ ...p, routingNumber: v }))} />
        </div>
      ) : (
        <div className="space-y-4 pt-3 border-t">
          {/* Contact group */}
          <Group title="Contact">
            <div className="grid grid-cols-3 gap-x-6 gap-y-3">
              <Field label="Phone" value={b.phone} mono />
              <Field label="Email" value={b.email} mono className="col-span-2" />
              <Field label="Address" value={b.address} className="col-span-3" />
            </div>
          </Group>

          {/* Payout group */}
          <Group title="Payout Details">
            <div className="grid grid-cols-3 gap-x-6 gap-y-3">
              <Field label="Method" value={b.payoutPreference} />
              <Field label="Account #" value={b.accountNumber} mono />
              <Field label="Routing #" value={b.routingNumber} mono />
            </div>
          </Group>

          {/* Identity group */}
          <Group title="Identity">
            <div className="grid grid-cols-3 gap-x-6 gap-y-3">
              <Field label="SSN" value={`***-**-${b.ssnLast4}`} mono />
              <Field label="Share" value={`${b.share}%`} mono />
              <Field label="Relationship" value={b.relationship} />
            </div>
          </Group>
        </div>
      )}
    </Card>
  );
}

function Group({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="label-tracked mb-2">{title}</div>
      {children}
    </div>
  );
}

function Field({ label, value, mono, className }: { label: string; value: string; mono?: boolean; className?: string }) {
  return (
    <div className={`min-w-0 ${className ?? ""}`}>
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className={`text-sm mt-0.5 truncate ${mono ? "num" : "font-medium"}`}>{value || "—"}</div>
    </div>
  );
}

function Tick({ ok }: { ok?: boolean }) {
  if (ok === undefined) return <span className="text-muted-foreground">—</span>;
  return ok ? <Check className="h-4 w-4 text-success inline" /> : <X className="h-4 w-4 text-danger inline" />;
}
