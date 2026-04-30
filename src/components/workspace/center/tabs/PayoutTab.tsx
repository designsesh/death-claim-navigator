import type { Claim } from "@/types/claim";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ExpandableSection } from "../ExpandableSection";
import { ChecklistSection } from "../ChecklistSection";
import { ActivityNotesSection } from "../ActivityNotesSection";
import { StatusPill } from "@/components/common/StatusPill";
import { Upload, Send } from "lucide-react";
import { useApp } from "@/state/AppContext";
import { toast } from "@/hooks/use-toast";

const fmt = (n: number) => n.toLocaleString("en-US", { style: "currency", currency: "USD" });

export function PayoutTab({ claim }: { claim: Claim }) {
  const { updateClaim } = useApp();
  const beneById = (id: string) => claim.beneficiaries.find((b) => b.id === id)!;

  const uploadSigned = () => {
    updateClaim(claim.id, (c) => ({ ...c, payout: { ...c.payout, signedDocumentUploaded: true } }));
    toast({ title: "Signed settlement uploaded", description: "Payout can now be initiated." });
  };

  const initiate = () => {
    updateClaim(claim.id, (c) => ({
      ...c,
      payout: {
        ...c.payout,
        initiated: true,
        entries: c.payout.entries.map((e) => ({ ...e, status: "Initiated" })),
      },
    }));
    toast({ title: "Payout initiated", description: `Disbursing to ${claim.payout.entries.length} beneficiaries.` });
  };

  return (
    <div className="p-4 space-y-4">
      <ExpandableSection label="Accounting Entries">
        <div className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Beneficiary</TableHead>
                <TableHead>Account</TableHead>
                <TableHead className="text-right">Debit</TableHead>
                <TableHead className="text-right">Credit</TableHead>
                <TableHead className="text-right">Net Payout</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {claim.payout.entries.map((e) => {
                const b = beneById(e.beneficiaryId);
                return (
                  <TableRow key={e.beneficiaryId}>
                    <TableCell className="font-medium">{b.name}</TableCell>
                    <TableCell className="font-mono text-xs">{b.accountNumber} · {b.payoutPreference}</TableCell>
                    <TableCell className="text-right font-mono">{fmt(e.debit)}</TableCell>
                    <TableCell className="text-right font-mono">{fmt(e.credit)}</TableCell>
                    <TableCell className="text-right font-mono font-semibold">{fmt(e.net)}</TableCell>
                    <TableCell>
                      <StatusPill tone={e.status === "Paid" ? "success" : e.status === "Initiated" ? "info" : "muted"}>{e.status}</StatusPill>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </ExpandableSection>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="p-4 space-y-3">
          <div className="label-tracked">Signed Settlement Document</div>
          {claim.payout.signedDocumentUploaded ? (
            <div className="border-l-2 border-l-success p-3 text-sm">
              <div className="font-medium">signed_settlement_{claim.id}.pdf</div>
              <div className="text-xs text-muted-foreground mt-0.5">Uploaded · ready for payout</div>
            </div>
          ) : (
            <div className="border-2 border-dashed p-6 text-center">
              <Upload className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
              <div className="text-sm">Drop signed settlement here</div>
              <Button variant="outline" size="sm" className="mt-3" onClick={uploadSigned}>
                <Upload className="h-3.5 w-3.5" /> Simulate Upload
              </Button>
            </div>
          )}
        </Card>

        <Card className="p-4 space-y-3">
          <div className="label-tracked">Initiate Payout</div>
          <p className="text-xs text-muted-foreground">
            Sends instructions to the disbursement system. Requires signed settlement on file.
          </p>
          <Button
            className="w-full"
            disabled={!claim.payout.signedDocumentUploaded || claim.payout.initiated}
            onClick={initiate}
          >
            <Send className="h-4 w-4" />
            {claim.payout.initiated ? "Payout Initiated" : "Initiate Payout"}
          </Button>
        </Card>
      </div>

      <ChecklistSection items={claim.checklists.payout} label="Payout Checklist" />
      <ActivityNotesSection claim={claim} tab="payout" />
    </div>
  );
}
