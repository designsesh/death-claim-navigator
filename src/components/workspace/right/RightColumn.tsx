import type { Claim } from "@/types/claim";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bot, ChevronLeft, ChevronsRight, Bell } from "lucide-react";
import { HoverLabel } from "@/components/common/HoverLabel";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useApp } from "@/state/AppContext";
import { formatDateTimeUS, formatDateUS } from "@/lib/format";

type RightTab = "agents" | "notifications";

const AGENT_NAMES = [
  "Document Extraction Agent",
  "Required Documents Agent",
  "Checklist Generation Agent",
  "Checklist Verification Agent",
  "Policy Document Analysis Agent",
  "Policy Transactions Analysis Agent",
  "Beneficiary Determination Agent",
  "External Data Agent",
  "Observations Agent",
  "Communication Generation Agent",
  "Coverage Validation Agent",
  "Process & Task Agent",
];

export function RightColumn({ claim }: { claim: Claim }) {
  const { rightCollapsed, toggleRight, setRightCollapsed } = useApp();
  const [activeTab, setActiveTab] = useState<RightTab>("process");

  const openTab = (tab: RightTab) => {
    setActiveTab(tab);
    if (rightCollapsed) setRightCollapsed(false);
  };

  if (rightCollapsed) {
    return (
      <div className="w-10 shrink-0 border-l surface flex flex-col py-2 gap-1">
        <HoverLabel label="Expand panel" side="left">
          <button
            onClick={toggleRight}
            className="h-9 w-9 mx-auto flex items-center justify-center text-muted-foreground hover:bg-surface-2"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
        </HoverLabel>
        <div className="border-b mx-1" />
        <HoverLabel label="Process Wall" side="left">
          <button onClick={() => openTab("process")} className="h-9 w-9 mx-auto flex items-center justify-center text-muted-foreground hover:bg-surface-2">
            <ActivityIcon className="h-4 w-4" />
          </button>
        </HoverLabel>
        <HoverLabel label="AI Agents" side="left">
          <button onClick={() => openTab("agents")} className="h-9 w-9 mx-auto flex items-center justify-center text-muted-foreground hover:bg-surface-2">
            <Bot className="h-4 w-4" />
          </button>
        </HoverLabel>
        <HoverLabel label="Notifications" side="left">
          <button onClick={() => openTab("notifications")} className="h-9 w-9 mx-auto flex items-center justify-center text-muted-foreground hover:bg-surface-2">
            <Bell className="h-4 w-4" />
          </button>
        </HoverLabel>
      </div>
    );
  }

  return (
    <aside className="w-[340px] shrink-0 border-l bg-card flex flex-col">
      <div className="h-10 px-2 flex items-center border-b gap-1">
        <button
          onClick={toggleRight}
          className="h-7 w-7 flex items-center justify-center text-muted-foreground hover:bg-surface"
          aria-label="Collapse panel"
        >
          <ChevronsRight className="h-4 w-4" />
        </button>
        <span className="text-sm font-semibold">Operations Panel</span>
      </div>
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as RightTab)} className="flex-1 flex flex-col min-h-0">
        <TabsList className="mx-3 mt-2 self-start">
          <TabsTrigger value="process"><ActivityIcon className="h-3.5 w-3.5" /> Process</TabsTrigger>
          <TabsTrigger value="agents"><Bot className="h-3.5 w-3.5" /> Agents</TabsTrigger>
          <TabsTrigger value="notifications"><Bell className="h-3.5 w-3.5" /> Notifications</TabsTrigger>
        </TabsList>
        <div className="flex-1 overflow-auto">
          <TabsContent value="process" className="mt-2"><ProcessWall claim={claim} /></TabsContent>
          <TabsContent value="agents" className="mt-2"><AgentList claim={claim} /></TabsContent>
          <TabsContent value="notifications" className="mt-2"><NotificationsList claim={claim} /></TabsContent>
        </div>
      </Tabs>
    </aside>
  );
}

