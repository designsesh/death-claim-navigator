import { cn } from "@/lib/utils";

export function SectionLabel({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("label-tracked", className)}>{children}</div>;
}
