import type { Claim } from "@/types/claim";
import { useState } from "react";
import { FileText, Shield, FolderOpen, Globe2, Mail, AlertCircle } from "lucide-react";
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
  const missingDocs = claim.documents.filter((d) => d.status === "missing").length;

  return (
    <div className="h-full flex bg-card border-r">
      {/* icon rail */}
      <div className="w-10 border-r flex flex-col py-2 gap-1 surface">
        {TABS.map((t) => {
          const isActive = active === t.id;
          const showAlert = t.id === "documents" && missingDocs > 0;
          return (
            <HoverLabel key={t.id} label={showAlert ? `${t.label} — ${missingDocs} missing` : t.label} side="right">
              <button
                onClick={() => setActive(t.id)}
                className={cn(
                  "h-9 w-9 mx-auto flex items-center justify-center transition-colors relative",
                  isActive ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-surface-2",
                )}
              >
                <t.icon className="h-4 w-4" />
                {showAlert && (
                  <span className="absolute -top-0.5 -right-0.5 h-3.5 w-3.5 bg-danger text-danger-foreground rounded-full flex items-center justify-center">
                    <AlertCircle className="h-3 w-3" />
                  </span>
                )}
              </button>
            </HoverLabel>
          );
        })}
      </div>

      <div className="flex-1 flex flex-col min-w-0">
        <div className="h-10 px-4 border-b flex items-center justify-between text-sm font-semibold">
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
    </div>
  );
}
