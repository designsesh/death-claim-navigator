import { Input } from "@/components/ui/input";

export function DisplayField({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="space-y-0.5">
      <div className="label-tracked">{label}</div>
      <div className={`text-sm ${mono ? "font-mono" : "font-medium"}`}>{value || <span className="text-muted-foreground italic font-normal">—</span>}</div>
    </div>
  );
}

export function EditField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="space-y-1">
      <div className="label-tracked">{label}</div>
      <Input value={value} onChange={(e) => onChange(e.target.value)} className="h-8 text-sm" />
    </div>
  );
}
