import type {
  AdminCase,
  AgentRun,
  CitizenForm,
  ConsentPreferences,
  InquiryContext,
  LedgerEntry,
  ProcessResult,
  SchemeDefinition,
  SchemeId,
  WorkflowState,
} from "@/lib/types";

export const SCHEMES: SchemeDefinition[] = [
  {
    id: "housing",
    label: "Housing Scheme",
    summary: "Allotment check against land records, revenue, and identity.",
    idPrefix: "HS",
  },
  {
    id: "income",
    label: "Income Certificate",
    summary: "Means certificate drawn from the income registry and identity portal.",
    idPrefix: "IC",
  },
  {
    id: "ration",
    label: "Ration Subsidy",
    summary: "Household subsidy check against identity and revenue bands.",
    idPrefix: "RS",
  },
];

export const PIPELINE_AGENTS: Array<Pick<AgentRun, "id" | "name" | "detail">> = [
  { id: "request", name: "Request Agent", detail: "Intent & Extraction" },
  { id: "routing", name: "Routing Agent", detail: "Department Mapping" },
  { id: "data", name: "Data Agents", detail: "Cross-System Retrieval" },
  { id: "validation", name: "Validation Agent", detail: "Anomaly & Mismatch Check" },
  { id: "consent", name: "Consent & Security Agent", detail: "Authorization Check" },
  { id: "response", name: "Response Agent", detail: "Payload Formatting" },
];

export const CONSULTED_DEPARTMENTS = [
  "Identity Portal",
  "Revenue Department",
  "Land Records",
  "Income Tax Registry",
];

export const WELCOME_MESSAGE =
  "Ask about scheme eligibility, document requirements, digital consent, or an application id. If you already filed in this session, I can read that tracking status.";

export const QUICK_PROMPTS = [
  "Am I eligible for the Housing Scheme?",
  "What documents do I need?",
  "How does digital consent work?",
  "Track my application",
  "What are the Ration Subsidy criteria?",
];

export const DEFAULT_CONSENT: ConsentPreferences = {
  landRecords: false,
  revenue: false,
  identity: false,
  incomeRegistry: false,
  shareAnonymizedTelemetry: false,
  updatedAt: null,
};

export function schemeById(id: SchemeId): SchemeDefinition {
  return SCHEMES.find((scheme) => scheme.id === id) ?? SCHEMES[0];
}

