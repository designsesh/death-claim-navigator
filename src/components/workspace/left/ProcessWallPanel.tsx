import type { Claim } from "@/types/claim";
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

type StepStatus = "complete" | "in-progress" | "flagged" | "pending";
type StageStatus = "complete" | "in-progress" | "pending";

interface Step {
  label: string;
  status: StepStatus;
}

interface Stage {
  key: string;
  title: string;
  subtitle: string;
  status: StageStatus;
  steps: Step[];
}

const STAGES: Stage[] = [
  {
    key: "fnol",
    title: "FNOL",
    subtitle: "Intimation",
    status: "complete",
    steps: [
      { label: "Identify Beneficiary or Nominee Details", status: "complete" },
      { label: "Send Claim Form to Claimant", status: "complete" },
      { label: "Acknowledge Claim Intimation", status: "complete" },
      { label: "Freeze Policy for Claim Processing", status: "complete" },
    ],
  },
  {
    key: "claim-review",
    title: "Claim Review",
    subtitle: "Claims Data Entry & Scrutiny",
    status: "complete",
    steps: [
      { label: "Facilitate Form Exchange", status: "complete" },
      { label: "Send Reminders to Claimant or Beneficiary", status: "complete" },
      { label: "Review Submitted Documents", status: "complete" },
      { label: "Validate External Data Sources", status: "complete" },
    ],
  },
  {
    key: "policy-review",
    title: "Policy Review",
    subtitle: "Policy & Claim Verification",
    status: "complete",
    steps: [
      { label: "Verify Policy Details", status: "complete" },
      { label: "Verify Payment Details", status: "complete" },
      { label: "Verify Outstanding Loan Details", status: "complete" },
      { label: "Verify Reversals, if Any", status: "complete" },
    ],
  },
  {
    key: "beneficiary-id",
    title: "Beneficiary Identification",
    subtitle: "Beneficiary & Relationship Evidence",
    status: "in-progress",
    steps: [
      { label: "Verify Claimant Information", status: "flagged" },
      { label: "Verify Trust Details", status: "pending" },
      { label: "Verify Estate Details", status: "pending" },
      { label: "Verify Child Beneficiary Details", status: "pending" },
    ],
  },
  {
    key: "settlement",
    title: "Beneficiary Settlement",
    subtitle: "Calculation & Settlement",
    status: "pending",
    steps: [
      { label: "Validate Loan Information", status: "pending" },
      { label: "Validate Rider Details", status: "pending" },
      { label: "Calculate Interest (if Applicable)", status: "pending" },
      { label: "Apply Deductions and Outstanding Premiums", status: "pending" },
      { label: "Process Beneficiary Splits", status: "pending" },
      { label: "Review Beneficiary Checks", status: "pending" },
    ],
  },
  {
    key: "payout",
    title: "Payout",
    subtitle: "Payout & Closure",
    status: "pending",
    steps: [
      { label: "Process Payout Methods", status: "pending" },
      { label: "Calculate 1099 Tax", status: "pending" },
      { label: "Conduct Anti-Money Laundering (AML) Review", status: "pending" },
      { label: "Generate Payment Authorization", status: "pending" },
      { label: "Verify Payment Confirmation", status: "pending" },
      { label: "Close Policy", status: "pending" },
    ],
  },
];

const BULLET_COLOR: Record<StepStatus, string> = {
  complete: "bg-success",
  "in-progress": "bg-warning",
  flagged: "bg-danger",
  pending: "bg-muted-foreground/40",
};

export function ProcessWallPanel({ claim: _claim }: { claim: Claim }) {
  const [open, setOpen] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(STAGES.map((s) => [s.key, s.status !== "complete"])),
  );

  return (
    <div className="px-4 py-5">
      <div className="relative">
        {/* spine */}
        <div className="absolute left-[5px] top-1 bottom-1 w-px bg-border" />

        <ul className="space-y-8">
          {STAGES.map((stage) => {
            const isOpen = open[stage.key];
            return (
              <li key={stage.key} className="relative pl-6">
                {/* dot */}
                <span className="absolute left-0 top-[6px] h-[11px] w-[11px] rounded-full bg-muted-foreground/70 ring-2 ring-card" />

                <button
                  onClick={() => setOpen((m) => ({ ...m, [stage.key]: !m[stage.key] }))}
                  className="w-full flex items-start justify-between gap-2 text-left group"
                >
                  <div className="min-w-0">
                    <div className="text-[12px] font-medium text-foreground leading-tight">
                      {stage.title}
                    </div>
                    <div className="text-[12px] text-muted-foreground leading-tight mt-0.5">
                      {stage.subtitle}
                    </div>
                  </div>
                  <ChevronDown
                    className={cn(
                      "h-3.5 w-3.5 text-muted-foreground shrink-0 mt-1 transition-transform",
                      isOpen && "rotate-180",
                    )}
                  />
                </button>

                {isOpen && (
                  <ul className="mt-3 space-y-[10px]">
                    {stage.steps.map((step, i) => (
                      <li key={i} className="flex items-center gap-2.5">
                        <span
                          className={cn("h-2 w-2 rounded-full shrink-0", BULLET_COLOR[step.status])}
                        />
                        <span className="text-[12px] font-normal text-foreground/90 leading-snug">
                          {step.label}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
