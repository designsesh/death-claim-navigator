export type DocStatus = "missing" | "uploaded" | "verified";
export type ChecklistStatus = "verified" | "mismatch" | "pending";
export type ExternalSource = "DMF" | "EVVE" | "OFAC" | "NICB" | "MIB" | "LexisNexis";
export type Relationship = "Spouse" | "Child" | "Parent" | "Sibling" | "Trustee" | "Other";

export interface Claimant {
  name: string;
  phone: string;
  email: string;
  relationship: Relationship;
}

export interface DeathInfo {
  salutation: string;
  firstName: string;
  middleName: string;
  lastName: string;
  dob: string;
  dod: string;
  dodTime: string;
  location: string;
  cause: string;
  policyNumber: string;
}

export interface PolicyInfo {
  policyNumber: string;
  insuredName: string;
  beneficiary: string;
  premium: string;
  faceAmount: string;
  issueDate: string;
  status: "Active" | "Lapsed" | "Paid-Up";
  carrier: string;
  riders?: string[];
  premiumHistory?: { date: string; amount: string; status: "Paid" | "Pending" }[];
  contestabilityPassed?: boolean;
  productType?: string;
  underwriter?: string;
}

export interface Beneficiary {
  id: string;
  name: string;
  relationship: Relationship;
  share: number; // percent
  address: string;
  phone: string;
  email: string;
  ssnLast4: string;
  accountNumber: string;
  routingNumber: string;
  payoutPreference: "ACH" | "Check" | "Wire";
  verified: boolean;
  verificationMatrix?: {
    idVerified: boolean;
    addressVerified: boolean;
    achVerified: boolean;
    ofacClear: boolean;
    kycSource?: string;
  };
}

export interface DocumentItem {
  id: string;
  name: string;
  status: DocStatus;
  uploadedAt?: string;
  fileName?: string;
  multi?: boolean;
}

export interface ExternalOrder {
  source: ExternalSource;
  description: string;
  status: "Not Ordered" | "Ordered" | "Received" | "Clear" | "Hit";
  orderedAt?: string;
  receivedAt?: string;
}

export interface EmailMessage {
  id: string;
  from: string;
  fromName: string;
  subject: string;
  date: string;
  body: string;
  attachments: { name: string; size: string }[];
  unread?: boolean;
}

export interface ChecklistItem {
  id: string;
  label: string;
  status: ChecklistStatus;
  detail?: string;
  expected?: string;
  found?: string;
  source?: string;
}

export interface ActivityEntry {
  id: string;
  ts: string;
  actor: string;
  actorType: "human" | "ai" | "system";
  action: string;
  detail?: string;
  tab: "claims" | "policy" | "beneficiary" | "settlement" | "payout" | "fnol";
}

export interface NoteEntry {
  id: string;
  ts: string;
  author: string;
  text: string;
  tab: "claims" | "policy" | "beneficiary" | "settlement" | "payout";
}

export interface AIAgent {
  id: string;
  name: string;
  status: "idle" | "running" | "complete" | "error";
  lastAction: string;
  lastRun: string;
  history: { ts: string; action: string; result: string }[];
}

export type ClaimStatus =
  | "Open"
  | "Assigned"
  | "Claim Review"
  | "Policy Review"
  | "Awaiting Info"
  | "Beneficiary Settlement"
  | "Awaiting Sign-off"
  | "Payout Processing"
  | "Claim Closed"
  | "Rejected"
  | "Withdrawn";

export type TabKey = "claims" | "policy" | "beneficiary" | "settlement" | "payout";
export type TabState = "pending" | "done";

export interface TaskEntry {
  id: string;
  title: string;
  description?: string;
  assignee: string;
  selfAssigned: boolean;
  status: "pending" | "done";
  createdAt: string;
  section: TabKey;
  createdBy: string;
}

export interface Claim {
  id: string;
  status: ClaimStatus;
  stage: string;
  litigationRisk: boolean;
  expressFastTrack: boolean;
  estimatedCompletion: string;
  assignedTo: string;
  createdAt: string;
  death: DeathInfo;
  claimant: Claimant;
  policy: PolicyInfo;
  policyBeneficiariesListed: { name: string; relationship: Relationship; share: number }[];
  beneficiaries: Beneficiary[];
  documents: DocumentItem[];
  externalOrders: ExternalOrder[];
  emails: EmailMessage[];
  checklists: {
    claims: ChecklistItem[];
    policy: ChecklistItem[];
    beneficiary: ChecklistItem[];
    settlement: ChecklistItem[];
    payout: ChecklistItem[];
  };
  activity: ActivityEntry[];
  notes: NoteEntry[];
  aiAgents: AIAgent[];
  tabStates: Record<TabKey, TabState>;
  tasks: TaskEntry[];
  settlement: {
    faceAmount: number;
    accruedInterest: number;
    outstandingLoans: number;
    netPayable: number;
    splits: { beneficiaryId: string; amount: number; emailSent?: boolean }[];
    documentGenerated: boolean;
  };
  payout: {
    entries: { beneficiaryId: string; debit: number; credit: number; net: number; status: "Pending" | "Initiated" | "Paid" }[];
    signedDocumentUploaded: boolean;
    initiated: boolean;
  };
}
