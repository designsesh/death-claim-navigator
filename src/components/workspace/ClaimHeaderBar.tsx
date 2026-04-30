import type { Claim, ClaimStatus } from "@/types/claim";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useApp } from "@/state/AppContext";
import { toast } from "@/hooks/use-toast";
import { AlertTriangle, Zap, Upload, Plus, Save } from "lucide-react";
import { HoverLabel } from "@/components/common/HoverLabel";
import { formatDateUS } from "@/lib/format";
import { useState } from "react";
import { UploadDocDialog } from "./UploadDocDialog";
import { NewTaskDialog } from "./NewTaskDialog";

const STATUSES: ClaimStatus[] = [
  "Open",
  "Assigned",
  "Claim Review",
  "Policy Review",
  "Awaiting Info",
  "Beneficiary Settlement",
  "Awaiting Sign-off",
  "Payout Processing",
  "Claim Closed",
  "Rejected",
  "Withdrawn",
];

export function ClaimHeaderBar({ claim }: { claim: Claim }) {
  const { updateClaim } = useApp();
  const [uploadOpen, setUploadOpen] = useState(false);
  const [taskOpen, setTaskOpen] = useState(false);

  const setStatus = (s: ClaimStatus) =>
    updateClaim(claim.id, (c) => ({ ...c, status: s }));

  return (
    <>
      <div className="border-b bg-card">
        <div className="px-4 py-3 flex flex-wrap items-center gap-x-8 gap-y-2">
          <Field label="Claim ID" value={claim.id} mono />
          <Field
            label="Deceased Name"
            value={`${claim.death.salutation} ${claim.death.firstName} ${claim.death.lastName}`}
          />
          <Field label="Policy ID" value={claim.policy.policyNumber} mono />
          <Field label="Face Amount" value={claim.policy.faceAmount} mono />
          <Field label="Date of Death" value={formatDateUS(claim.death.dod)} mono />

          <div className="ml-auto flex items-center gap-2">
            <FlagChip
              active={claim.litigationRisk}
              icon={AlertTriangle}
              label="Litigation Risk"
              tone="danger"
            />
            <FlagChip
              active={claim.expressFastTrack}
              icon={Zap}
              label="Express Claim"
              tone="success"
            />

            <HoverLabel label="Upload document" side="bottom">
              <Button variant="ghost" size="icon" onClick={() => setUploadOpen(true)}>
                <Upload className="h-4 w-4" />
              </Button>
            </HoverLabel>
            <HoverLabel label="Create task" side="bottom">
              <Button variant="ghost" size="icon" onClick={() => setTaskOpen(true)}>
                <Plus className="h-4 w-4" />
              </Button>
            </HoverLabel>

            <Select value={claim.status} onValueChange={(v) => setStatus(v as ClaimStatus)}>
              <SelectTrigger className="h-9 w-[200px] text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {STATUSES.map((s) => (
                  <SelectItem key={s} value={s}>{s}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button
              size="sm"
              className="h-9 px-4"
              onClick={() => toast({ title: "Claim saved" })}
            >
              <Save className="h-4 w-4" /> Save
            </Button>
          </div>
        </div>
      </div>

      <UploadDocDialog claim={claim} open={uploadOpen} onOpenChange={setUploadOpen} />
      <NewTaskDialog claim={claim} open={taskOpen} onOpenChange={setTaskOpen} />
    </>
  );
}

function Field({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="space-y-0.5 min-w-0">
      <div className="label-tracked">{label}</div>
      <div className={`text-sm font-semibold truncate ${mono ? "num" : ""}`}>{value}</div>
    </div>
  );
}

function FlagChip({
  active,
  icon: Icon,
  label,
  tone,
}: {
  active: boolean;
  icon: any;
  label: string;
  tone: "danger" | "success";
}) {
  if (!active) return null;
  const color = tone === "danger" ? "text-danger" : "text-success";
  return (
    <div className={`flex items-center gap-1.5 text-xs px-2 py-1 border ${color}`}>
      <Icon className="h-3.5 w-3.5" />
      <span className="font-medium">{label}</span>
    </div>
  );
}
