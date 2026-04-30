import { useApp } from "@/state/AppContext";
import { KPI_DATA, RECENT_ACTIVITY } from "@/data/mockClaims";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, FileStack, FileX, Clock, DollarSign, ArrowUpRight } from "lucide-react";
import { StatusPill } from "@/components/common/StatusPill";
import { SectionLabel } from "@/components/common/SectionLabel";
import { useState } from "react";
import { formatDateShortUS, formatDateTimeUS } from "@/lib/format";

const KPI_CARDS = [
  { label: "Open Claims", value: KPI_DATA.openClaims, icon: FileStack, tone: "info" as const },
  { label: "Pending Documents", value: KPI_DATA.pendingDocuments, icon: FileX, tone: "warning" as const },
  { label: "SLA at Risk", value: KPI_DATA.slaAtRisk, icon: Clock, tone: "danger" as const },
  { label: "Payouts This Week", value: KPI_DATA.payoutsThisWeek, icon: DollarSign, tone: "success" as const },
];

export function HomeView() {
  const { claims, openClaimTab } = useApp();
  const [q, setQ] = useState("");

  const filtered = claims.filter(
    (c) =>
      !q ||
      c.id.toLowerCase().includes(q.toLowerCase()) ||
      `${c.death.firstName} ${c.death.lastName}`.toLowerCase().includes(q.toLowerCase()),
  );

  return (
    <div className="p-6 space-y-6 overflow-auto">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Good afternoon, Sarah</h1>
          <p className="text-sm text-muted-foreground">Here&apos;s what&apos;s happening across your claims today.</p>
        </div>
        <div className="relative w-80 max-w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search claims by ID or deceased name…"
            className="pl-9"
          />
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {KPI_CARDS.map((k) => (
          <Card key={k.label} className="p-4 flex items-start justify-between">
            <div>
              <SectionLabel>{k.label}</SectionLabel>
              <div className="mt-2 text-3xl font-semibold tabular-nums">{k.value}</div>
            </div>
            <div className={`h-9 w-9 flex items-center justify-center pill-${k.tone}`}>
              <k.icon className="h-4 w-4" />
            </div>
          </Card>
        ))}
      </div>

      {/* Two-column: claims table + activity feed */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <Card className="xl:col-span-2 overflow-hidden">
          <div className="p-4 border-b flex items-center justify-between">
            <SectionLabel>My Active Claims</SectionLabel>
            <span className="text-xs text-muted-foreground">{filtered.length} shown</span>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Claim ID</TableHead>
                <TableHead>Deceased</TableHead>
                <TableHead>Date of Death</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Flags</TableHead>
                <TableHead>Assigned</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((c) => (
                <TableRow key={c.id}>
                  <TableCell className="font-mono text-xs">{c.id}</TableCell>
                  <TableCell>
                    <div className="font-medium">{c.death.salutation} {c.death.firstName} {c.death.lastName}</div>
                    <div className="text-xs text-muted-foreground">{c.death.location.split(",").slice(-2).join(",").trim()}</div>
                  </TableCell>
                  <TableCell className="num text-xs">{formatDateShortUS(c.death.dod)}</TableCell>
                  <TableCell><StatusPill tone="info">{c.status}</StatusPill></TableCell>
                  <TableCell className="space-x-1">
                    {c.litigationRisk && <StatusPill tone="danger">Litigation</StatusPill>}
                    {c.expressFastTrack && <StatusPill tone="success">Express</StatusPill>}
                    {!c.litigationRisk && !c.expressFastTrack && <span className="text-xs text-muted-foreground">—</span>}
                  </TableCell>
                  <TableCell className="text-xs">{c.assignedTo}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" onClick={() => openClaimTab(c.id)}>
                      Open <ArrowUpRight className="h-3.5 w-3.5" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>

        <Card className="overflow-hidden">
          <div className="p-4 border-b">
            <SectionLabel>Recent Activity</SectionLabel>
          </div>
          <div className="divide-y">
            {RECENT_ACTIVITY.map((a, i) => (
              <button
                key={i}
                onClick={() => openClaimTab(a.claimId)}
                className="w-full text-left p-3 hover:bg-surface transition-colors flex flex-col gap-1"
              >
                <div className="text-sm">{a.text}</div>
                <div className="text-xs text-muted-foreground flex items-center gap-2">
                  <span>{a.who}</span>
                  <span>·</span>
                  <span className="num">{formatDateTimeUS(a.ts)}</span>
                </div>
              </button>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
