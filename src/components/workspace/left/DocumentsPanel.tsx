import type { Claim, DocumentItem } from "@/types/claim";
import { Button } from "@/components/ui/button";
import { StatusPill } from "@/components/common/StatusPill";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Upload, Eye, Trash2, Plus, FileText } from "lucide-react";
import { useState } from "react";
import { useApp } from "@/state/AppContext";
import { toast } from "@/hooks/use-toast";

export function DocumentsPanel({ claim }: { claim: Claim }) {
  const { updateClaim } = useApp();
  const [uploadFor, setUploadFor] = useState<DocumentItem | null>(null);
  const [deleteFor, setDeleteFor] = useState<DocumentItem | null>(null);

  const handleUpload = () => {
    if (!uploadFor) return;
    updateClaim(claim.id, (c) => ({
      ...c,
      documents: c.documents.map((d) =>
        d.id === uploadFor.id ? { ...d, status: "uploaded", uploadedAt: new Date().toISOString().slice(0, 10), fileName: `${d.name.toLowerCase().replace(/\s+/g, "_")}.pdf` } : d,
      ),
    }));
    setUploadFor(null);
    toast({ title: "Document uploaded", description: uploadFor.name });
  };

  const handleDelete = () => {
    if (!deleteFor) return;
    updateClaim(claim.id, (c) => ({
      ...c,
      documents: deleteFor.multi
        ? c.documents.filter((d) => d.id !== deleteFor.id)
        : c.documents.map((d) => (d.id === deleteFor.id ? { ...d, status: "missing", uploadedAt: undefined, fileName: undefined } : d)),
    }));
    setDeleteFor(null);
    toast({ title: "Document deleted", description: deleteFor.name, variant: "destructive" });
  };

  const addBeneficiaryAdditional = () => {
    updateClaim(claim.id, (c) => ({
      ...c,
      documents: [
        ...c.documents,
        { id: `D-${Date.now()}`, name: "Beneficiary Additional Form", status: "missing", multi: true },
      ],
    }));
  };

  const grouped: { name: string; items: DocumentItem[]; multi: boolean }[] = [];
  const seen = new Set<string>();
  claim.documents.forEach((d) => {
    if (seen.has(d.name) && d.multi) {
      grouped.find((g) => g.name === d.name)!.items.push(d);
    } else {
      seen.add(d.name);
      grouped.push({ name: d.name, items: [d], multi: !!d.multi });
    }
  });

  const tone = (s: DocumentItem["status"]) => (s === "verified" ? "success" : s === "uploaded" ? "info" : "muted");

  return (
    <div className="p-4 space-y-3">
      {grouped.map((g) => (
        <div key={g.name}>
          {g.items.map((d) => (
            <div key={d.id} className="flex items-center gap-3 py-2 border-b text-sm">
              <FileText className="h-4 w-4 text-muted-foreground shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="font-medium truncate">{d.name}</div>
                {d.fileName && <div className="text-xs text-muted-foreground font-mono truncate">{d.fileName}</div>}
              </div>
              <StatusPill tone={tone(d.status)}>{d.status}</StatusPill>
              {d.status === "missing" ? (
                <Button size="sm" variant="outline" onClick={() => setUploadFor(d)}>
                  <Upload className="h-3.5 w-3.5" /> Upload
                </Button>
              ) : (
                <div className="flex gap-1">
                  <Button size="icon" variant="ghost" className="h-8 w-8"><Eye className="h-3.5 w-3.5" /></Button>
                  <Button size="icon" variant="ghost" className="h-8 w-8 text-danger" onClick={() => setDeleteFor(d)}>
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              )}
            </div>
          ))}
          {g.multi && (
            <button onClick={addBeneficiaryAdditional} className="mt-1 flex items-center gap-1 text-xs text-primary hover:underline">
              <Plus className="h-3 w-3" /> Add another {g.name}
            </button>
          )}
        </div>
      ))}

      {/* Upload modal */}
      <Dialog open={!!uploadFor} onOpenChange={(o) => !o && setUploadFor(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upload {uploadFor?.name}</DialogTitle>
            <DialogDescription>Drag and drop your file, or click to browse.</DialogDescription>
          </DialogHeader>
          <div className="border-2 border-dashed border-border p-8 text-center">
            <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
            <div className="text-sm">Drop file here</div>
            <div className="text-xs text-muted-foreground mt-1">PDF, JPG, PNG up to 25 MB</div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setUploadFor(null)}>Cancel</Button>
            <Button onClick={handleUpload}>Simulate Upload</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete confirm */}
      <AlertDialog open={!!deleteFor} onOpenChange={(o) => !o && setDeleteFor(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete {deleteFor?.name}?</AlertDialogTitle>
            <AlertDialogDescription>
              This document is part of the claim audit trail. Deleting it may affect downstream verification and require re-upload before settlement. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-danger text-danger-foreground hover:bg-danger/90">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
