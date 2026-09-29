"use client";

import {
  useEffect,
  useRef,
  useState,
  type ButtonHTMLAttributes,
  type FormEvent,
  type ReactNode,
} from "react";
import {
  createClient,
  type Session,
  type SupabaseClient,
} from "@supabase/supabase-js";
import {
  Activity,
  ArrowLeft,
  ArrowRight,
  Building2,
  Check,
  CheckCircle2,
  ChevronRight,
  Circle,
  Clock3,
  Database,
  FileCheck2,
  Fingerprint,
  Landmark,
  Loader2,
  LockKeyhole,
  LogOut,
  Mail,
  RefreshCw,
  ShieldCheck,
  Smartphone,
  TriangleAlert,
  Users,
  XCircle,
} from "lucide-react";

/* -------------------------------------------------------------------------- */
/* Configuration                                                               */
/* -------------------------------------------------------------------------- */

const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() ?? "";

const SUPABASE_ANON_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim() ?? "";

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL?.trim().replace(/\/+$/, "") ?? "";

const IS_DEVELOPMENT = process.env.NODE_ENV === "development";
const OTP_COOLDOWN_MS = 60_000;
const OTP_DEADLINE_STORAGE_KEY = "sarkar-seva:otp-deadline";
const CONSENT_VERSION = "cross-department-v1";
const SERVICE_TYPE = "Integrated Eligibility Verification";
const SECURE_ID_MASK = "[Aadhaar Redacted]";
const REQUEST_TIMEOUT_MS = 20_000;
const ADMIN_PAGE_SIZE = 25;

const CONSENT_SCOPES = [
  "land_records",
  "income",
  "identity",
] as const;

let browserSupabase: SupabaseClient | null = null;

function validServiceUrl(value: string): boolean {
  try {
    const url = new URL(value);
    const local =
      url.hostname === "localhost" ||
      url.hostname === "127.0.0.1" ||
      url.hostname === "[::1]";

return (
      !url.username &&
      !url.password &&
      !url.search &&
      !url.hash &&
      (url.protocol === "https:" ||
        (IS_DEVELOPMENT && local && url.protocol === "http:"))
    );
  } catch {
    return false;
  }
}

function getSupabase(): SupabaseClient | null {
  if (typeof window === "undefined") return null;
  if (browserSupabase) return browserSupabase;

if (
    !SUPABASE_ANON_KEY ||
    !SUPABASE_URL ||
    !validServiceUrl(SUPABASE_URL)
  ) {
    return null;
  }

try {
    browserSupabase = createClient(
      SUPABASE_URL,
      SUPABASE_ANON_KEY,
      {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: false,
        },
      },
    );

return browserSupabase;
  } catch {
    return null;
  }
}

function apiUrl(path: string): string {
  if (API_BASE && !validServiceUrl(API_BASE)) {
    throw new Error(
      "The application API URL is invalid. Contact the platform administrator.",
    );
  }

return `${API_BASE}${path}`;
}

/* -------------------------------------------------------------------------- */
/* Domain contracts                                                            */
/* -------------------------------------------------------------------------- */

type CurrentView = "landing" | "user" | "admin";
type AuthMode = "email" | "phone";
type WizardStep = 1 | 2 | 3;

const AGENTS = [
  "Request",
  "Routing",
  "Data",
  "Validation",
  "Consent",
  "Response",
  "Notifier",
] as const;

type AgentName = (typeof AGENTS)[number];

const AGENT_STATES = [
  "queued",
  "running",
  "completed",
  "flagged",
  "failed",
  "skipped",
] as const;

type AgentState = (typeof AGENT_STATES)[number];

const APPLICATION_STATES = [
  "queued",
  "processing",
  "cleared",
  "anomaly",
  "rejected",
  "failed",
] as const;

type ApplicationStatus = (typeof APPLICATION_STATES)[number];
type PipelineStatus = "online" | "degraded" | "offline";
type ReviewDecision = "approve" | "reject";

interface AgentTrace {
  name: AgentName;
  status: AgentState;
  executionMs: number | null;
  tokenUsage: number | null;
}

interface ApplicationSnapshot {
  id: string;
  status: ApplicationStatus;
  executionMs: number | null;
  tokenUsage: number | null;
  agents: AgentTrace[];
}

interface ApplicationPayload {
  fullName: string;
  dateOfBirth: string;
  serviceType: typeof SERVICE_TYPE;
  consent: {
    granted: true;
    version: typeof CONSENT_VERSION;
    scopes: typeof CONSENT_SCOPES;
    clientRecordedAt: string;
  };
}

interface Submission {
  idempotencyKey: string;
  payload: ApplicationPayload;
}

interface NameMismatch {
  field: "full_name";
  revenueName: string;
  identityName: string;
}

