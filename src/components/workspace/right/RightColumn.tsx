import type { Claim } from "@/types/claim";
import { useApp } from "@/state/AppContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Bot, Activity, ChevronRight, ChevronLeft, User, Cog } from "lucide-react";
import { StatusPill } from "@/components/common/StatusPill";
import { Button } from "@/components/ui/button";
import { HoverLabel } from "@/components/common/HoverLabel";
import { useState } from "react";
import { cn } from "@/lib/utils";

export function RightColumn({ claim }: { claim: Claim }) {
  const { rightCollapsed, toggleRight } = useApp();

  if (rightCollapsed) {
    return (
      <div className="w-10 shrink-0 border-l surface flex flex-col items-center py-2 gap-2">
        <HoverLabel label="Expand panel" side="left">
          <Button size="icon" variant="ghost" className="h-8 w-8" onClick={toggleRight}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
        </HoverLabel>
        <HoverLabel label="AI Agent Hub" side="left">
          <div className="h-8 w-8 flex items-center justify-center text-primary"><Bot className="h-4 w-4" /></div>
        </HoverLabel>
        <HoverLabel label="Process Wall" side="left">
          <div className="h-8 w-8 flex items-center justify-center text-muted-foreground"><Activity className="h-4 w-4" /></div>
        </HoverLabel>
      </div>
    );
  }

  return (
    <aside className="w-80 shrink-0 border-l bg-card flex flex-col">
      <div className="h-10 px-3 flex items-center justify-between border-b">
        <span className="text-sm font-semibold">Operations Panel</span>
        <Button size="icon" variant="ghost" className="h-7 w-7" onClick={toggleRight}>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
      <Tabs defaultValue="agents" className="flex-1 flex flex-col min-h-0">
        <TabsList className="mx-3 mt-2 self-start">
          <TabsTrigger value="agents"><Bot className="h-3.5 w-3.5" /> AI Agents</TabsTrigger>
          <TabsTrigger value="process"><Activity className="h-3.5 w-3.5" /> Process Wall</TabsTrigger>
        </TabsList>
        <div className="flex-1 overflow-auto">
          <TabsContent value="agents" className="mt-2"><AgentList claim={claim} /></TabsContent>
          <TabsContent value="process" className="mt-2"><ProcessWall claim={claim} /></TabsContent>
        </div>
      </Tabs>
    </aside>
  );
}

function AgentList({ claim }: { claim: Claim }) {
  return (
    <div className="px-3 pb-3 space-y-2">
      {claim.aiAgents.map((a) => <AgentItem key={a.id} agent={a} />)}
    </div>
  );
}

function AgentItem({ agent }: { agent: Claim["aiAgents"][number] }) {
  const [open, setOpen] = useState(false);
  const tone = agent.status === "complete" ? "success" : agent.status === "running" ? "info" : agent.status === "error" ? "danger" : "muted";
  return (
    <Collapsible open={open} onOpenChange={setOpen} className="border bg-card">
      <CollapsibleTrigger className="w-full p-2 text-left flex items-center gap-2 hover:bg-surface">
        <Bot className="h-4 w-4 text-primary shrink-0" />
        <div className="flex-1 min-w-0">
          <div className="text-sm font-medium truncate">{agent.name}</div>
          <div className="text-[11px] text-muted-foreground truncate">{agent.lastAction}</div>
        </div>
        <StatusPill tone={tone as any}>{agent.status}</StatusPill>
        <ChevronRight className={cn("h-3.5 w-3.5 transition-transform shrink-0", open && "rotate-90")} />
      </CollapsibleTrigger>
      <CollapsibleContent className="border-t bg-surface px-2 py-2 space-y-1.5">
        {agent.history.length === 0 && <div className="text-xs text-muted-foreground italic">No history.</div>}
        {agent.history.map((h, i) => (
          <div key={i} className="text-xs">
            <div className="font-mono text-[10px] text-muted-foreground">{h.ts}</div>
            <div>{h.action} <span className="text-muted-foreground">— {h.result}</span></div>
          </div>
        ))}
      </CollapsibleContent>
    </Collapsible>
  );
}

function ProcessWall({ claim }: { claim: Claim }) {
  const sorted = [...claim.activity].sort((a, b) => a.ts.localeCompare(b.ts));
  const Icon = (t: string) => (t === "ai" ? Bot : t === "system" ? Cog : User);
  return (
    <div className="px-3 pb-3">
      <ol className="relative border-l border-border ml-2 space-y-3 py-2">
        {sorted.map((a) => {
          const I = Icon(a.actorType);
          return (
            <li key={a.id} className="ml-4">
              <div className="absolute -left-[7px] mt-1 h-3 w-3 bg-card border border-primary" />
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{a.tab}</div>
              <div className="text-xs flex items-start gap-1.5">
                <I className={cn("h-3.5 w-3.5 mt-0.5 shrink-0", a.actorType === "ai" ? "text-primary" : a.actorType === "system" ? "text-warning" : "text-muted-foreground")} />
                <div>
                  <div><span className="font-medium">{a.actor}</span> · {a.action}</div>
                  {a.detail && <div className="text-muted-foreground">{a.detail}</div>}
                  <div className="font-mono text-[10px] text-muted-foreground">{a.ts}</div>
                </div>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
