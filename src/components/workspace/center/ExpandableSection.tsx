import { ReactNode, useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, Maximize2, Minimize2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { SectionLabel } from "@/components/common/SectionLabel";

export function ExpandableSection({
  label,
  children,
  expandedHeight = "max-h-[600px]",
  defaultHeight = "max-h-[260px]",
  rightSlot,
}: {
  label: string;
  children: ReactNode;
  expandedHeight?: string;
  defaultHeight?: string;
  rightSlot?: ReactNode;
}) {
  const [expanded, setExpanded] = useState(false);
  return (
    <section className="border bg-card">
      <header className="flex items-center justify-between px-3 py-2 border-b">
        <SectionLabel>{label}</SectionLabel>
        <div className="flex items-center gap-1">
          {rightSlot}
          <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => setExpanded((e) => !e)}>
            {expanded ? <Minimize2 className="h-3.5 w-3.5" /> : <Maximize2 className="h-3.5 w-3.5" />}
          </Button>
        </div>
      </header>
      <div className={cn("overflow-auto transition-[max-height]", expanded ? expandedHeight : defaultHeight)}>
        {children}
      </div>
    </section>
  );
}