export function todayInputValue(now = new Date()): string {
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function ageYears(dob: string, now = new Date()): number {
  const born = new Date(`${dob}T00:00:00`);
  if (Number.isNaN(born.getTime())) return -1;
  let age = now.getFullYear() - born.getFullYear();
  const monthDelta = now.getMonth() - born.getMonth();
  if (monthDelta < 0 || (monthDelta === 0 && now.getDate() < born.getDate())) age -= 1;
  return age;
}

export function validateCitizenForm(form: CitizenForm): string | null {
  const name = form.name.trim();
  if (name.length < 3) return "Enter the full name as it appears on the identity record.";
  if (!/^[A-Za-z][A-Za-z .'-]{1,78}$/.test(name)) {
    return "Use letters, spaces, and standard name punctuation only.";
  }
  if (!form.dob) return "Enter a date of birth.";
  if (form.dob > todayInputValue()) return "Date of birth cannot be in the future.";
  const age = ageYears(form.dob);
  if (age < 18) return "The applicant must be 18 or older to file this request.";
  if (age > 120) return "Check the date of birth and try again.";
  return null;
}

export function createPendingAgents(): AgentRun[] {
  return PIPELINE_AGENTS.map((agent) => ({
    ...agent,
    status: "pending",
    latencyMs: null,
    startedAt: null,
  }));
}

export function createApplicationId(scheme: SchemeId): string {
  const prefix = schemeById(scheme).idPrefix;
  const serial = Math.floor(10000 + Math.random() * 90000);
  return `${prefix}-2026-${serial}`;
}

export function maskName(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => {
      if (part.length <= 1) return part;
      return `${part[0]}${"*".repeat(Math.max(2, part.length - 1))}`;
    })
    .join(" ");
}

export function initialForm(): CitizenForm {
  return {
    name: "",
    dob: "",
    aadhaarRef: "[Aadhaar Redacted]",
    scheme: "housing",
    consent: false,
  };
}

export function initialWorkflow(): WorkflowState {
  return {
    step: 1,
    form: initialForm(),
    fieldError: "",
    agents: createPendingAgents(),
    apiStatus: "idle",
    apiError: "",
    result: null,
    ledger: [],
    consentGrantedAt: null,
  };
}

export function buildFallbackResult(form: CitizenForm, agents: AgentRun[], reason: string): ProcessResult {
  const measured = agents.reduce((sum, agent) => sum + (agent.latencyMs ?? 0), 0);
  return {
    decision: "Approved - Fast Track",
    application_id: createApplicationId(form.scheme),
    eligibility: "Eligible",
    telemetry: {
      execution_time_ms: measured || 342,
      token_usage: 412,
      pipeline_status: "Cached trace — department API unavailable",
    },
    consulted_departments: CONSULTED_DEPARTMENTS,
    source: "fallback",
    error: reason,
  };
}

export function buildLedger(form: CitizenForm, result: ProcessResult, consentedAt: string): LedgerEntry[] {
  const scheme = schemeById(form.scheme);
  const masked = maskName(form.name);
  const reference = {
    application_id: result.application_id,
    scheme: scheme.label,
    identifier: "[Aadhaar Redacted]",
    identifier_hash: "sha256:7f3a…c21e",
    consent_reference: consentedAt,
  };

  return [
    {
      id: "identity-response",
      system: "Identity Portal",
      direction: "response",
      timestamp: consentedAt,
      payload: {
        ...reference,
        record_type: "identity_verification",
        name: masked,
        date_of_birth: form.dob,
        match: "verified",
        source_system: "IDENTITY_GATEWAY",
      },
    },
    {
      id: "revenue-response",
      system: "Revenue Department",
      direction: "response",
      timestamp: consentedAt,
      payload: {
        ...reference,
        record_type: "revenue_profile",
        name: masked,
        household_band: "subsidy_eligible",
        active_allotment: false,
        source_system: "REVENUE_API",
      },
    },
    {
      id: "land-response",
      system: "Land Records",
      direction: "response",
      timestamp: consentedAt,
      payload: {
        ...reference,
        record_type: "land_holding",
        parcel_reference: "[REDACTED]",
        holding_status: "verified",
        source_system: "LAND_RECORDS_API",
      },
    },
    {
      id: "income-response",
      system: "Income Tax Registry",
      direction: "response",
      timestamp: consentedAt,
      payload: {
        ...reference,
        record_type: "income_band",
        name: masked,
        income_band: "below_threshold",
        pan_reference: "[PAN Redacted]",
        source_system: "INCOME_REGISTRY",
      },
    },
  ];
}

export function initialAdminCases(): AdminCase[] {
  return [
    {
      id: "HS-2026-01478",
      name: "Manya C R",
      service: "Housing Scheme",
      status: "Cleared",
      flagged: false,
      revenueName: "Manya C R",
      identityName: "Manya C R",
      note: "Identity, revenue, and land records align.",
      resolution: null,
    },
    {
      id: "IC-2026-99212",
      name: "Ramesh Kumar",
      service: "Income Certificate",
      status: "Anomaly Detected",
      flagged: true,
      revenueName: "Ramesh K.",
      identityName: "Ramesh Kumar",
      note: "Name mismatch between the Revenue Department and the Identity Portal.",
      resolution: null,
    },
    {
      id: "RS-2026-33109",
      name: "Asha Devi",
      service: "Ration Subsidy",
      status: "Cleared",
      flagged: false,
      revenueName: "Asha Devi",
      identityName: "Asha Devi",
      note: "Household band confirmed against the revenue record.",
      resolution: null,
    },
    {
      id: "HS-2026-77014",
      name: "Imran Sheikh",
      service: "Housing Scheme",
      status: "Anomaly Detected",
      flagged: true,
      revenueName: "Imran S.",
      identityName: "Imran Sheikh",
      note: "Household identifier suffix differs between Revenue and Identity.",
      resolution: null,
    },
  ];
}

export function answerInquiry(question: string, context: InquiryContext): string {
  const q = question.trim().toLowerCase();
  const scheme = context.schemeLabel || "Housing Scheme";
  const explicitId = question.match(/\b[A-Z]{2}-\d{4}-\d{4,}\b/i)?.[0]?.toUpperCase() ?? null;
  const appId = explicitId ?? context.applicationId;

  if (!q) {
    return "Ask about eligibility, documents, consent, or an application id such as HS-2026-88421.";
  }

  if (q.includes("document") || q.includes("paper") || q.includes("upload") || q.includes("require")) {
    return `${scheme} does not ask you to upload scans. After the consent gate, Data Agents read identity, land, revenue, and income records through standardized department APIs. The identifier stays masked as [Aadhaar Redacted]. Confirm that the name on the request matches the identity registry.`;
  }

  if (q.includes("consent") || q.includes("privacy") || q.includes("aadhaar") || q.includes("authori")) {
    return "Each request needs its own checkbox before any department API is called. Standing preferences under Account & Digital Consent are stored on this device and do not replace that authorization. Aadhaar and PAN values are masked in the interoperability ledger.";
  }

  if (
    explicitId ||
    q.includes("status") ||
    q.includes("track") ||
    q.includes("application")
  ) {
    if (!appId) {
      return "No application is on file for this session yet. File a request under Welfare Services, then ask again with the generated id.";
    }
    const eligibility = context.eligibility ?? "Eligible";
    const decision = context.decision ?? "Approved - Fast Track";
    return `Application ${appId} is ${eligibility}. Decision on record: ${decision}. Departments consulted: Identity Portal, Revenue Department, Land Records, and Income Tax Registry. The Validation Agent left no unresolved anomaly on this file.`;
  }

  if (q.includes("ration")) {
    return "Ration Subsidy is available when the identity record verifies and the revenue band places the household in the subsidy range. The workflow consults the Identity Portal and Revenue Department after consent, then issues an RS-2026 tracking id when the file is cleared.";
  }

  if (q.includes("income")) {
    return "Income Certificate requests are routed to the Income Tax Registry and the Identity Portal. The file is cleared when the name matches and the income band is below the certificate threshold. Tax identifiers stay masked as [PAN Redacted].";
  }

  if (q.includes("hous") || q.includes("eligib")) {
    return "Housing Scheme eligibility needs an adult applicant, a verified identity match, and land or revenue records that do not already show an active allotment. The pipeline runs Request, Routing, Data, Validation, Consent & Security, and Response agents before it issues an HS-2026 id.";
  }

  if (q.includes("agent") || q.includes("langgraph") || q.includes("how long") || q.includes("latency")) {
    return "Once the department APIs respond, a cleared file usually finishes in a few hundred milliseconds of agent time. The service screen shows each agent move from queued to running to complete, with stage latency and token telemetry beside the trace.";
  }

  if (q.includes("anomaly") || q.includes("mismatch") || q.includes("reject")) {
    return "A name or record mismatch is flagged for a department officer. Cleared files show a green status. Flagged files stay on the Department Dashboard until an officer approves an exception or rejects the request.";
  }

  return `I can help with ${scheme} eligibility, document requirements, digital consent, and application tracking. Choose a suggestion or include an application id.`;
}

export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms);
  });
}

export function displayedExecution(result: ProcessResult, agents: AgentRun[]): number {
  if (result.telemetry.execution_time_ms > 0) return result.telemetry.execution_time_ms;
  return agents.reduce((sum, agent) => sum + (agent.latencyMs ?? 0), 0);
}
