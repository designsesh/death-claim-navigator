import type { Claim } from "@/types/claim";
import { useApp } from "@/state/AppContext";
import { Checkbox } from "@/components/ui/checkbox";
import { formatDateTimeUS, TAB_LABELS } from "@/lib/format";
import { cn } from "@/lib/utils";

export function TasksPanel({ claim }: { claim: Claim }) {
  const { updateClaim } = useApp();
  const pending = claim.tasks.filter((t) => t.status === "pending");
  const done = claim.tasks.filter((t) => t.status === "done");

  const toggle = (id: string) => {
    updateClaim(claim.id, (c) => ({
      ...c,
      tasks: c.tasks.map((t) =>
        t.id === id ? { ...t, status: t.status === "pending" ? "done" : "pending" } : t,
      ),
    }));
  };

  return (
    <div className="p-3 space-y-4">
      <Group title={`Pending (${pending.length})`}>
        {pending.length === 0 ? (
          <Empty text="No pending tasks." />
        ) : (
          pending.map((t) => <TaskRow key={t.id} t={t} onToggle={() => toggle(t.id)} />)
        )}
      </Group>
      <Group title={`Done (${done.length})`}>
        {done.length === 0 ? (
          <Empty text="No completed tasks yet." />
        ) : (
          done.map((t) => <TaskRow key={t.id} t={t} onToggle={() => toggle(t.id)} />)
        )}
      </Group>
    </div>
  );
}

function Group({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <div className="label-tracked">{title}</div>
      <div className="space-y-1.5">{children}</div>
    </div>
  );
}
function Empty({ text }: { text: string }) {
  return <div className="text-[11px] italic text-muted-foreground">{text}</div>;
}

function TaskRow({ t, onToggle }: { t: Claim["tasks"][number]; onToggle: () => void }) {
  const isDone = t.status === "done";
  return (
    <div className="border bg-card p-2 flex items-start gap-2">
      <Checkbox checked={isDone} onCheckedChange={onToggle} className="mt-0.5" />
      <div className="flex-1 min-w-0">
        <div className={cn("text-xs font-medium", isDone && "line-through text-muted-foreground")}>{t.title}</div>
        {t.description && <div className="text-[11px] text-muted-foreground truncate">{t.description}</div>}
        <div className="text-[10px] text-muted-foreground mt-0.5 flex flex-wrap gap-x-2 num">
          <span>{TAB_LABELS[t.section]}</span>
          <span>· {t.assignee}{t.selfAssigned ? " (self)" : ""}</span>
          <span>· {formatDateTimeUS(t.createdAt)}</span>
        </div>
      </div>
    </div>
  );
}
