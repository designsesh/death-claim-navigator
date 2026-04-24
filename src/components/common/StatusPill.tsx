import { cn } from "@/lib/utils";

export function StatusPill({
  tone = "muted",
  children,
  className,
}: {
  tone?: "success" | "warning" | "danger" | "info" | "muted";
  children: React.ReactNode;
  className?: string;
}) {
  const cls = {
    success: "pill-success",
    warning: "pill-warning",
    danger: "pill-danger",
    info: "pill-info",
    muted: "pill-muted",
  }[tone];
  return <span className={cn("pill", cls, className)}>{children}</span>;
}
