## Overview

Major workspace overhaul: claim status is no longer a freeform dropdown — it is now derived from per-tab pending/done state. Workspace tabs get colored bar styling, an inline pending/done toggle, an AI Observations section, and the left panel gains Tasks + Notes panels.

## 1. Top header (`ClaimHeaderBar.tsx`)

- Remove the Status `<Select>` dropdown and the "Save" button (and `Save` icon import).
- Keep: Claim ID, Deceased Name, Policy ID, Face Amount, Date of Death, litigation/express flags, Upload doc icon, Create task icon.
- Remove `STATUSES` constant and `setStatus` handler.
- Derive a small read-only status label from tab states, e.g. text like `Status — Policy Verification` showing the current pending tab (or "Closed — All stages done"). Plain text, no chip.

## 2. Tab-as-state model

Add to `Claim` (in `src/types/claim.ts`):
```ts
tabStates: {
  claims: "pending" | "done";
  policy: "pending" | "done";
  beneficiary: "pending" | "done";
  settlement: "pending" | "done";
  payout: "pending" | "done";
};
```

Seed sensible defaults in `mockClaims.ts` for the 3 claims (e.g. claimA: claims/policy done, beneficiary done, settlement pending, payout pending; claimB: claims pending; claimC: settlement done, payout pending).

Keep the legacy `status` field for now (used by HomeView list) but stop treating it as the source of truth — derive a `derivedStatus` helper in `src/lib/format.ts` from `tabStates` for any display that needs one label.

## 3. Center workspace tabs (`CenterColumn.tsx`)

Rename tab labels:
- Claims → **Claim Verification**
- Policy → **Policy Verification**
- Beneficiaries → **Beneficiary Identification**
- Beneficiary Settlement → **Beneficiary Settlement** (unchanged label)
- Payout → **Payout** (unchanged label)

Replace the boxed `TabsList` with a custom tab bar: flat row, bottom border line, each tab is text only with a 2px bottom indicator on active. Color the tab label text by state:
- `pending` → warning/orange (`text-warning`)
- `done` → success/green (`text-success`)

Active tab gets a stronger underline in the same color.

Right after the tab bar in each tab's content, render a shared `TabStateHeader` component:

```text
[ Pending ]  ●━━○   [Submit for Review*]
   ↑ text card     ↑ toggle (orange when pending, green when done)
```

- Left text card: "Pending" or "Done" (plain text, no fill).
- Toggle: minimal switch (use existing `Switch` ui, customize via data-state classes — orange thumb/track when off=pending, green when on=done).
- Toggling updates `claim.tabStates[tab]` via `updateClaim`.
- *Submit for Review button only appears on the Beneficiary Settlement tab, next to the toggle. On click → toast "Submitted for review" and switches the toggle to done.

## 4. Observations section (new)

New component `src/components/workspace/center/ObservationsSection.tsx`. Rendered inside `ClaimsTab`, `PolicyTab`, `BeneficiaryTab`, `SettlementTab`, `PayoutTab` immediately below `<ChecklistSection>`.

- Full-width card per mismatch (one row each).
- For each mismatch in the tab's checklist, derive an AI observation string from `item.label`, `expected`, `found`, `detail`, `source` (template like "EVVE returned DOB 1968-11-20 vs claimant-supplied 1968-11-02. 18-day skew. Common source: data-entry transposition. Recommend confirming DOB with claimant via document re-upload.").
- Each card shows:
  - Mismatch name + expected/found block (mono).
  - "AI Observation" body paragraph.
  - Action buttons: **Assign Task** (opens existing `NewTaskDialog` pre-filled), **Communicate** (toast stub), **Mark Resolved** (toast stub).
- If no mismatches: small muted line "No observations — all checks verified."

`NewTaskDialog` gains an optional `prefill` prop: `{ title, description, section }`.

## 5. NewTaskDialog (`NewTaskDialog.tsx`)

