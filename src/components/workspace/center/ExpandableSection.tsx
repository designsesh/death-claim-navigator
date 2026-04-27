import { ReactNode, useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";
import { SectionLabel } from "@/components/common/SectionLabel";

export function ExpandableSection({
  label,
  children,
  extended,
  rightSlot,
  defaultExpanded = false,
}: {
  label: string;
  children: ReactNode;
  /** Optional richer view shown when expanded. If omitted, the section just toggles visibility of `children`. */
  extended?: ReactNode;
  rightSlot?: ReactNode;
  defaultExpanded?: boolean;
}) {
  const [expanded, setExpanded] = useState(defaultExpanded);
  return (
    <section className="border bg-card">
      <header className="flex items-center justify-between px-3 py-2 border-b">
        <SectionLabel>{label}</SectionLabel>
        <div className="flex items-center gap-1">
          {rightSlot}
          <Button size="sm" variant="ghost" className="h-7 text-xs gap-1" onClick={() => setExpanded((e) => !e)}>
            {expanded ? <><ChevronUp className="h-3.5 w-3.5" /> Show less</> : <><ChevronDown className="h-3.5 w-3.5" /> Show more</>}
          </Button>
        </div>
      </header>
      <div>
        {children}
        {expanded && extended && <div className="border-t bg-surface/50">{extended}</div>}
      </div>
    </section>
  );
}
