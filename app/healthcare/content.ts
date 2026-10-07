/* ==========================================================================
   HEALTHCARE PAGE CONTENT
   --------------------------------------------------------------------------
   Two kinds of claims live on this page, and they are kept structurally
   separate throughout:

   1. INDUSTRY_METRICS — third-party published statistics (AHA / AMA / CMS).
      These describe the healthcare industry, NOT Quishub's own results.
      Never attribute them to Quishub work. Re-verify before long-term use;
      survey figures get superseded year to year. Sources:
        - https://www.aha.org/
        - https://www.ama-assn.org/practice-management/prior-authorization/fixing-prior-auth-nearly-40-prior-authorizations-week-way
        - https://www.cms.gov/newsroom/fact-sheets/cms-interoperability-prior-authorization-final-rule-cms-0057-f
        - https://www.cms.gov/priorities/electronic-prior-authorization/overview

   2. VERIFIED_PROOF — Quishub's own case study (NurMed / Avenue Broadwalk
      General Practice), sourced from app/work/nurmed/page.tsx, which is
      already published and labeled "Healthcare · US / UAE". These are the
      ONLY client-attributed metrics on this page. Do not add others without
      confirming they are provable from existing, published Quishub content.

   ROI_EXAMPLE is explicitly and repeatedly labeled illustrative — it is a
   worked example, not a client result.
   ========================================================================== */

export interface IndustryMetric {
  value: string;
  label: string;
  source: string;
}

export const INDUSTRY_METRICS: IndustryMetric[] = [
  {
    value: "56%",
    label: "Labor represented approximately 56% of U.S. hospital expenses in 2024.",
    source: "American Hospital Association",
  },
  {
    value: "$890B",
    label: "Approximate U.S. hospital labor spend referenced by AHA for 2024.",
    source: "American Hospital Association",
  },
  {
    value: "39",
    label: "Average prior authorization requests handled per physician, per week.",
    source: "American Medical Association, late-2024 survey",
  },
  {
    value: "13 hrs",
    label: "Average weekly physician and staff time spent on prior authorization.",
    source: "American Medical Association, late-2024 survey",
  },
  {
    value: "89%",
    label: "Of physicians say prior authorization somewhat or significantly increases burnout.",
    source: "American Medical Association, late-2024 survey",
  },
  {
    value: "2027",
    label: "CMS Prior Authorization API requirements begin for impacted payers (exact dates vary by payer type).",
    source: "Centers for Medicare & Medicaid Services",
  },
];

export const INDUSTRY_SOURCE_NOTE =
  "Source: American Hospital Association, American Medical Association, Centers for Medicare & Medicaid Services — figures reflect published industry research, not Quishub client results.";

/* --------------------------------------------------------------------------
   Workflow problem
   -------------------------------------------------------------------------- */
export const EXISTING_SYSTEMS = [
  "EHR", "Payer portals", "Billing platform", "Scheduling system",
  "Phone system", "Fax", "Email", "Spreadsheets", "Patient portal",
];

/* --------------------------------------------------------------------------
   Six capability overview cards
   -------------------------------------------------------------------------- */
export interface Capability {
  n: string;
  title: string;
  body: string;
  points: string[];
  anchor: string;
}

export const CAPABILITIES: Capability[] = [
  {
    n: "01",
    title: "Revenue Cycle",
    body: "Eligibility, claims, denials, appeals, AR, payment posting, reconciliation, dashboards.",
    points: ["Eligibility & claims", "Denial management", "AR & reconciliation"],
    anchor: "#revenue-cycle",
  },
  {
    n: "02",
    title: "Prior Authorization",
    body: "Requirement detection, evidence gathering, submission, status, follow-up, appeals.",
    points: ["Requirement detection", "Evidence gathering", "Status & follow-up"],
    anchor: "#prior-authorization",
  },
  {
    n: "03",
    title: "Patient Access",
    body: "Intake, scheduling, eligibility, referrals, reminders, document collection.",
    points: ["Scheduling & intake", "Referral tracking", "Reminders"],
    anchor: "#patient-access",
  },
  {
    n: "04",
    title: "Clinical Operations",
    body: "Pre-visit summaries, document workflows, record search, care coordination, follow-up.",
    points: ["Pre-visit summaries", "Document intelligence", "Care coordination"],
    anchor: "#clinical-intelligence",
  },
  {
    n: "05",
    title: "Healthcare AI",
    body: "Voice agents, evidence-linked AI, document intelligence, controlled automation.",
    points: ["Phone agents", "Evidence-linked AI", "Human-in-the-loop"],
    anchor: "#phone-agents",
  },
  {
    n: "06",
    title: "Software & Integrations",
    body: "SaaS, portals, dashboards, FHIR/HL7 APIs, telehealth, RPM, custom platforms.",
    points: ["Healthcare SaaS", "FHIR / HL7", "Telehealth & RPM"],
    anchor: "#healthcare-saas",
  },
];

