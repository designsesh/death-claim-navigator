import type { Claim, EmailMessage } from "@/types/claim";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Paperclip, Sparkles, Mail } from "lucide-react";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";

export function EmailPanel({ claim }: { claim: Claim }) {
  const [open, setOpen] = useState<EmailMessage | null>(null);

  if (open) {
    return (
      <div className="p-4 space-y-3">
        <button onClick={() => setOpen(null)} className="text-xs text-primary flex items-center gap-1 hover:underline">
          <ChevronLeft className="h-3.5 w-3.5" /> Back to inbox
        </button>
        <div>
          <div className="text-sm font-semibold">{open.subject}</div>
          <div className="text-xs text-muted-foreground mt-1">
            From <span className="font-medium">{open.fromName}</span> · {open.from}
          </div>
          <div className="text-xs text-muted-foreground font-mono">{open.date}</div>
        </div>
        <div className="border-t pt-3 text-sm whitespace-pre-line leading-relaxed">{open.body}</div>
        {open.attachments.length > 0 && (
          <div className="space-y-1">
            <div className="label-tracked">Attachments</div>
            {open.attachments.map((a) => (
              <div key={a.name} className="flex items-center gap-2 text-xs border bg-card p-2">
                <Paperclip className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="font-mono">{a.name}</span>
                <span className="ml-auto text-muted-foreground">{a.size}</span>
              </div>
            ))}
          </div>
        )}
        <Button
          className="w-full"
          onClick={() => toast({ title: "Extracted to claim", description: "Fields synced to FNOL & Documents." })}
        >
          <Sparkles className="h-4 w-4" /> Extract to claim
        </Button>
      </div>
    );
  }

  return (
    <div className="divide-y">
      {claim.emails.length === 0 && (
        <div className="p-6 text-center text-muted-foreground text-sm">
          <Mail className="h-6 w-6 mx-auto mb-2" />
          No emails on this claim.
        </div>
      )}
      {claim.emails.map((e) => (
        <button
          key={e.id}
          onClick={() => setOpen(e)}
          className="w-full text-left p-3 hover:bg-surface transition-colors"
        >
          <div className="flex items-center gap-2">
            <span className={`text-sm truncate ${e.unread ? "font-semibold" : ""}`}>{e.fromName}</span>
            {e.unread && <span className="h-1.5 w-1.5 rounded-full bg-primary" />}
            <span className="ml-auto text-[11px] text-muted-foreground font-mono shrink-0">{e.date.slice(5)}</span>
          </div>
          <div className="text-sm truncate">{e.subject}</div>
          {e.attachments.length > 0 && (
            <div className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
              <Paperclip className="h-3 w-3" /> {e.attachments.length}
            </div>
          )}
        </button>
      ))}
    </div>
  );
}
