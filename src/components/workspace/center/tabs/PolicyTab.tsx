import type { Claim } from "@/types/claim";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ExpandableSection } from "../ExpandableSection";
import { ChecklistSection } from "../ChecklistSection";
import { ActivityNotesSection } from "../ActivityNotesSection";
import { ObservationsSection } from "../ObservationsSection";
import { TabStateHeader } from "../TabStateHeader";
import { StatusPill } from "@/components/common/StatusPill";
import { Pencil, Save, X, Check, ShieldCheck } from "lucide-react";
import { DisplayField, EditField } from "@/components/common/EditableField";
import { useState } from "react";
import { useApp } from "@/state/AppContext";
import { toast } from "@/hooks/use-toast";

export function PolicyTab({ claim }: { claim: Claim }) {
  const { updateClaim } = useApp();
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(claim.policy);

  const startEdit = () => { setDraft(claim.policy); setEditing(true); };
  const save = () => {
    updateClaim(claim.id, (c) => ({ ...c, policy: draft }));
    setEditing(false);
    toast({ title: "Policy updated" });
  };

  const p = editing ? draft : claim.policy;

  return (
    <div className="p-4 space-y-4">
      <TabStateHeader claim={claim} tab="policy" />
      <ExpandableSection
        label="Summary — Policy & Listed Beneficiaries"
        extended={
          <div className="p-4 grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card className="p-3 space-y-2">
              <div className="label-tracked">Underwriting & Status</div>
              <Row k="Product Type" v={p.productType ?? "—"} verified />
              <Row k="Underwriter" v={p.underwriter ?? "—"} />
              <Row k="Contestability Period" v={p.contestabilityPassed ? "Passed (>2 yrs since issue)" : "Within 2-yr window"} verified={p.contestabilityPassed} />
              <Row k="Carrier Status" v={p.status} verified />
              <Row k="Issue Date" v={p.issueDate} mono verified />
            </Card>
            <Card className="p-3 space-y-2">
              <div className="label-tracked">Riders ({p.riders?.length ?? 0})</div>
              {(p.riders ?? []).map((r) => (
                <div key={r} className="flex items-center gap-2 text-xs">
                  <ShieldCheck className="h-3.5 w-3.5 text-success" />
                  <span>{r}</span>
                </div>
              ))}
              {!p.riders?.length && <div className="text-xs text-muted-foreground italic">No riders on file.</div>}
            </Card>
            <Card className="p-0 lg:col-span-2 overflow-hidden">
              <div className="p-3 border-b label-tracked">Premium Payment History</div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {(p.premiumHistory ?? []).map((h) => (
                    <TableRow key={h.date}>
                      <TableCell className="font-mono text-xs">{h.date}</TableCell>
                      <TableCell className="text-right font-mono">{h.amount}</TableCell>
                      <TableCell><StatusPill tone={h.status === "Paid" ? "success" : "warning"}>{h.status}</StatusPill></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          </div>
        }
      >
        <div className="p-4 grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card className="p-3 space-y-2">
            <div className="flex items-center justify-between">
              <div className="label-tracked">Policy Details</div>
              {!editing ? (
                <Button size="sm" variant="ghost" className="h-6 text-xs" onClick={startEdit}><Pencil className="h-3 w-3" /> Edit</Button>
              ) : (
                <div className="flex gap-1">
                  <Button size="sm" variant="ghost" className="h-6 text-xs" onClick={() => setEditing(false)}><X className="h-3 w-3" /></Button>
                  <Button size="sm" className="h-6 text-xs" onClick={save}><Save className="h-3 w-3" /> Save</Button>
                </div>
              )}
            </div>
            {editing ? (
              <div className="space-y-2 pt-1">
                <EditField label="Policy #" value={p.policyNumber} onChange={(v) => setDraft((d) => ({ ...d, policyNumber: v }))} />
                <EditField label="Carrier" value={p.carrier} onChange={(v) => setDraft((d) => ({ ...d, carrier: v }))} />
                <EditField label="Insured" value={p.insuredName} onChange={(v) => setDraft((d) => ({ ...d, insuredName: v }))} />
                <EditField label="Face Amount" value={p.faceAmount} onChange={(v) => setDraft((d) => ({ ...d, faceAmount: v }))} />
                <EditField label="Premium" value={p.premium} onChange={(v) => setDraft((d) => ({ ...d, premium: v }))} />
              </div>
            ) : (
              <div className="space-y-2 pt-1">
                <DisplayField label="Policy #" value={p.policyNumber} mono />
                <DisplayField label="Carrier" value={p.carrier} />
                <DisplayField label="Insured" value={p.insuredName} />
                <DisplayField label="Face Amount" value={p.faceAmount} mono />
                <DisplayField label="Premium" value={p.premium} mono />
                <DisplayField label="Issue Date" value={p.issueDate} mono />
                <div className="flex items-center justify-between pt-1">
                  <span className="text-sm text-muted-foreground">Status</span>
                  <StatusPill tone={p.status === "Active" ? "success" : "info"}>{p.status}</StatusPill>
                </div>
              </div>
            )}
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

      <ChecklistSection items={claim.checklists.policy} label="Checklist" />
      <ObservationsSection claim={claim} tab="policy" />
      <ActivityNotesSection claim={claim} tab="policy" />
    </div>
  );
}

function Row({ k, v, mono, verified }: { k: string; v: string; mono?: boolean; verified?: boolean }) {
  return (
    <div className="flex justify-between items-center text-xs py-1 border-b last:border-0">
      <span className="text-muted-foreground">{k}</span>
      <span className={`flex items-center gap-1.5 text-right ${mono ? "font-mono" : "font-medium"}`}>
        {v}
        {verified && <Check className="h-3 w-3 text-success" />}
      </span>
    </div>
  );
}