Add a new field "Assign to" with two-mode selector:
- Radio/segmented: **Self-assigned** | **Assign to someone**.
- When "Self-assigned": assignee auto-set to current user ("Sarah Mitchell").
- When "Assign to someone": show the existing assignee dropdown.

Accept `prefill` prop and seed `title/desc/section` when opening from Observations.

## 6. Left panel (`LeftColumn.tsx`)

New `TABS` order:
1. Process Wall (existing)
2. Documents (existing)
3. External Order (existing)
4. Email (existing)
5. **Tasks** (new)
6. **Notes** (new)

Remove FNOL and Policy entries (delete imports of `FNOLPanel`, `PolicyPanel` from this file — files themselves can stay unused). Update `missingDocs` alert logic to remain on Documents.

### TasksPanel (new `src/components/workspace/left/TasksPanel.tsx`)

- Reads tasks from `claim.activity` entries whose `action` starts with "Task created — " (existing pattern from `NewTaskDialog`), plus any new dedicated `claim.tasks` array if we extend types. Simpler approach: add `tasks: TaskEntry[]` to `Claim` type with `{id, title, description, assignee, status: "pending"|"done", createdAt, section}`. Update `NewTaskDialog` to push into `claim.tasks` (as well as activity log).
- Renders list grouped by status; each row shows title, assignee, section, timestamp, and a checkbox to mark done.
- Red dot indicator on the icon rail when any pending tasks exist.

### NotesPanel (new `src/components/workspace/left/NotesPanel.tsx`)

- Reads from `claim.notes` (already exists).
- Lists every note: workspace/section name (e.g. "Beneficiary Identification"), note text, author, timestamp.
- Section name mapped from `note.tab` via a label map.

### Mock notes seeding

Add 4–6 realistic notes per claim across different tabs to `mockClaims.ts`, e.g.:
- claims: "Express track candidate — clean docs."
- policy: "Confirmed contestability passed; no underwriter concerns."
- beneficiary: "Daniel called — confirmed mailing address change."
- settlement: "Splits reviewed against will — match."
- payout: "Holding for signed settlement; ETA Friday."

Also seed initial `tasks` array per claim with 1–3 entries showing pending/done mix.

## 7. File-level technical summary

- **Edit** `src/types/claim.ts` — add `tabStates`, `tasks: TaskEntry[]`, and `TaskEntry` interface.
- **Edit** `src/data/mockClaims.ts` — seed `tabStates`, `tasks`, expand `notes` for all 3 claims.
- **Edit** `src/lib/format.ts` — add `deriveStatusFromTabs()` and `tabLabel()` helpers.
- **Edit** `src/components/workspace/ClaimHeaderBar.tsx` — remove status select & Save button, show derived status text.
- **Edit** `src/components/workspace/center/CenterColumn.tsx` — rename tabs, replace `TabsList` with custom underline tab bar, color by state.
- **New** `src/components/workspace/center/TabStateHeader.tsx` — pending/done text card + toggle + optional Submit for Review.
- **Edit** `src/components/workspace/center/tabs/ClaimsTab.tsx`, `PolicyTab.tsx`, `BeneficiaryTab.tsx`, `SettlementTab.tsx`, `PayoutTab.tsx` — render `<TabStateHeader>` at top, render `<ObservationsSection>` below `<ChecklistSection>`.
- **New** `src/components/workspace/center/ObservationsSection.tsx`.
- **Edit** `src/components/workspace/NewTaskDialog.tsx` — add self/other assignee selector, accept `prefill`, persist to `claim.tasks`.
- **Edit** `src/components/workspace/left/LeftColumn.tsx` — new TABS array, mount Tasks & Notes panels, drop FNOL/Policy.
- **New** `src/components/workspace/left/TasksPanel.tsx`.
- **New** `src/components/workspace/left/NotesPanel.tsx`.

## Out of scope (kept intact)

- Right column (Agents/Notifications) is unchanged.
- Process Wall content unchanged (still references `tab` keys including `fnol` for historical activity).
- HomeView claim list keeps using `status` as a top-level summary string — derived from `tabStates` on render.
