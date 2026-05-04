import type { Claim } from "@/types/claim";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Zap, Upload, Plus } from "lucide-react";
import { HoverLabel } from "@/components/common/HoverLabel";
import { formatDateUS, deriveStatusFromTabs } from "@/lib/format";
import { useState } from "react";
import { UploadDocDialog } from "./UploadDocDialog";
import { NewTaskDialog } from "./NewTaskDialog";

export function ClaimHeaderBar({ claim }: { claim: Claim }) {
  const [uploadOpen, setUploadOpen] = useState(false);
  const [taskOpen, setTaskOpen] = useState(false);
  const status = deriveStatusFromTabs(claim);

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
          <Field label="Status" value={status} />

          <div className="ml-auto flex items-center gap-2">
            {claim.litigationRisk && <FlagChip icon={AlertTriangle} label="Litigation Risk" tone="danger" />}
            {claim.expressFastTrack && <FlagChip icon={Zap} label="Express Claim" tone="success" />}

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

function FlagChip({ icon: Icon, label, tone }: { icon: any; label: string; tone: "danger" | "success" }) {
  const color = tone === "danger" ? "text-danger" : "text-success";
  return (
    <div className={`flex items-center gap-1.5 text-xs px-2 py-1 ${color}`}>
      <Icon className="h-3.5 w-3.5" />
      <span className="font-medium">{label}</span>
    </div>
  );
}
