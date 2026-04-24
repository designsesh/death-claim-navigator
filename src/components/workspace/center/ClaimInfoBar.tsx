import type { Claim } from "@/types/claim";
import { StatusPill } from "@/components/common/StatusPill";
import { Scale, Zap, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

export function ClaimInfoBar({ claim }: { claim: Claim }) {
  return (
    <div className="border-b bg-card px-4 py-3 flex flex-wrap items-center gap-x-6 gap-y-2">
      <div className="flex items-center gap-2">
        <span className="label-tracked">Claim ID</span>
        <span className="font-mono text-sm font-semibold">{claim.id}</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="label-tracked">Deceased</span>
        <span className="text-sm font-medium">
          {claim.death.salutation} {claim.death.firstName} {claim.death.lastName}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <span className="label-tracked">DOD</span>
        <span className="font-mono text-sm">{claim.death.dod}</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="label-tracked">Cause</span>
        <span className="text-sm">{claim.death.cause}</span>
      </div>

      <div className="ml-auto flex items-center gap-2">
        <FlagBox active={claim.litigationRisk} icon={Scale} label="Litigation Risk" tone="danger" />
        <FlagBox active={claim.expressFastTrack} icon={Zap} label="Express Fast-Track" tone="success" />
        <div className="flex items-center gap-1.5 text-xs px-2 py-1.5 border bg-surface">
          <Clock className="h-3.5 w-3.5 text-muted-foreground" />
          <span className="text-muted-foreground">ETC</span>
          <span className="font-mono font-semibold">{claim.estimatedCompletion}</span>
        </div>
      </div>
    </div>
  );
}

function FlagBox({ active, icon: Icon, label, tone }: { active: boolean; icon: any; label: string; tone: "danger" | "success" }) {
  return (
    <div
      className={cn(
        "flex items-center gap-1.5 text-xs px-2 py-1.5 border transition-colors",
        active
          ? tone === "danger"
            ? "border-danger bg-danger-muted text-danger"
            : "border-success bg-success-muted text-success"
          : "border-border bg-surface text-muted-foreground opacity-60",
      )}
    >
      <Icon className="h-3.5 w-3.5" />
      <span className="font-medium">{label}</span>
    </div>
  );
}
