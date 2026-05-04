import type { Claim, TabKey } from "@/types/claim";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useApp } from "@/state/AppContext";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

const SECTIONS: TabKey[] = ["claims", "policy", "beneficiary", "settlement", "payout"];
const ASSIGNEES = ["Marcus Chen", "Priya Nair", "External — Beneficiary", "Process & Task Agent"];
const CURRENT_USER = "Sarah Mitchell";

interface Prefill {
  title?: string;
  description?: string;
  section?: TabKey;
}

export function NewTaskDialog({
  claim,
  open,
  onOpenChange,
  prefill,
}: {
  claim: Claim;
  open: boolean;
  onOpenChange: (v: boolean) => void;
  prefill?: Prefill;
}) {
  const { updateClaim } = useApp();
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [mode, setMode] = useState<"self" | "other">("self");
  const [assignee, setAssignee] = useState(ASSIGNEES[0]);
  const [section, setSection] = useState<TabKey>("claims");

  useEffect(() => {
    if (open) {
      setTitle(prefill?.title ?? "");
      setDesc(prefill?.description ?? "");
      setSection(prefill?.section ?? "claims");
      setMode("self");
      setAssignee(ASSIGNEES[0]);
    }
  }, [open, prefill]);

  const create = () => {
    if (!title.trim()) return;
    const finalAssignee = mode === "self" ? CURRENT_USER : assignee;
    const ts = new Date().toISOString().slice(0, 16).replace("T", " ");
    updateClaim(claim.id, (c) => ({
      ...c,
      tasks: [
        ...c.tasks,
        {
          id: `T-${Date.now()}`,
          title: title.trim(),
          description: desc.trim() || undefined,
          assignee: finalAssignee,
          selfAssigned: mode === "self",
          status: "pending",
          createdAt: ts,
          section,
          createdBy: CURRENT_USER,
        },
      ],
      activity: [
        ...c.activity,
        {
          id: `A-${Date.now()}`,
          ts,
          actor: CURRENT_USER,
          actorType: "human",
          action: `Task created — ${title.trim()}`,
          detail: `Assigned to ${finalAssignee}.`,
          tab: section,
        },
      ],
    }));
    toast({ title: "Task created", description: `${title} → ${finalAssignee}` });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Task</DialogTitle>
          <DialogDescription>Self-assign or assign to a teammate or agent for this claim.</DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
          <div className="space-y-1">
            <div className="label-tracked">Title</div>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Confirm DOB with claimant" />
          </div>
          <div className="space-y-1">
            <div className="label-tracked">Description</div>
            <Textarea value={desc} onChange={(e) => setDesc(e.target.value)} className="min-h-[80px]" />
          </div>

          <div className="space-y-1">
            <div className="label-tracked">Assignment</div>
            <div className="inline-flex border">
              <button
                type="button"
                onClick={() => setMode("self")}
                className={cn("px-3 py-1.5 text-xs", mode === "self" ? "bg-primary text-primary-foreground" : "hover:bg-surface")}
              >
                Self-assigned
              </button>
              <button
                type="button"
                onClick={() => setMode("other")}
                className={cn("px-3 py-1.5 text-xs border-l", mode === "other" ? "bg-primary text-primary-foreground" : "hover:bg-surface")}
              >
                Assign to someone
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <div className="label-tracked">Section</div>
              <Select value={section} onValueChange={(v) => setSection(v as TabKey)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {SECTIONS.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <div className="label-tracked">Assignee</div>
              {mode === "self" ? (
                <div className="h-10 px-3 border flex items-center text-sm bg-surface text-muted-foreground">{CURRENT_USER}</div>
              ) : (
                <Select value={assignee} onValueChange={setAssignee}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {ASSIGNEES.map((a) => <SelectItem key={a} value={a}>{a}</SelectItem>)}
                  </SelectContent>
                </Select>
              )}
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={create} disabled={!title.trim()}>Create Task</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