/* --------------------------------------------------------------------------
   Prior authorization deep dive
   -------------------------------------------------------------------------- */
export const PA_PIPELINE = [
  { label: "Draft" },
  { label: "Submitted" },
  { label: "Pending" },
  { label: "More Info Required" },
  { label: "Approved / Denied" },
  { label: "Appeal" },
];

export const PA_CAPABILITIES = [
  {
    title: "Requirement detection",
    body: "Identify whether a procedure needs authorization based on payer, plan, procedure code, diagnosis, medication, provider, and location.",
  },
  {
    title: "Clinical evidence collection",
    body: "Pull supporting detail from EHR records, notes, labs, imaging, diagnosis history, and uploaded documents into one packet.",
  },
  {
    title: "Documentation validation",
    body: "Flag missing or inconsistent information before submission instead of discovering it after a denial.",
  },
  {
    title: "Payer-specific routing",
    body: "Route each request through the channel the payer actually accepts — APIs, FHIR-based workflows, portals, forms, fax, or document packages.",
  },
  {
    title: "Status tracking",
    body: "Follow each request through draft, submitted, pending, more-info-needed, approved or denied, and appeal — without a manual portal check.",
  },
  {
    title: "Automated follow-up",
    body: "Trigger status checks and reminders on a schedule instead of staff repeatedly logging into payer portals.",
  },
  {
    title: "AI-assisted denial review",
    body: "Help interpret denial reasons, surface relevant evidence, and draft appeal language for staff to review and finalize.",
  },
  {
    title: "Human approval controls",
    body: "Sensitive or high-risk decisions route to a qualified reviewer before anything is submitted on a patient's behalf.",
  },
];

/* --------------------------------------------------------------------------
   Revenue cycle
   -------------------------------------------------------------------------- */
export const RCM_FLOW = [
  { label: "Registration" },
  { label: "Eligibility" },
  { label: "Coding" },
  { label: "Claim" },
  { label: "Submission" },
  { label: "Payer" },
  { label: "Denial", sub: "if applicable" },
  { label: "Appeal", sub: "if applicable" },
  { label: "Payment" },
  { label: "AR" },
];

export const RCM_CAPABILITIES = [
  "Eligibility & benefits verification",
  "Charge capture",
  "Claim validation & submission",
  "Claim-status monitoring",
  "Denial categorization & workflow",
  "Appeal preparation",
  "AR follow-up",
  "Payment posting & remittance processing",
  "Payer communication & reconciliation",
  "RCM analytics & dashboards",
];

export const DENIAL_PATTERNS = [
  "Authorization failures",
  "Eligibility problems",
  "Missing documentation",
  "Coding issues",
  "Timely filing",
  "Payer-specific requirements",
  "Medical-necessity documentation",
  "Duplicate claims",
  "Coordination-of-benefits issues",
];

/* --------------------------------------------------------------------------
   Patient access
   -------------------------------------------------------------------------- */
export const PATIENT_ACCESS_CAPABILITIES = [
  {
    title: "Digital registration & intake",
    body: "Structured intake forms that populate the record directly instead of getting re-typed at the front desk.",
  },
  {
    title: "Insurance verification & eligibility",
    body: "Coverage checked before the visit, not discovered at checkout.",
  },
  {
    title: "Appointment scheduling",
    body: "Web, mobile, voice, and SMS booking against real availability, with rules for who can book what.",
  },
  {
    title: "Referral intake & tracking",
    body: "Incoming referrals captured, verified, and tracked to a scheduled appointment instead of sitting in a fax queue.",
  },
  {
    title: "Automated reminders & rescheduling",
    body: "Confirmations, reminders, and rescheduling handled automatically, with instructions attached to the visit type.",
  },
  {
    title: "Secure document collection",
    body: "Patients upload forms, IDs, and insurance cards through a secure link instead of printing and faxing.",
  },
  {
    title: "Multilingual communication",
    body: "Reminders and intake communication in the patient's preferred language where it's operationally needed.",
  },
];