interface AdminRequest {
  id: string;
  applicantName: string;
  serviceType: string;
  status: ApplicationStatus;
  version: number;
  mismatch: NameMismatch | null;
}

interface AdminPage {
  pipeline: PipelineStatus;
  rows: AdminRequest[];
  nextCursor: string | null;
}

interface OtpDelivery {
  mode: AuthMode;
  contact: string;
}

const APPLICATION_LABELS: Record<ApplicationStatus, string> = {
  queued: "Queued",
  processing: "Processing",
  cleared: "Cleared",
  anomaly: "Anomaly Detected",
  rejected: "Rejected",
  failed: "Processing Failed",
};

const AGENT_DESCRIPTIONS: Record<AgentName, string> = {
  Request: "Application intake",
  Routing: "Department orchestration",
  Data: "Authorized record retrieval",
  Validation: "Cross-source verification",
  Consent: "Consent audit",
  Response: "Decision preparation",
  Notifier: "Applicant notification",
};

/* -------------------------------------------------------------------------- */
/* Runtime validation                                                          */
/* -------------------------------------------------------------------------- */

function objectValue(value: unknown): Record<string, unknown> {
  if (
    value === null ||
    typeof value !== "object" ||
    Array.isArray(value)
  ) {
    throw new Error("The server returned an invalid response.");
  }

return value as Record<string, unknown>;
}

function textValue(value: unknown, maximum = 300): string {
  if (
    typeof value !== "string" ||
    !value.trim() ||
    value.length > maximum
  ) {
    throw new Error("The server returned an invalid text field.");
  }

return value;
}

function numberValue(value: unknown, integer = false): number {
  if (
    typeof value !== "number" ||
    !Number.isFinite(value) ||
    value < 0 ||
    (integer && !Number.isSafeInteger(value))
  ) {
    throw new Error("The server returned invalid numerical data.");
  }

return value;
}

function nullableNumber(
  value: unknown,
  integer = false,
): number | null {
  return value === null ? null : numberValue(value, integer);
}

function enumValue<T extends string>(
  value: unknown,
  allowed: readonly T[],
): T {
  if (
    typeof value !== "string" ||
    !allowed.some((entry) => entry === value)
  ) {
    throw new Error("The server returned an unsupported status.");
  }

return value as T;
}

function parseApplication(value: unknown): ApplicationSnapshot {
  const data = objectValue(value);

if (!Array.isArray(data.agents) || data.agents.length !== 7) {
    throw new Error(
      "The telemetry response must contain all seven agents.",
    );
  }

const parsedAgents: AgentTrace[] = data.agents.map(
    (entry: unknown) => {
      const agent = objectValue(entry);

return {
        name: enumValue(agent.name, AGENTS),
        status: enumValue(agent.status, AGENT_STATES),
        executionMs: nullableNumber(agent.executionMs),
        tokenUsage: nullableNumber(agent.tokenUsage, true),
      };
    },
  );

const agentMap = new Map(
    parsedAgents.map((agent) => [agent.name, agent]),
  );

const orderedAgents = AGENTS.map((name) => {
    const agent = agentMap.get(name);

if (!agent) {
      throw new Error(
        "The telemetry response contains missing or duplicate agents.",
      );
    }

return agent;
  });

return {
    id: textValue(data.id, 128),
    status: enumValue(data.status, APPLICATION_STATES),
    executionMs: nullableNumber(data.executionMs),
    tokenUsage: nullableNumber(data.tokenUsage, true),
    agents: orderedAgents,
  };
}

function parseAdminRequest(value: unknown): AdminRequest {
  const data = objectValue(value);
  let mismatch: NameMismatch | null = null;

if (data.mismatch !== null) {
    const source = objectValue(data.mismatch);

if (source.field !== "full_name") {
      throw new Error("The server returned an unsupported review flag.");
    }

mismatch = {
      field: "full_name",
      revenueName: textValue(source.revenueName, 160),
      identityName: textValue(source.identityName, 160),
    };
  }

return {
    id: textValue(data.id, 128),
    applicantName: textValue(data.applicantName, 160),
    serviceType: textValue(data.serviceType, 160),
    status: enumValue(data.status, APPLICATION_STATES),
    version: numberValue(data.version, true),
    mismatch,
  };
}

function parseAdminPage(value: unknown): AdminPage {
  const data = objectValue(value);

if (
    !Array.isArray(data.rows) ||
    data.rows.length > ADMIN_PAGE_SIZE
  ) {
    throw new Error("The server returned an invalid request page.");
  }

const rows = data.rows.map(parseAdminRequest);

if (new Set(rows.map((row) => row.id)).size !== rows.length) {
    throw new Error("The request page contains duplicate application IDs.");
  }

return {
    pipeline: enumValue(
      data.pipeline,
      ["online", "degraded", "offline"] as const,
    ),
    rows,
    nextCursor:
      data.nextCursor === null
        ? null
        : textValue(data.nextCursor, 2_048),
  };
}

