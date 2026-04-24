## Death Claims Dashboard — Build Plan

A frontend-only prototype (mock TypeScript data, no backend) for a US life-insurance death-claims operations console. Includes a reusable design system, persistent UI shell, and 2–3 fully populated sample claims so you can demo end-to-end flows.

---

### 1. Design system & theming

- Tokens defined in `index.css` (light + dark) and wired through `tailwind.config.ts`
  - `--radius: 2px` (sharp corners everywhere)
  - Neutral gray scale (background, surface, surface-2, border, muted, foreground)
  - Single accent: deep blue (primary)
  - Semantic: success (green), warning (amber), danger (red), info (blue)
  - Monospace token for IDs / claim numbers / policy numbers
- Typography scale: Display, H1, H2, Section label (uppercase + tracked), Body, Caption, Mono
- Theme toggle in the top bar; choice persisted to `localStorage` and applied via `class="dark"` on `<html>`
- All components use semantic tokens — no hardcoded hex/`bg-white` etc.

### 2. App shell (persistent across all routes)

- **Top bar**
  - Left: placeholder logo
  - Center: tab strip — Home tab (always first, non-closeable) + dynamically opened claim tabs (session-only, closeable with X, click to switch)
  - Right: profile icon, settings icon, dark-mode toggle
- **Left sidebar** (collapsible, mini-icon mode when collapsed, tooltip on hover shows label)
  - Top group: Home, Active Claims, All Claims, Email
  - Bottom group: Knowledge Base, FAQ Database, Settings
- **Main content area** swaps based on active top-bar tab

### 3. Home tab

- Top row: KPI cards — Open Claims, Pending Documents, SLA at Risk, Payouts This Week
- Below split into two panels:
  - **My Active Claims** table (Claim ID, Deceased, DOD, Status, Stage, Assigned To, Action → opens claim tab)
  - **Recent Activity / Notifications** feed
- Quick search to open any claim by ID/name (adds a tab)

### 4. Claim workspace (opens when a claim tab is active)

Three-column layout with collapsible right column.

#### 4a. Left column — Data products (5 icon tabs, tooltip on hover)

1. **FNOL** (intimation) — Death Information form (Salutation, First/Middle/Last, DOB, Date & Time of Death, Location, Cause, Policy #) + Claimant Information (Name, Phone, Email, Relationship dropdown: Spouse / Child / Parent / Sibling / Trustee / Other)
2. **Policy** — Key fields (policy #, insured name, beneficiary, premium, issue date, active status) + "Open full policy" button (non-functional)
3. **Documents** — Fixed checklist with status pills (Missing / Uploaded / Verified):
   - Claim Form, Beneficiary Additional Form (multi, with "+ Add" row)
   - Death Certificate, Last Will & Testament, Life Insurance Policy Document, Funeral Director's Certificate, Police Report (single each)
   - Per row: Upload → drag-drop modal; once uploaded → View + Delete (delete confirm dialog with warning copy)
4. **External Order** — List of US sources (DMF, EVVE, OFAC, NICB, MIB, LexisNexis), each with status + "Order" button
5. **Email** — Inbox list (sender, subject, date) → detail view with Back to Inbox, body, attachments, "Extract to claim" button

#### 4b. Center column — Claim workspace

- **Claim info bar** above the tabs:
  - Left: Claim ID (mono) · Deceased Name · Date of Death · Cause of Death
  - Right: two status chips — "Litigation Risk" and "Express Claim Fast-Track" (greyed when inactive, accent-filled when active) + Estimated Time of Completion
- **5 tabs**: Claims, Policy, Beneficiary, Beneficiary Settlement, Payout
- **Shared layout per tab** (3 vertical sections):
  1. **Summary** — cards / mini-table / text / small chart of key extracted info; expand button → scrollable full view
  2. **Checklist** — mismatched & verified items as cards; each mismatch card has an "Assign / Communicate" action; expand → full audit list (all checks AI performed)
  3. **Activity log + Notes** — chronological log scoped to that tab, plus a notes input so other handlers see context
- **Per-tab content**:
  - **Claims**: intimation, deceased + claimant, policy snapshot & active status, verified info; if all checks match, banner shows "Intimation step + claim creation completed in FNOL"; activity log = FNOL agent's work
  - **Policy**: key policy info + beneficiaries listed on policy; checklist shows mismatches + fraud-risk flags; activity log + AI-suggested tasks + previous assignments
  - **Beneficiary**: full beneficiary records (contact, account #, payout preference); checklist shows verification gaps; activity log
  - **Beneficiary Settlement**: claim calculation, amount split per beneficiary, final list, "Generate settlement document" + "Email beneficiaries" → confirm modal → success state ("Email sent" badge per row)
  - **Payout**: accounting entries per beneficiary (debit / credit / net payout), "Upload signed settlement document" zone, "Initiate Payout" button

#### 4c. Right column — Collapsible side panel

- Collapse/expand toggle
- **AI Agent Hub** tab — list of running agents (name, status, last action) with expandable history dropdown per agent
- **Process Wall** tab — unified, ordered timeline merging activity logs from all 5 center tabs into one chronological process view

### 5. Sample data (2–3 mock US claims)

Realistic US names, addresses (e.g., NY, TX, IL), SSN-style IDs (masked), policy numbers, US carriers. Each claim seeded with different states so the UI shows variety:

- **Claim A** — Healthy claim, all docs verified, no mismatches, fast-track express eligible
- **Claim B** — Mid-flow with document mismatches, litigation-risk flag on, AI agents actively working
- **Claim C** — At settlement / payout stage, beneficiary email already sent, ready to initiate payout

Mock emails, mock external-order responses, mock AI agent histories, and mock activity logs all included.

### 6. Behavior & interactions

- Sidebar collapse state, theme, and any in-claim section expansions persist to `localStorage`
- Open claim tabs are session-only (reset on refresh)
- Toasts for actions (upload success, email sent, payout initiated, etc.)
- All destructive actions (delete document, initiate payout, send email) use confirm dialogs

### Out of scope (this build)

- Real authentication, real document parsing, real email sending, real payout integrations
- Knowledge Base / FAQ Database / Settings pages (sidebar links route to placeholder pages)
- Persistence beyond localStorage (no Supabase)