/* --------------------------------------------------------------------------
   AI healthcare phone agents
   -------------------------------------------------------------------------- */
export const PHONE_AGENT_USE_CASES = [
  "Appointment scheduling, confirmation, cancellation, rescheduling",
  "Office & service FAQs",
  "Referral-status routing",
  "Basic intake & information capture",
  "Billing-question routing",
  "Prescription-status routing",
  "Post-visit follow-up",
  "Outbound reminders & recall campaigns",
];

export const AFTER_HOURS_FLOW = [
  { label: "Patient calls" },
  { label: "AI identifies intent" },
  { label: "Patient identified" },
  { label: "Scheduling system checked" },
  { label: "Action completed" },
  { label: "Confirmation sent" },
  { label: "Structured record created" },
  { label: "Human escalation", sub: "if needed" },
];

/* --------------------------------------------------------------------------
   Clinical & document intelligence
   -------------------------------------------------------------------------- */
export const CLINICAL_AI_CAPABILITIES = [
  "Pre-visit patient summaries",
  "Longitudinal record summarization",
  "Clinical documentation support",
  "CDI / coding-assistance workflows for qualified review",
  "Secure RAG across records, payer policies, SOPs, and protocols",
  "Evidence-linked AI outputs that point back to source records",
];

export const EVIDENCE_EXAMPLE = {
  finding: "Previous conservative therapy documented.",
  sourceChain: ["Clinical Note", "Treatment History", "Aug 14"],
};

export const DOCUMENT_PIPELINE = [
  { label: "Document Received" },
  { label: "OCR" },
  { label: "Classification" },
  { label: "Field Extraction" },
  { label: "Validation" },
  { label: "Patient Matching" },
  { label: "Missing Info Detection" },
  { label: "Routing" },
  { label: "Summary" },
  { label: "Audit Trail" },
];

/* --------------------------------------------------------------------------
   Operational healthcare systems
   -------------------------------------------------------------------------- */
export const OPERATIONAL_SYSTEMS = [
  {
    title: "Credentialing & provider onboarding",
    body: "Track applications, primary-source verification steps, and onboarding status in one place.",
  },
  {
    title: "License & certification monitoring",
    body: "Expiry dates monitored automatically, with escalation before a lapse becomes a compliance problem.",
  },
  {
    title: "Compliance checklists & audit prep",
    body: "Standing checklists and evidence collection kept current instead of assembled under deadline pressure.",
  },
  {
    title: "Policy acknowledgment & training records",
    body: "Who has acknowledged what, and when, tracked without a spreadsheet.",
  },
  {
    title: "Discharge & post-care follow-up",
    body: "Structured follow-up sequences after discharge, with care-gap outreach and escalation when a patient doesn't respond.",
  },
  {
    title: "Patient & provider portals",
    body: "Secure, purpose-built portals for the information each audience actually needs.",
  },
  {
    title: "Administrative dashboards",
    body: "Operational visibility built around your workflows, not a vendor's generic report set.",
  },
];

/* --------------------------------------------------------------------------
   Healthcare SaaS & product development
   -------------------------------------------------------------------------- */
export const SAAS_PRODUCT_TYPES = [
  "Multi-tenant healthcare SaaS",
  "Telehealth platforms",
  "Remote patient monitoring",
  "Patient engagement products",
  "Care-management systems",
  "RCM platforms",
  "Healthcare marketplaces & provider networks",
  "Medical-document platforms",
  "AI healthcare applications",
];

export const SAAS_FOUNDATIONS = [
  "Subscription & billing", "Tenant isolation", "Role-based access control",
  "Audit logs", "Configurable workflows", "White-labeling",
];

/* --------------------------------------------------------------------------
   Interoperability & integrations
   -------------------------------------------------------------------------- */