/* ---------- Process Wall ---------- */

const PROCESS_SECTIONS: { key: ActivityEntry["tab"]; label: string; checklistKey?: keyof Claim["checklists"] }[] = [
  { key: "fnol", label: "FNOL" },
  { key: "claims", label: "Claims", checklistKey: "claims" },
  { key: "policy", label: "Policy", checklistKey: "policy" },
  { key: "beneficiary", label: "Beneficiary", checklistKey: "beneficiary" },
  { key: "settlement", label: "Beneficiary Settlement", checklistKey: "settlement" },
  { key: "payout", label: "Payout", checklistKey: "payout" },
];

function ProcessWall({ claim }: { claim: Claim }) {
  const [openMap, setOpenMap] = useState<Record<string, boolean>>(
    () => Object.fromEntries(PROCESS_SECTIONS.map((s, i) => [s.key, i < 2])),
  );

  return (
    <div className="px-3 pb-3 space-y-2">
      {PROCESS_SECTIONS.map((section) => {
        const items = claim.activity
          .filter((a) => a.tab === section.key)
          .sort((a, b) => a.ts.localeCompare(b.ts));
        const remaining: ChecklistItem[] = section.checklistKey
          ? claim.checklists[section.checklistKey].filter((i) => i.status !== "verified")
          : [];
        const open = openMap[section.key];
        return (
          <Collapsible
            key={section.key}
            open={open}
            onOpenChange={(o) => setOpenMap((m) => ({ ...m, [section.key]: o }))}
            className="border bg-card"
          >
            <CollapsibleTrigger className="w-full px-2 py-1.5 flex items-center gap-2 hover:bg-surface text-left">
              <ChevronRight className={cn("h-3.5 w-3.5 transition-transform shrink-0", open && "rotate-90")} />
              <span className="text-xs font-semibold flex-1">{section.label}</span>
              <span className="num text-[10px] text-muted-foreground">{items.length} done</span>
              {remaining.length > 0 && (
                <span className="num text-[10px] text-warning">{remaining.length} todo</span>
              )}
            </CollapsibleTrigger>
            <CollapsibleContent className="border-t px-2 py-2 space-y-3">
              {/* Activity */}
              <div>
                <div className="label-tracked mb-1.5">Activity</div>
                {items.length === 0 ? (
                  <div className="text-[11px] italic text-muted-foreground">No activity yet.</div>
                ) : (
                  <ol className="relative border-l ml-1.5 space-y-2 py-1">
                    {items.map((a) => {
                      const I = a.actorType === "ai" ? Bot : a.actorType === "system" ? Cog : User;
                      return (
                        <li key={a.id} className="ml-3 relative">
                          <div className="absolute -left-[7px] mt-1 h-2 w-2 bg-card border border-primary" />
                          <div className="text-[11px]">
                            <div className="flex items-center gap-1">
                              <I className={cn("h-3 w-3 shrink-0", a.actorType === "ai" ? "text-primary" : a.actorType === "system" ? "text-warning" : "text-muted-foreground")} />
                              <span className="font-medium">{a.actor}</span>
                            </div>
                            <div>{a.action}</div>
                            {a.detail && <div className="text-muted-foreground">{a.detail}</div>}
                            <div className="num text-[10px] text-muted-foreground">{formatDateTimeUS(a.ts)}</div>
                          </div>
                        </li>
                      );
                    })}
                  </ol>
                )}
              </div>
              {/* Remaining tasks */}
              {remaining.length > 0 && (
                <div>
                  <div className="label-tracked mb-1.5">Remaining</div>
                  <ul className="space-y-1.5">
                    {remaining.map((r) => (
                      <li key={r.id} className="flex items-start gap-2 text-[11px]">
                        <Circle className={cn("h-3 w-3 mt-0.5 shrink-0", r.status === "mismatch" ? "text-danger" : "text-warning")} />
                        <div className="flex-1">
                          <div>{r.label}</div>
                          {r.detail && <div className="text-muted-foreground">{r.detail}</div>}
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </CollapsibleContent>
          </Collapsible>
        );
      })}
    </div>
  );
}

/* ---------- Agents ---------- */

function AgentList({ claim }: { claim: Claim }) {
  const known = new Map(claim.aiAgents.map((a) => [a.name, a]));
  return (
    <div className="px-3 pb-3 space-y-1.5">
      {AGENT_NAMES.map((name) => {
        const a = known.get(name);
        const status = a?.status ?? "idle";
        const tone =
          status === "complete" ? "text-success" :
          status === "running"  ? "text-info"    :
          status === "error"    ? "text-danger"  :
                                  "text-muted-foreground";
        return (
          <div key={name} className="border bg-card p-2 flex items-start gap-2">
            <Bot className="h-4 w-4 text-primary shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <div className="text-xs font-medium">{name}</div>
              <div className="text-[11px] text-muted-foreground truncate">
                {a?.lastAction ?? "Awaiting trigger"}
              </div>
            </div>
            <span className={cn("text-[10px] uppercase tracking-wider", tone)}>{status}</span>
          </div>
        );
      })}
    </div>
  );
}

/* ---------- Notifications ---------- */

type Notif = { id: string; ts: string; tone: "warning" | "info" | "success" | "danger"; text: string };

function buildNotifications(claim: Claim): Notif[] {
  const out: Notif[] = [];

  // Activity-derived
  claim.activity.slice(-12).forEach((a) => {
    let tone: Notif["tone"] = "info";
    const text = `${claim.id} — ${a.action}`;
    if (/mismatch|hit|risk|blocked/i.test(a.action + " " + (a.detail ?? ""))) tone = "warning";
    if (/clear|complete|verified|passed/i.test(a.action)) tone = "success";
    if (/litigation|reject/i.test(a.action)) tone = "danger";
    out.push({ id: a.id, ts: a.ts, tone, text });
  });

  // Status-derived alerts
  if (claim.litigationRisk) {
    out.push({ id: `lit-${claim.id}`, ts: claim.createdAt, tone: "danger", text: `${claim.id} — Litigation risk flag active` });
  }
  const missingDocs = claim.documents.filter((d) => d.status === "missing").length;
  if (missingDocs) {
    out.push({ id: `doc-${claim.id}`, ts: claim.createdAt, tone: "warning", text: `${claim.id} — ${missingDocs} required document${missingDocs > 1 ? "s" : ""} missing` });
  }

  return out.sort((a, b) => b.ts.localeCompare(a.ts));
}

function NotificationsList({ claim }: { claim: Claim }) {
  const items = buildNotifications(claim);

  return (
    <div className="px-3 pb-3">
      <div className="label-tracked mb-2">Alerts</div>
      <div className="divide-y border-y">
        {items.length === 0 && (
          <div className="py-4 text-center text-xs text-muted-foreground italic">No notifications.</div>
        )}
        {items.map((n) => {
          const border =
            n.tone === "danger"  ? "border-l-danger"  :
            n.tone === "warning" ? "border-l-warning" :
            n.tone === "success" ? "border-l-success" :
                                   "border-l-primary";
          return (
            <div key={n.id} className={cn("flex gap-3 py-3 pl-3 border-l-2", border)}>
              <div className="flex-1 min-w-0">
                <div className="text-sm leading-snug">{n.text}</div>
                <div className="num text-[11px] text-muted-foreground mt-1">{formatDateTimeUS(n.ts)}</div>
              </div>
            </div>
          );
        })}
      </div>
      <div className="text-[11px] text-muted-foreground mt-3">
        Showing alerts for {formatDateUS(claim.createdAt)} onward.
      </div>
    </div>
  );
}
