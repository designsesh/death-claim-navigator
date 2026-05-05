import type { Claim, TabKey } from "@/types/claim";
import { useMemo, useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

type StepStatus = "complete" | "in-progress" | "pending";
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

interface StageDef {
  key: string;
  tabKey: TabKey | "fnol";
  title: string;
  subtitle: string;
  steps: string[];
}

const STAGE_DEFS: StageDef[] = [
  {
    key: "fnol",
    tabKey: "fnol",
    title: "FNOL",
    subtitle: "Intimation",
    steps: [
      "Identify Beneficiary or Nominee Details",
      "Send Claim Form to Claimant",
      "Acknowledge Claim Intimation",
      "Freeze Policy for Claim Processing",
    ],
  },
  {
    key: "claim-review",
    tabKey: "claims",
    title: "Claim Review",
    subtitle: "Claims Data Entry & Scrutiny",
    steps: [
      "Facilitate Form Exchange",
      "Send Reminders to Claimant or Beneficiary",
      "Review Submitted Documents",
      "Validate External Data Sources",
    ],
  },
  {
    key: "policy-review",
    tabKey: "policy",
    title: "Policy Review",
    subtitle: "Policy & Claim Verification",
    steps: [
      "Verify Policy Details",
      "Verify Payment Details",
      "Verify Outstanding Loan Details",
      "Verify Reversals, if Any",
    ],
  },
  {
    key: "beneficiary-id",
    tabKey: "beneficiary",
    title: "Beneficiary Identification",
    subtitle: "Beneficiary & Relationship Evidence",
    steps: [
      "Verify Claimant Information",
      "Verify Trust Details",
      "Verify Estate Details",
      "Verify Child Beneficiary Details",
    ],
  },
  {
    key: "settlement",
    tabKey: "settlement",
    title: "Beneficiary Settlement",
    subtitle: "Calculation & Settlement",
    steps: [
      "Validate Loan Information",
      "Validate Rider Details",
      "Calculate Interest (if Applicable)",
      "Apply Deductions and Outstanding Premiums",
      "Process Beneficiary Splits",
      "Review Beneficiary Checks",
    ],
  },
  {
    key: "payout",
    tabKey: "payout",
    title: "Payout",
    subtitle: "Payout & Closure",
    steps: [
      "Process Payout Methods",
      "Calculate 1099 Tax",
      "Conduct Anti-Money Laundering (AML) Review",
      "Generate Payment Authorization",
      "Verify Payment Confirmation",
      "Close Policy",
    ],
  },
];

const BULLET_COLOR: Record<StepStatus, string> = {
  complete: "bg-success",
  "in-progress": "bg-warning",
  pending: "bg-muted-foreground/40",
};

const DOT_COLOR: Record<StageStatus, string> = {
  complete: "bg-success",
  "in-progress": "bg-warning",
  pending: "bg-muted-foreground/70",
};

function buildStages(claim: Claim): Stage[] {
  // FNOL is always considered complete (intimation already happened to create the claim)
  // For each tab stage: "done" → complete; first non-done → in-progress; rest → pending
  const tabOrder: TabKey[] = ["claims", "policy", "beneficiary", "settlement", "payout"];
  let foundCurrent = false;
  const tabStatus: Record<TabKey, StageStatus> = {} as Record<TabKey, StageStatus>;
  for (const k of tabOrder) {
    if (claim.tabStates[k] === "done") {
      tabStatus[k] = "complete";
    } else if (!foundCurrent) {
      tabStatus[k] = "in-progress";
      foundCurrent = true;
    } else {
      tabStatus[k] = "pending";
    }
  }

  return STAGE_DEFS.map((def) => {
    const status: StageStatus = def.tabKey === "fnol" ? "complete" : tabStatus[def.tabKey];
    const stepStatus: StepStatus =
      status === "complete" ? "complete" : "pending";
    return {
      key: def.key,
      title: def.title,
      subtitle: def.subtitle,
      status,
      steps: def.steps.map((label) => ({ label, status: stepStatus })),
    };
  });
}

export function ProcessWallPanel({ claim }: { claim: Claim }) {
  const stages = useMemo(() => buildStages(claim), [claim]);
  const [open, setOpen] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(stages.map((s) => [s.key, s.status !== "complete"])),
  );

  return (
    <div className="px-4 py-5">
      <div className="relative">
        {/* spine */}
        <div className="absolute left-[5px] top-1 bottom-1 w-px bg-border" />

        <ul className="space-y-8">
          {stages.map((stage) => {
            const isOpen = open[stage.key];
            return (
              <li key={stage.key} className="relative pl-6">
                {/* dot */}
                <span
                  className={cn(
                    "absolute left-0 top-[6px] h-[11px] w-[11px] rounded-full ring-2 ring-card",
                    DOT_COLOR[stage.status],
                  )}
                />

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