export const INTEROP_STANDARDS = [
  "FHIR & FHIR R4", "SMART on FHIR", "HL7 / HL7 v2", "USCDI",
  "X12", "REST APIs & webhooks", "Secure file transfer",
];

/** Phrased as integration capability, subject to vendor API/access — never as
 *  a partnership, certification, or endorsement by the named vendor. */
export const EHR_INTEGRATIONS = [
  "Epic", "Oracle Health / Cerner", "athenahealth", "eClinicalWorks",
  "NextGen", "DrChrono", "Practice Fusion", "Custom EHRs",
];

export const OTHER_INTEGRATIONS = [
  "Payer systems", "Billing platforms", "Communications & CRM", "Internal databases",
];

/* --------------------------------------------------------------------------
   AI architecture: rules + AI + humans
   -------------------------------------------------------------------------- */
export const ARCHITECTURE_CHAIN = [
  { layer: "Deterministic", label: "Eligibility check", sub: "API logic" },
  { layer: "AI", label: "Document classification", sub: "AI" },
  { layer: "Deterministic", label: "Required-document checklist", sub: "rules" },
  { layer: "AI", label: "Clinical evidence summary", sub: "AI" },
  { layer: "Deterministic", label: "Submission", sub: "controlled workflow" },
  { layer: "Human", label: "Clinical / sensitive decision", sub: "qualified human approval" },
];

export const GUARDRAILS = [
  "Structured outputs", "Source evidence", "Confidence thresholds",
  "Deterministic validation", "Role permissions", "Action restrictions",
  "Human approval", "Escalation paths", "Audit logs",
];

/* --------------------------------------------------------------------------
   Security & HIPAA-ready architecture
   -------------------------------------------------------------------------- */
export const SECURITY_CONTROLS = [
  { title: "Encryption", body: "In transit and at rest, across application and storage layers." },
  { title: "Role-based access control", body: "Least-privilege access mapped to job function, not blanket admin rights." },
  { title: "Audit logging", body: "Who accessed or changed what, and when, retained for review." },
  { title: "MFA & session controls", body: "Multi-factor authentication and session limits where appropriate to the workflow." },
  { title: "Secure cloud infrastructure", body: "Backup, recovery, and data-retention controls built into the deployment." },
  { title: "BAA-aware architecture", body: "Vendor and integration choices made with Business Associate Agreement requirements in view." },
];

export const SECURITY_NOTE =
  "We design for HIPAA-regulated workflows and implement specific safeguards above — we don't claim blanket \"HIPAA compliance\" as a marketing label. Relevant frameworks (HITECH, CMS requirements, 42 CFR Part 2, applicable state privacy law) are considered alongside your own policies and BAAs.";

/* --------------------------------------------------------------------------
   Comparison
   -------------------------------------------------------------------------- */
export interface ComparisonRow {
  dimension: string;
  quishub: string;
  generic: string;
  manual: string;
}

export const COMPARISON_ROWS: ComparisonRow[] = [
  { dimension: "Workflow design", quishub: "Built around client process", generic: "Product-defined", manual: "Staff-defined" },
  { dimension: "Integrations", quishub: "Custom", generic: "Limited connectors", manual: "Manual transfer" },
  { dimension: "AI", quishub: "Workflow-specific", generic: "Generic feature", manual: "None" },
  { dimension: "Rules", quishub: "Configurable", generic: "Product limitations", manual: "Human memory" },
  { dimension: "Automation depth", quishub: "End-to-end possible", generic: "Usually partial", manual: "Low" },
  { dimension: "Reporting", quishub: "Custom", generic: "Vendor-defined", manual: "Spreadsheet-heavy" },
  { dimension: "Human approval", quishub: "Configurable", generic: "Platform-dependent", manual: "Required throughout" },
  { dimension: "Scaling", quishub: "Software capacity", generic: "License-dependent", manual: "More headcount" },
];

/* --------------------------------------------------------------------------
   Before / after
   -------------------------------------------------------------------------- */
export const PA_BEFORE = [
  { label: "Request" }, { label: "Staff checks payer" }, { label: "Searches EHR" },
  { label: "Collects records" }, { label: "Logs into portal" }, { label: "Enters data" },
  { label: "Uploads docs" }, { label: "Waits" }, { label: "Checks status" },
  { label: "Calls payer" }, { label: "Updates patient" }, { label: "Updates system" },
];

