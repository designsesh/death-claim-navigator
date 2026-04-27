## Goals

Tighten the workspace UX based on user feedback: read-only FNOL with edit toggle, clearer document warnings, sections that grow inline (no inner scroll), richer verified data, sectioned Process Wall, and a top-mounted sidebar collapse button.

## Changes

### 1. Shell sidebar (`src/components/shell/Sidebar.tsx`)
- Move the collapse/expand chevron button from the bottom to the **top** of the sidebar (above the nav items), keeping the same toggle behavior and icon swap.

### 2. Left column — FNOL panel (`src/components/workspace/left/FNOLPanel.tsx`)
- Default to a **read-only display view** (label + value rows, mono for IDs/dates), grouped under "Death Information" and "Claimant Information".
- Add an **Edit** button in the panel header. Clicking switches to the existing input/select form. Show **Save** + **Cancel** while editing; on Save, persist edits via `updateClaim` (extend `AppContext` updater usage already in place) and revert to the display view.
- Same pattern will be applied to the Policy left panel (`PolicyPanel.tsx`) for consistency, since the user asked for editable→display behavior across left-panel data.

### 3. Left column — Documents panel (`src/components/workspace/left/DocumentsPanel.tsx`)
- Replace the View/Delete **icon-only** buttons with **text buttons** ("View", "Delete") using `Button variant="outline"`/`"ghost"` sizes.
- In the **left rail tab icon** for Documents (`LeftColumn.tsx`), overlay a small **red alert dot/icon** when the active claim has any document with `status === "missing"`. Also add an inline red `AlertTriangle` next to the panel title row when missing docs exist.

### 4. Center column — Expandable sections (`ExpandableSection.tsx` + all tab files)
- Remove the inner scroll container. Replace `max-h-* overflow-auto` with **natural height growth**; the section simply renders all its content and the page scrolls.
- Keep the expand/collapse toggle but reframe it as **"Show more / Show less"**: when collapsed, render a compact summary (current default content); when expanded, render an extended block with more verified data.
- Update each center tab to provide an **extended view** with significantly more verified detail:
  - **Claims tab**: full intimation timeline, all matched FNOL fields with source pill, DMF/EVVE/OFAC outcome rows.
  - **Policy tab**: rider list, premium history, contestability status, NICB/MIB outcomes, full beneficiary designation breakdown with shares and verified flags.
  - **Beneficiary tab**: per-beneficiary verification matrix (ID verified, address verified, ACH verified, OFAC clear, KYC source) and side-by-side compare of policy designation vs claimed share.
  - **Settlement / Payout tabs**: collapsed summary stays; expanded shows full ledger and per-beneficiary calculation breakdown.

### 5. Center column — Editable summary cards
- Add an **Edit** affordance on the Summary card sections in Claims, Policy, and Beneficiary tabs. Same display→form→save flow as FNOL: pencil icon switches the card into inputs; Save commits via `updateClaim`; Cancel discards. After save, view returns to display mode.
- Implement via a small reusable `EditableField` component (`src/components/common/EditableField.tsx`) and a `useEditableSection` pattern (local `editing` state + buffered draft) so each card manages its own edit lifecycle.

### 6. Process Wall (`src/components/workspace/right/RightColumn.tsx`)
- Replace the flat timeline with **collapsible subsections** in fixed order: **FNOL, Claims, Policy, Beneficiary, Beneficiary Settlement, Payout**.
- Bucket existing `claim.activity` entries by their `tab` field (map `settlement` → "Beneficiary Settlement", `fnol` → "FNOL", etc.).
- Each subsection header shows: title, count badge, and last activity timestamp. Body shows the chronological entries (existing icon + actor + action + detail + ts styling).
- Default state: all sections expanded; remember per-section open state in component-local state.

### 7. Mock data (`src/data/mockClaims.ts`)
- Augment activity arrays so each tab bucket has at least 2-3 entries per claim, ensuring all six Process Wall subsections demonstrate content.
- Add a few extra verified data points (e.g., rider names, premium history dates) referenced by the new extended views — kept compact, no schema explosion.

### 8. Types (`src/types/claim.ts`)
- Minor additions only as needed for extended views: optional `riders?: string[]`, `premiumHistory?: { date: string; amount: string }[]` on `PolicyInfo`; optional `verificationMatrix?: { idVerified: boolean; addressVerified: boolean; achVerified: boolean; ofacClear: boolean; }` on `Beneficiary`. All optional — existing data still valid.

## Out of scope

- Top bar, Home view, AI Agents panel, External Order, Email panel — unchanged.
- No backend; everything stays in-memory through `AppContext.updateClaim`.
