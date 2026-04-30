import type { Claim, DocumentItem } from "@/types/claim";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { useEffect, useState } from "react";
import { useApp } from "@/state/AppContext";
import { toast } from "@/hooks/use-toast";

export function UploadDocDialog({
  claim,
  open,
  onOpenChange,
  presetDocId,
}: {
  claim: Claim;
  open: boolean;
  onOpenChange: (v: boolean) => void;
  /** When provided (e.g. user clicked the doc directly in the left sidebar), this doc is auto-selected. */
  presetDocId?: string;
}) {
  const { updateClaim } = useApp();
  const [docId, setDocId] = useState<string>("");

  useEffect(() => {
    if (open) {
      if (presetDocId) setDocId(presetDocId);
      else {
        const firstMissing = claim.documents.find((d) => d.status === "missing");
        setDocId(firstMissing?.id ?? claim.documents[0]?.id ?? "");
      }
    }
  }, [open, presetDocId, claim.documents]);

  const upload = () => {
    const target = claim.documents.find((d) => d.id === docId);
    if (!target) return;
    updateClaim(claim.id, (c) => ({
      ...c,
      documents: c.documents.map((d) =>
        d.id === docId
          ? {
              ...d,
              status: "uploaded",
              uploadedAt: new Date().toISOString().slice(0, 10),
              fileName: `${d.name.toLowerCase().replace(/\s+/g, "_")}.pdf`,
            }
          : d,
      ),
    }));
    toast({ title: "Document uploaded", description: target.name });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Upload Document</DialogTitle>
          <DialogDescription>Select which document you are uploading, then drop the file.</DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
          <div className="space-y-1">
            <div className="label-tracked">Document Type</div>
            <Select value={docId} onValueChange={setDocId}>
              <SelectTrigger><SelectValue placeholder="Select document" /></SelectTrigger>
              <SelectContent>
                {claim.documents.map((d: DocumentItem) => (
                  <SelectItem key={d.id} value={d.id}>
                    {d.name} {d.status !== "missing" ? `· ${d.status}` : "· missing"}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="border border-dashed p-8 text-center">
            <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
            <div className="text-sm">Drop file here or click to browse</div>
            <div className="text-xs text-muted-foreground mt-1">PDF, JPG, PNG up to 25 MB</div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={upload} disabled={!docId}>Upload</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