export const PA_AFTER = [
  { label: "Request" }, { label: "Payer & requirements identified" }, { label: "Evidence retrieved" },
  { label: "Missing data flagged" }, { label: "Submission package prepared" },
  { label: "Staff review", sub: "where required" }, { label: "Submission" },
  { label: "Automated status monitoring" }, { label: "Communication triggers" },
  { label: "Exceptions routed to staff" },
];

export const SCHEDULING_AFTER_FLOW = [
  { label: "Patient calls after hours" }, { label: "AI identifies intent" },
  { label: "Checks configured availability" }, { label: "Books or routes appropriately" },
  { label: "Sends confirmation" }, { label: "Updates system" },
  { label: "Stores structured interaction record" },
];

/* --------------------------------------------------------------------------
   ROI / work removed
   -------------------------------------------------------------------------- */
export const ROI_METRICS = [
  "Hours of repetitive staff work removed",
  "Turnaround time reduced",
  "Manual actions eliminated",
  "Error rate reduced",
  "Revenue delays reduced",
  "Patient throughput increased",
  "Exception / human-review rate",
  "Cost per completed workflow",
];

export const ROI_EXAMPLE = {
  label: "Illustrative example — not a Quishub client result",
  lines: [
    "5 employees × 15 hours/week = 75 hours/week ≈ 3,900 hours/year",
    "At an illustrative $30/hour loaded labor cost ≈ $117,000/year of staff capacity",
    "If automation removes 60% of that repetitive work ≈ $70,200/year of capacity redirected",
  ],
};

/* --------------------------------------------------------------------------
   Delivery process
   -------------------------------------------------------------------------- */
export interface ProcessStep {
  n: string;
  title: string;
  body: string;
}

export const PROCESS_STEPS: ProcessStep[] = [
  { n: "01", title: "Workflow discovery", body: "Map the people, systems, decisions, documents, bottlenecks, compliance requirements, and exceptions involved in the workflow." },
  { n: "02", title: "Automation map", body: "Classify each step as automate, assist, review, or protect — before any architecture gets proposed." },
  { n: "03", title: "Architecture", body: "Design the application, data, security, AI, integration, permissions, auditability, and deployment layers." },
  { n: "04", title: "Highest-value workflow first", body: "Prove operational value on one workflow before expanding scope to the next." },
  { n: "05", title: "Integrate", body: "Connect the relevant EHR, payer, communications, billing, database, and document systems." },
  { n: "06", title: "Validate", body: "Test standard cases, edge cases, permissions, failure modes, data accuracy, AI behavior, and escalation paths." },
  { n: "07", title: "Deploy", body: "Launch into the agreed production environment." },
  { n: "08", title: "Expand", body: "Automate the next bottleneck once the first workflow is proven in production." },
];

/* --------------------------------------------------------------------------
   Who we build for
   -------------------------------------------------------------------------- */
export const AUDIENCES = [
  "Hospitals and health systems",
  "Specialty practices and physician groups",
  "Multi-site clinics and MSOs",
  "RCM organizations",
  "Healthcare SaaS companies",
  "Telehealth companies",
  "Home health and behavioral health organizations",
  "Diagnostic centers and laboratories",
];

/* --------------------------------------------------------------------------
   Verified proof — the only client-attributed metrics on this page.
   Sourced from the published NurMed case study (app/work/nurmed/page.tsx),
   labeled there "Healthcare · US / UAE".
   -------------------------------------------------------------------------- */
export const VERIFIED_PROOF = {
  client: "Avenue Broadwalk General Practice",
  product: "NurMed",
  region: "Healthcare · US / UAE",
  metrics: [
    { value: "44 min", label: "Consultation time before" },
    { value: "29 min", label: "Consultation time after" },
    { value: "34%", label: "Reduction in visit duration" },
    { value: "Week 1", label: "Time to measurable impact" },
  ],
  quote:
    "They are very much enjoying the use and convenience of typing much less if at all. Patients feel happier that they've been served quickly and doctors feel much less fatigued by the typing work.",
  attribution: "Clinical Team, Avenue Broadwalk General Practice",
};
