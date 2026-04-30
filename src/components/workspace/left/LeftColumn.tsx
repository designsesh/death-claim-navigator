import type { Claim } from "@/types/claim";
import { useState } from "react";
import { FileText, Shield, FolderOpen, Globe2, Mail, AlertCircle, ChevronsLeft, ChevronsRight } from "lucide-react";
import { HoverLabel } from "@/components/common/HoverLabel";
import { cn } from "@/lib/utils";
import { FNOLPanel } from "./FNOLPanel";
import { PolicyPanel } from "./PolicyPanel";
import { DocumentsPanel } from "./DocumentsPanel";
import { ExternalOrderPanel } from "./ExternalOrderPanel";
import { EmailPanel } from "./EmailPanel";

const TABS = [
  { id: "fnol", label: "FNOL", icon: FileText },
  { id: "policy", label: "Policy", icon: Shield },
  { id: "documents", label: "Documents", icon: FolderOpen },
  { id: "external", label: "External Order", icon: Globe2 },
  { id: "email", label: "Email", icon: Mail },
] as const;

type TabId = typeof TABS[number]["id"];

export function LeftColumn({ claim }: { claim: Claim }) {
  const [active, setActive] = useState<TabId>("fnol");
  const [collapsed, setCollapsed] = useState(false);
  const missingDocs = claim.documents.filter((d) => d.status === "missing").length;

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
          const showAlert = t.id === "documents" && missingDocs > 0;
          return (
            <HoverLabel key={t.id} label={showAlert ? `${t.label} — ${missingDocs} missing` : t.label} side="right">
              <button
                onClick={() => openTab(t.id)}
                className="h-9 w-9 mx-auto flex items-center justify-center text-muted-foreground hover:bg-surface-2 relative"
              >
                <t.icon className="h-4 w-4" />
                {showAlert && (
                  <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-danger" />
                )}
              </button>
            </HoverLabel>
          );
        })}
      </div>
    );
  }

  return (
    <div className="w-[360px] shrink-0 border-r bg-card flex flex-col">
      <div className="h-10 px-2 flex items-center border-b gap-1">
        <button
          onClick={() => setCollapsed(true)}
          className="h-7 w-7 flex items-center justify-center text-muted-foreground hover:bg-surface"
          aria-label="Collapse panel"
        >
          <ChevronsLeft className="h-4 w-4" />
        </button>
        <div className="flex-1 flex items-center gap-0.5 overflow-x-auto">
          {TABS.map((t) => {
            const isActive = active === t.id;
            const showAlert = t.id === "documents" && missingDocs > 0;
            return (
              <button
                key={t.id}
                onClick={() => setActive(t.id)}
                className={cn(
                  "h-7 px-2 text-xs flex items-center gap-1 transition-colors relative",
                  isActive ? "text-foreground border-b-2 border-b-primary -mb-px" : "text-muted-foreground hover:text-foreground",
                )}
              >
                <t.icon className="h-3.5 w-3.5" />
                <span className="hidden xl:inline">{t.label}</span>
                {showAlert && (
                  <span className="h-1.5 w-1.5 rounded-full bg-danger" />
                )}
              </button>
            );
          })}
        </div>
      </div>
      <div className="px-3 h-9 border-b flex items-center justify-between text-sm font-semibold">
        <span>{TABS.find((t) => t.id === active)?.label}</span>
        {active === "documents" && missingDocs > 0 && (
          <span className="flex items-center gap-1 text-xs text-danger font-medium">
            <AlertCircle className="h-3.5 w-3.5" /> {missingDocs} missing
          </span>
        )}
      </div>
      <div className="flex-1 overflow-auto">
        {active === "fnol" && <FNOLPanel claim={claim} />}
        {active === "policy" && <PolicyPanel claim={claim} />}
        {active === "documents" && <DocumentsPanel claim={claim} />}
        {active === "external" && <ExternalOrderPanel claim={claim} />}
        {active === "email" && <EmailPanel claim={claim} />}
      </div>
    </div>
  );
}
