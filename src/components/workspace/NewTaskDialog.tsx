import type { Claim } from "@/types/claim";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useApp } from "@/state/AppContext";
import { toast } from "@/hooks/use-toast";

const SECTIONS = ["fnol", "claims", "policy", "beneficiary", "settlement", "payout"] as const;
const ASSIGNEES = ["Sarah Mitchell", "Marcus Chen", "Priya Nair", "External — Beneficiary", "Process & Task Agent"];

export function NewTaskDialog({
  claim,
  open,
  onOpenChange,
}: {
  claim: Claim;
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const { updateClaim } = useApp();
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [assignee, setAssignee] = useState(ASSIGNEES[0]);
  const [section, setSection] = useState<typeof SECTIONS[number]>("claims");

  const create = () => {
    if (!title.trim()) return;
    updateClaim(claim.id, (c) => ({
      ...c,
      activity: [
        ...c.activity,
        {
          id: `T-${Date.now()}`,
          ts: new Date().toISOString().slice(0, 16).replace("T", " "),
          actor: "Sarah Mitchell",
          actorType: "human",
          action: `Task created — ${title.trim()}`,
          detail: desc ? `Assigned to ${assignee}. ${desc}` : `Assigned to ${assignee}.`,
          tab: section,
        },
      ],
    }));
    toast({ title: "Task created", description: `${title} → ${assignee}` });
    setTitle(""); setDesc("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Task</DialogTitle>
          <DialogDescription>Assign a task to a teammate, agent, or external party for this claim.</DialogDescription>
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
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <div className="label-tracked">Section</div>
              <Select value={section} onValueChange={(v) => setSection(v as any)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {SECTIONS.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <div className="label-tracked">Assign to</div>
              <Select value={assignee} onValueChange={setAssignee}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {ASSIGNEES.map((a) => <SelectItem key={a} value={a}>{a}</SelectItem>)}
                </SelectContent>
              </Select>
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
