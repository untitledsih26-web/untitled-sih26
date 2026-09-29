export type AppView = "overview" | "dashboard" | "services" | "inquiry" | "settings";

export type SchemeId = "housing" | "income" | "ration";

export type PipelineHealth = "checking" | "online" | "degraded";

export type AgentStatus = "pending" | "running" | "complete";

export type ApiStatus = "idle" | "loading" | "success" | "fallback";

export type Eligibility = "Eligible" | "Ineligible" | "Under Review";

export type CaseStatus = "Cleared" | "Anomaly Detected" | "Rejected";

export interface SchemeDefinition {
  id: SchemeId;
  label: string;
  summary: string;
  idPrefix: "HS" | "IC" | "RS";
}

export interface CitizenForm {
  name: string;
  dob: string;
  aadhaarRef: "[Aadhaar Redacted]";
  scheme: SchemeId;
  consent: boolean;
}

export interface AgentRun {
  id: string;
  name: string;
  detail: string;
  status: AgentStatus;
  latencyMs: number | null;
  startedAt: number | null;
}

export interface ProcessTelemetry {
  execution_time_ms: number;
  token_usage: number;
  pipeline_status: string;
}

export interface ProcessResult {
  decision: string;
  application_id: string;
  eligibility: Eligibility;
  telemetry: ProcessTelemetry;
  consulted_departments: string[];
  source: "live" | "fallback";
  error: string;
}

export interface LedgerEntry {
  id: string;
  system: string;
  direction: "request" | "response";
  timestamp: string;
  payload: Record<string, unknown>;
}

export interface WorkflowState {
  step: 1 | 2 | 3 | 4 | 5;
  form: CitizenForm;
  fieldError: string;
  agents: AgentRun[];
  apiStatus: ApiStatus;
  apiError: string;
  result: ProcessResult | null;
  ledger: LedgerEntry[];
  consentGrantedAt: string | null;
}

export interface AdminCase {
  id: string;
  name: string;
  service: string;
  status: CaseStatus;
  flagged: boolean;
  revenueName: string;
  identityName: string;
  note: string;
  resolution: string | null;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

export interface ConsentPreferences {
  landRecords: boolean;
  revenue: boolean;
  identity: boolean;
  incomeRegistry: boolean;
  shareAnonymizedTelemetry: boolean;
  updatedAt: string | null;
}

export interface InquiryContext {
  applicationId: string | null;
  eligibility: Eligibility | null;
  decision: string | null;
  schemeLabel: string;
}