/* -------------------------------------------------------------------------- */
/* Network and formatting helpers                                              */
/* -------------------------------------------------------------------------- */

class ApiError extends Error {
  readonly status: number;

constructor(status: number, message: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

function aborted(): DOMException {
  return new DOMException("Request cancelled.", "AbortError");
}

function errorMessage(error: unknown): string {
  if (error instanceof ApiError) return error.message;

if (error instanceof TypeError) {
    return "Unable to reach the service. Check your connection and try again.";
  }

if (error instanceof Error) return error.message;

return "Something went wrong. Please try again.";
}

function authErrorMessage(error: unknown): string {
  if (
    typeof error === "object" &&
    error !== null &&
    "status" in error &&
    error.status === 429
  ) {
    return "Too many attempts. Wait before requesting another code.";
  }

if (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    error.code === "otp_expired"
  ) {
    return "This code is invalid or expired. Request a new code when available.";
  }

return "Authentication could not be completed. Check the code or contact details and try again.";
}

async function apiRequest(
  path: string,
  init: RequestInit = {},
  externalSignal?: AbortSignal,
): Promise<unknown> {
  if (externalSignal?.aborted) throw aborted();

const supabase = getSupabase();

if (!supabase) {
    throw new Error("Authentication is not configured.");
  }

const { data, error } = await supabase.auth.getSession();

if (error || !data.session) {
    throw new ApiError(
      401,
      "Your session is no longer available. Sign out and sign in again.",
    );
  }

if (externalSignal?.aborted) throw aborted();

const controller = new AbortController();
  let timedOut = false;

const forwardAbort = () => controller.abort();
  externalSignal?.addEventListener("abort", forwardAbort, {
    once: true,
  });

const timeout = window.setTimeout(() => {
    timedOut = true;
    controller.abort();
  }, REQUEST_TIMEOUT_MS);

const headers = new Headers(init.headers);
  headers.set("Accept", "application/json");
  headers.set("Authorization", `Bearer ${data.session.access_token}`);

if (init.body) headers.set("Content-Type", "application/json");

try {
    const response = await fetch(apiUrl(path), {
      ...init,
      headers,
      signal: controller.signal,
      credentials: "omit",
      cache: "no-store",
      redirect: "error",
      referrerPolicy: "no-referrer",
    });

if (!response.ok) {
      const messages: Record<number, string> = {
        400: "The request could not be validated. Check the supplied information.",
        401: "Your session has expired. Sign out and sign in again.",
        403: "Department reviewer access is required for this action.",
        404: "This application is no longer available.",
        409: "This record changed during review. Refresh it before deciding.",
        422: "The submitted information did not pass server validation.",
        429: "The service is receiving too many requests. Please wait and retry.",
        503: "The processing service is temporarily unavailable.",
      };

throw new ApiError(
        response.status,
        messages[response.status] ??
          "The server could not complete this request. Please try again.",
      );
    }

if (
      !response.headers
        .get("content-type")
        ?.toLowerCase()
        .includes("application/json")
    ) {
      throw new Error("The server returned an unexpected response format.");
    }

const result: unknown = await response.json();
    return result;
  } catch (error: unknown) {
    if (timedOut) {
      throw new Error(
        "The request timed out. Its outcome may be pending on the server.",
      );
    }

if (externalSignal?.aborted) throw aborted();

throw error;
  } finally {
    window.clearTimeout(timeout);
    externalSignal?.removeEventListener("abort", forwardAbort);
  }
}

function terminalStatus(status: ApplicationStatus): boolean {
  return (
    status === "cleared" ||
    status === "anomaly" ||
    status === "rejected" ||
    status === "failed"
  );
}

function duration(value: number | null | undefined): string {
  if (value === null || value === undefined) return "—";
  if (value < 1_000) return `${Math.round(value)} ms`;
  return `${(value / 1_000).toFixed(2)} s`;
}

function tokens(value: number | null | undefined): string {
  return value === null || value === undefined
    ? "—"
    : value.toLocaleString("en-IN");
}

function localToday(): string {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");

return `${now.getFullYear()}-${month}-${day}`;
}

function validDateOfBirth(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;

const parsed = new Date(`${value}T00:00:00.000Z`);

return (
    Number.isFinite(parsed.getTime()) &&
    parsed.toISOString().slice(0, 10) === value &&
    value >= "1900-01-01" &&
    value <= localToday()
  );
}

function newRequestKey(): string {
  if (!globalThis.crypto?.randomUUID) {
    throw new Error(
      "A secure browser context is required. Open this portal over HTTPS.",
    );
  }

return globalThis.crypto.randomUUID();
}

function sessionReference(session: Session): string {
  try {
    const encoded = session.access_token.split(".")[1];
    if (!encoded) return "Authenticated";

const base64 = encoded.replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64.padEnd(
      Math.ceil(base64.length / 4) * 4,
      "=",
    );

const payload = objectValue(JSON.parse(atob(padded)) as unknown);
    const id = payload.session_id;

if (typeof id !== "string" || id.length < 12) {
      return "Authenticated";
    }

return `${id.slice(0, 8)}…${id.slice(-4)}`;
  } catch {
    return "Authenticated";
  }
}

/* -------------------------------------------------------------------------- */
/* Shared UI                                                                   */
/* -------------------------------------------------------------------------- */

const INPUT =
  "mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 " +
  "text-sm text-slate-900 outline-none transition placeholder:text-slate-400 " +
  "focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10 " +
  "disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-500";

const FOCUS =
  "focus-visible:outline-none focus-visible:ring-4 " +
  "focus-visible:ring-blue-500/30 focus-visible:ring-offset-2";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
  variant?: "primary" | "secondary" | "danger";
}

function Button({
  children,
  className = "",
  loading = false,
  disabled,
  variant = "primary",
  type = "button",
  ...props
}: ButtonProps) {
  const variants = {
    primary:
      "border-transparent bg-blue-700 text-white hover:bg-blue-800",
    secondary:
      "border-slate-300 bg-white text-slate-700 hover:bg-slate-50",
    danger:
      "border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100",
  };

return (
    <button
      {...props}
      type={type}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={[
        "inline-flex min-h-11 items-center justify-center gap-2 rounded-xl",
        "border px-4 py-2.5 text-sm font-semibold transition",
        "disabled:cursor-not-allowed disabled:opacity-50",
        FOCUS,
        variants[variant],
        className,
      ].join(" ")}
    >
      {loading && (
        <Loader2 aria-hidden="true" className="h-4 w-4 animate-spin" />
      )}
      {children}
    </button>
  );
}

function Banner({
  children,
  tone = "error",
}: {
  children: ReactNode;
  tone?: "error" | "info" | "success";
}) {
  const styles = {
    error: "border-rose-200 bg-rose-50 text-rose-800",
    info: "border-blue-200 bg-blue-50 text-blue-900",
    success: "border-emerald-200 bg-emerald-50 text-emerald-900",
  };

const Icon = tone === "error" ? TriangleAlert : ShieldCheck;

return (
    <div
      role={tone === "error" ? "alert" : "status"}
      className={`flex gap-3 rounded-xl border p-4 text-sm leading-6 ${styles[tone]}`}
    >
      <Icon aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0" />
      <div className="min-w-0">{children}</div>
    </div>
  );
}

function Panel({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={`rounded-2xl border border-slate-200 bg-white shadow-sm ${className}`}
    >
      {children}
    </section>
  );
}

function StatusBadge({ status }: { status: ApplicationStatus }) {
  const styles: Record<ApplicationStatus, string> = {
    queued: "border-slate-200 bg-slate-100 text-slate-700",
    processing: "border-blue-200 bg-blue-50 text-blue-800",
    cleared: "border-emerald-200 bg-emerald-50 text-emerald-800",
    anomaly: "border-amber-200 bg-amber-50 text-amber-900",
    rejected: "border-rose-200 bg-rose-50 text-rose-800",
    failed: "border-rose-200 bg-rose-50 text-rose-800",
  };

const Icon =
    status === "cleared"
      ? CheckCircle2
      : status === "anomaly"
        ? TriangleAlert
        : status === "failed" || status === "rejected"
          ? XCircle
          : status === "processing"
            ? Loader2
            : Clock3;

return (
    <span
      className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border px-2.5 py-1 text-xs font-semibold ${styles[status]}`}
    >
      <Icon
        aria-hidden="true"
        className={`h-3.5 w-3.5 ${
          status === "processing" ? "animate-spin" : ""
        }`}
      />
      {APPLICATION_LABELS[status]}
    </span>
  );
}

function Metric({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: ReactNode;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
      <div className="flex items-center justify-between gap-3 text-slate-500">
        <span className="text-xs font-semibold uppercase tracking-wider">
          {label}
        </span>
        {icon}
      </div>
      <p className="mt-3 font-mono text-2xl font-semibold tracking-tight text-slate-900">
        {value}
      </p>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* OTP login                                                                   */
/* -------------------------------------------------------------------------- */

function LoginGate({ initialError }: { initialError: string | null }) {
  const [mode, setMode] = useState<AuthMode>("email");
  const [contact, setContact] = useState("");
  const [otp, setOtp] = useState("");
  const [delivery, setDelivery] = useState<OtpDelivery | null>(null);
  const [busy, setBusy] = useState<"send" | "verify" | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [remaining, setRemaining] = useState(0);

const deadline = useRef(0);
  const actionLocked

