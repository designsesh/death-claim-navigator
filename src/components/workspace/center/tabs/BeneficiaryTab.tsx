import type { Claim, Beneficiary } from "@/types/claim";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ExpandableSection } from "../ExpandableSection";
import { ChecklistSection } from "../ChecklistSection";
import { ActivityNotesSection } from "../ActivityNotesSection";
import { StatusPill } from "@/components/common/StatusPill";
import { Check, X, Pencil, Save } from "lucide-react";
import { DisplayField, EditField } from "@/components/common/EditableField";
import { useState } from "react";
import { useApp } from "@/state/AppContext";
import { toast } from "@/hooks/use-toast";

export function BeneficiaryTab({ claim }: { claim: Claim }) {
  return (
    <div className="p-4 space-y-4">
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

      <ChecklistSection items={claim.checklists.beneficiary} label="Verification Checklist" />
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
    <Card className="p-3 space-y-2">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="text-sm font-semibold">{b.name}</div>
          <div className="text-xs text-muted-foreground">{b.relationship} · {b.share}% share</div>
        </div>
        <StatusPill tone={b.verified ? "success" : "warning"}>
          {b.verified ? <><Check className="h-3 w-3" /> Verified</> : <><X className="h-3 w-3" /> Pending</>}
        </StatusPill>
        {!editing ? (
          <Button size="sm" variant="ghost" className="h-6 text-xs ml-1" onClick={() => { setDraft(beneficiary); setEditing(true); }}>
            <Pencil className="h-3 w-3" /> Edit
          </Button>
        ) : (
          <div className="flex gap-1 ml-1">
            <Button size="sm" variant="ghost" className="h-6 text-xs" onClick={() => setEditing(false)}><X className="h-3 w-3" /></Button>
            <Button size="sm" className="h-6 text-xs" onClick={save}><Save className="h-3 w-3" /> Save</Button>
          </div>
        )}
      </div>
      {editing ? (
        <div className="space-y-2 pt-2 border-t">
          <EditField label="Address" value={b.address} onChange={(v) => setDraft((p) => ({ ...p, address: v }))} />
          <EditField label="Phone" value={b.phone} onChange={(v) => setDraft((p) => ({ ...p, phone: v }))} />
          <EditField label="Email" value={b.email} onChange={(v) => setDraft((p) => ({ ...p, email: v }))} />
          <EditField label="Account #" value={b.accountNumber} onChange={(v) => setDraft((p) => ({ ...p, accountNumber: v }))} />
          <EditField label="Routing #" value={b.routingNumber} onChange={(v) => setDraft((p) => ({ ...p, routingNumber: v }))} />
        </div>
      ) : (
        <div className="space-y-1.5 pt-2 border-t">
          <DisplayField label="Address" value={b.address} />
          <div className="grid grid-cols-2 gap-2">
            <DisplayField label="Phone" value={b.phone} mono />
            <DisplayField label="Email" value={b.email} mono />
          </div>
          <div className="grid grid-cols-3 gap-2">
            <DisplayField label="SSN" value={`***-**-${b.ssnLast4}`} mono />
            <DisplayField label="Account #" value={b.accountNumber} mono />
            <DisplayField label="Routing #" value={b.routingNumber} mono />
          </div>
          <DisplayField label="Payout" value={b.payoutPreference} />
        </div>
      )}
    </Card>
  );
}

function Tick({ ok }: { ok?: boolean }) {
  if (ok === undefined) return <span className="text-muted-foreground">—</span>;
  return ok ? <Check className="h-4 w-4 text-success inline" /> : <X className="h-4 w-4 text-danger inline" />;
}
