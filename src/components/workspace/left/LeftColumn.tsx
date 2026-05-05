import type { Claim } from "@/types/claim";
import { useState } from "react";
import { FolderOpen, Globe2, Mail, AlertCircle, ChevronsLeft, ChevronsRight, Activity as ActivityIcon, ListChecks, StickyNote, Workflow } from "lucide-react";
import { HoverLabel } from "@/components/common/HoverLabel";
import { cn } from "@/lib/utils";
import { DocumentsPanel } from "./DocumentsPanel";
import { ExternalOrderPanel } from "./ExternalOrderPanel";
import { EmailPanel } from "./EmailPanel";
import { ProcessWallPanel } from "./ProcessWallPanel";
import { TasksPanel } from "./TasksPanel";
import { NotesPanel } from "./NotesPanel";
import { ActivityPanel } from "./ActivityPanel";

const TABS = [
  { id: "process", label: "Process Wall", icon: Workflow },
  { id: "activity", label: "Activity", icon: ActivityIcon },
  { id: "documents", label: "Documents", icon: FolderOpen },
  { id: "external", label: "External Order", icon: Globe2 },
  { id: "email", label: "Email", icon: Mail },
  { id: "tasks", label: "Tasks", icon: ListChecks },
  { id: "notes", label: "Notes", icon: StickyNote },
] as const;

type TabId = typeof TABS[number]["id"];

export function LeftColumn({ claim }: { claim: Claim }) {
  const [active, setActive] = useState<TabId>("process");
  const [collapsed, setCollapsed] = useState(false);
  const missingDocs = claim.documents.filter((d) => d.status === "missing").length;
  const pendingTasks = claim.tasks.filter((t) => t.status === "pending").length;

  const alertFor = (id: TabId) => {
    if (id === "documents" && missingDocs > 0) return `${missingDocs} missing`;
    if (id === "tasks" && pendingTasks > 0) return `${pendingTasks} pending`;
    return null;
  };

  const openTab = (id: TabId) => {
    setActive(id);
    if (collapsed) setCollapsed(false);
  };

  if (collapsed) {
    return (
      <div className="w-10 shrink-0 border-r surface flex flex-col py-2 gap-1">
        <HoverLabel label="Expand panel" side="right">
          <button
            onClick={() => setCollapsed(false)}
            className="h-9 w-9 mx-auto flex items-center justify-center text-muted-foreground hover:bg-surface-2"
          >
            <ChevronsRight className="h-4 w-4" />
          </button>
        </HoverLabel>
        <div className="border-b mx-1" />
        {TABS.map((t) => {
          const alert = alertFor(t.id);
          return (
            <HoverLabel key={t.id} label={alert ? `${t.label} — ${alert}` : t.label} side="right">
              <button
                onClick={() => openTab(t.id)}
                className="h-9 w-9 mx-auto flex items-center justify-center text-muted-foreground hover:bg-surface-2 relative"
              >
                <t.icon className="h-4 w-4" />
                {alert && <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-danger" />}
              </button>
            </HoverLabel>
          );
        })}
      </div>
    );
  }

  return (
    <div className="w-[360px] shrink-0 border-r bg-card flex">
      <div className="w-10 shrink-0 border-r surface flex flex-col py-2 gap-1">
        <HoverLabel label="Collapse panel" side="right">
          <button
            onClick={() => setCollapsed(true)}
            className="h-9 w-9 mx-auto flex items-center justify-center text-muted-foreground hover:bg-surface-2"
            aria-label="Collapse panel"
          >
            <ChevronsLeft className="h-4 w-4" />
          </button>
        </HoverLabel>
        <div className="border-b mx-1" />
        {TABS.map((t) => {
          const isActive = active === t.id;
          const alert = alertFor(t.id);
          return (
            <HoverLabel key={t.id} label={alert ? `${t.label} — ${alert}` : t.label} side="right">
              <button
                onClick={() => setActive(t.id)}
                className={cn(
                  "h-9 w-9 mx-auto flex items-center justify-center hover:bg-surface-2 relative",
                  isActive ? "text-foreground bg-surface-2" : "text-muted-foreground",
                )}
              >
                <t.icon className="h-4 w-4" />
                {alert && <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-danger" />}
              </button>
            </HoverLabel>
          );
        })}
      </div>
      <div className="flex-1 min-w-0 flex flex-col">
        <div className="px-3 h-9 border-b flex items-center justify-between text-sm font-semibold">
          <span>{TABS.find((t) => t.id === active)?.label}</span>
          {active === "documents" && missingDocs > 0 && (
            <span className="flex items-center gap-1 text-xs text-danger font-medium">
              <AlertCircle className="h-3.5 w-3.5" /> {missingDocs} missing
            </span>
          )}
          {active === "tasks" && pendingTasks > 0 && (
            <span className="flex items-center gap-1 text-xs text-warning font-medium">
              <AlertCircle className="h-3.5 w-3.5" /> {pendingTasks} pending
            </span>
          )}
        </div>
        <div className="flex-1 overflow-auto">
          {active === "process" && <ProcessWallPanel claim={claim} />}
          {active === "activity" && <ActivityPanel claim={claim} />}
          {active === "documents" && <DocumentsPanel claim={claim} />}
          {active === "external" && <ExternalOrderPanel claim={claim} />}
          {active === "email" && <EmailPanel claim={claim} />}
          {active === "tasks" && <TasksPanel claim={claim} />}
          {active === "notes" && <NotesPanel claim={claim} />}
        </div>
      </div>
    </div>
  );
}
