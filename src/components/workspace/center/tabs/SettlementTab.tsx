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
import { FileSignature, Mail, Check } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useState } from "react";
import { useApp } from "@/state/AppContext";
import { toast } from "@/hooks/use-toast";

const fmt = (n: number) => n.toLocaleString("en-US", { style: "currency", currency: "USD" });

export function SettlementTab({ claim }: { claim: Claim }) {
  const { updateClaim } = useApp();
  const [confirmEmail, setConfirmEmail] = useState(false);

  const beneById = (id: string) => claim.beneficiaries.find((b) => b.id === id)!;
  const allEmailed = claim.settlement.splits.every((s) => s.emailSent);

  const generate = () => {
    updateClaim(claim.id, (c) => ({ ...c, settlement: { ...c.settlement, documentGenerated: true } }));
    toast({ title: "Settlement document generated", description: "Ready to email beneficiaries." });
  };

  const sendEmails = () => {
    updateClaim(claim.id, (c) => ({
      ...c,
      settlement: {
        ...c.settlement,
        splits: c.settlement.splits.map((s) => ({ ...s, emailSent: true })),
      },
    }));
    setConfirmEmail(false);
    toast({ title: "Settlement emailed", description: `Sent to ${claim.beneficiaries.length} beneficiaries.` });
  };

  return (
    <div className="p-4 space-y-4">
      <ExpandableSection
        label="Settlement Calculation"
        rightSlot={<TabStateHeader claim={claim} tab="settlement" showSubmitForReview />}
      >
        <div className="p-4 grid grid-cols-1 lg:grid-cols-3 gap-3">
          <Card className="p-3 space-y-1">
            <div className="label-tracked">Face Amount</div>
            <div className="text-2xl font-mono font-semibold">{fmt(claim.settlement.faceAmount)}</div>
          </Card>
          <Card className="p-3 space-y-1">
            <div className="label-tracked">Accrued Interest</div>
            <div className="text-2xl font-mono font-semibold text-success">+{fmt(claim.settlement.accruedInterest)}</div>
          </Card>
          <Card className="p-3 space-y-1">
            <div className="label-tracked">Outstanding Loans</div>
            <div className="text-2xl font-mono font-semibold text-danger">-{fmt(claim.settlement.outstandingLoans)}</div>
          </Card>
          <Card className="p-3 lg:col-span-3">
            <div className="flex items-center justify-between">
              <div>
                <div className="label-tracked">Net Payable</div>
                <div className="text-3xl font-mono font-semibold">{fmt(claim.settlement.netPayable)}</div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={generate} disabled={claim.settlement.documentGenerated}>
                  <FileSignature className="h-4 w-4" />
                  {claim.settlement.documentGenerated ? "Document Generated" : "Generate Settlement Document"}
                </Button>
                <Button onClick={() => setConfirmEmail(true)} disabled={!claim.settlement.documentGenerated || allEmailed}>
                  <Mail className="h-4 w-4" />
                  {allEmailed ? "Emails Sent" : "Email Beneficiaries"}
                </Button>
              </div>
            </div>
          </Card>

          <Card className="p-0 lg:col-span-3 overflow-hidden">
            <div className="p-3 border-b label-tracked">Splits</div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Beneficiary</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead className="text-right">Share</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {claim.settlement.splits.map((s) => {
                  const b = beneById(s.beneficiaryId);
                  return (
                    <TableRow key={s.beneficiaryId}>
                      <TableCell className="font-medium">{b.name}</TableCell>
                      <TableCell className="font-mono text-xs">{b.email}</TableCell>
                      <TableCell className="text-right font-mono">{b.share}%</TableCell>
                      <TableCell className="text-right font-mono font-semibold">{fmt(s.amount)}</TableCell>
                      <TableCell>
                        {s.emailSent ? <StatusPill tone="success"><Check className="h-3 w-3" /> Email Sent</StatusPill> : <StatusPill tone="muted">Pending</StatusPill>}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </Card>
        </div>
      </ExpandableSection>

      <ChecklistSection items={claim.checklists.settlement} label="Checklist" />
      <ObservationsSection claim={claim} tab="settlement" />
      <ActivityNotesSection claim={claim} tab="settlement" />

      <Dialog open={confirmEmail} onOpenChange={setConfirmEmail}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Send settlement email to beneficiaries?</DialogTitle>
            <DialogDescription>
              The settlement document will be emailed to {claim.beneficiaries.length} beneficiary email address{claim.beneficiaries.length > 1 ? "es" : ""} on file. Each recipient will be asked to sign electronically.
            </DialogDescription>
          </DialogHeader>
          <div className="text-xs space-y-1 border bg-surface p-2">
            {claim.beneficiaries.map((b) => (
              <div key={b.id} className="flex justify-between font-mono">
                <span>{b.name}</span>
                <span className="text-muted-foreground">{b.email}</span>
              </div>
            ))}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmEmail(false)}>Cancel</Button>
            <Button onClick={sendEmails}><Mail className="h-4 w-4" /> Confirm &amp; Send</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
