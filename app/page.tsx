"use client";

/* app/page.tsx
 *
 * Required dependencies:
 *   @supabase/supabase-js
 *   lucide-react
 *
 * Tailwind must already be configured in the surrounding Next.js project.
 *
 * SECURITY:
 * - Only a public Supabase key belongs in NEXT_PUBLIC_* variables.
 * - app_metadata is used for UI gating, not backend authorization.
 * - Production access requires RLS and server-side authorization.
 * - Governance data below is synthetic and remains in component memory.
 * - SHA-256 is an integrity digest, not a digital signature.
 * - Certificate downloads are unsigned processing-record previews.
 */

import {
  useEffect,
  useId,
  useMemo,
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
  ArrowRight,
  Bell,
  Building2,
  Check,
  CheckCircle2,
  ChevronRight,
  Clock3,
  Cpu,
  Download,
  Eye,
  FileSpreadsheet,
  FileText,
  Fingerprint,
  Globe2,
  GraduationCap,
  HeartPulse,
  Landmark,
  Leaf,
  Lock,
  LogOut,
  Mail,
  MessageSquare,
  Mic,
  Paperclip,
  Play,
  QrCode,
  RefreshCw,
  Search,
  Send,
  ShieldCheck,
  SlidersHorizontal,
  UserCheck,
  Users,
  Wallet,
  X,
  AlertTriangle,
  type LucideIcon,
} from "lucide-react";

/* -------------------------------------------------------------------------- */
/* Types and configuration                                                    */
/* -------------------------------------------------------------------------- */

type View = "services" | "agents" | "tracker" | "assistant" | "admin";
type Language = "en" | "hi" | "bn" | "mr" | "ta";
type Category =
  | "All"
  | "Socio-Economic"
  | "Agriculture"
  | "Education"
  | "Healthcare"
  | "Small Business";
type Risk = "Low" | "Medium" | "High Anomaly";
type ApplicationStatus =
  | "Submitted"
  | "Processing"
  | "Review ready"
  | "Manual audit"
  | "Approved"
  | "Rejected";
type Decision = "Approved" | "Manual audit" | "Rejected";

type Scheme = {
  id: string;
  name: string;
  department: string;
  category: Exclude<Category, "All">;
  description: string;
  time: string;
  icon: LucideIcon;
  documents: string[];
};

type Application = {
  id: string;
  applicant: string;
  schemeId: string;
  scheme: string;
  risk: Risk;
  confidence: number | null;
  status: ApplicationStatus;
  stage: number;
  updatedAt: string;
};

type ChatMessage = {
  id: string;
  role: "assistant" | "user";
  text: string;
};

type Attachment = {
  name: string;
  size: number;
  type: string;
  url: string;
};

const VIEW_ORDER: View[] = [
  "services",
  "agents",
  "tracker",
  "assistant",
  "admin",
];

const VIEW_ICONS: Record<View, LucideIcon> = {
  services: Landmark,
  agents: Cpu,
  tracker: FileText,
  assistant: MessageSquare,
  admin: Building2,
};

const TRANSLATIONS: Record<
  Language,
  {
    label: string;
    views: Record<View, string>;
    heading: string;
    lead: string;
  }
> = {
  en: {
    label: "English",
    views: {
      services: "Citizen Services",
      agents: "Agent Control Room",
      tracker: "Application Tracker",
      assistant: "Sarkar Mitra",
      admin: "Officer Operations",
    },
    heading: "One nation. Accessible services.",
    lead: "Discover services, prepare applications and follow every step.",
  },
  hi: {
    label: "हिंदी",
    views: {
      services: "नागरिक सेवाएँ",
      agents: "एजेंट नियंत्रण कक्ष",
      tracker: "आवेदन की स्थिति",
      assistant: "सरकार मित्र",
      admin: "अधिकारी संचालन",
    },
    heading: "एक राष्ट्र। सुलभ सेवाएँ।",
    lead: "सेवाएँ खोजें, आवेदन तैयार करें और हर चरण की जानकारी पाएँ।",
  },
  bn: {
    label: "বাংলা",
    views: {
      services: "নাগরিক পরিষেবা",
      agents: "এজেন্ট নিয়ন্ত্রণ কক্ষ",
      tracker: "আবেদনের অবস্থা",
      assistant: "সরকার মিত্র",
      admin: "আধিকারিক কার্যক্রম",
    },
    heading: "এক দেশ। সহজলভ্য পরিষেবা।",
    lead: "পরিষেবা খুঁজুন, আবেদন প্রস্তুত করুন এবং অগ্রগতি দেখুন।",
  },
  mr: {
    label: "मराठी",
    views: {
      services: "नागरिक सेवा",
      agents: "एजंट नियंत्रण कक्ष",
      tracker: "अर्जाची स्थिती",
      assistant: "सरकार मित्र",
      admin: "अधिकारी कामकाज",
    },
    heading: "एक राष्ट्र। सुलभ सेवा।",
    lead: "सेवा शोधा, अर्ज तयार करा आणि प्रत्येक टप्प्याची माहिती मिळवा.",
  },
  ta: {
    label: "தமிழ்",
    views: {
      services: "குடிமக்கள் சேவைகள்",
      agents: "முகவர் கட்டுப்பாட்டு அறை",
      tracker: "விண்ணப்ப நிலை",
      assistant: "சர்க்கார் மித்ரா",
      admin: "அலுவலர் செயல்பாடுகள்",
    },
    heading: "ஒரே நாடு. எளிதில் அணுகக்கூடிய சேவைகள்.",
    lead: "சேவைகளைத் தேடி, விண்ணப்பங்களைத் தயாரித்து, முன்னேற்றத்தைப் பாருங்கள்.",
  },
};

const SCHEMES: Scheme[] = [
  {
    id: "dbt",
    name: "Direct Benefit Transfer",
    department: "Benefit Delivery Department",
    category: "Socio-Economic",
    description:
      "Prepare a benefit-transfer request and check document readiness.",
    time: "Instant AI pre-check",
    icon: Wallet,
    documents: [
      "Identity document available",
      "Bank account evidence available",
      "Scheme-specific supporting document available",
    ],
  },
  {
    id: "ration",
    name: "Ration Card Renewal",
    department: "Food & Public Distribution",
    category: "Socio-Economic",
    description:
      "Review household details and prepare a renewal application.",
    time: "Instant AI pre-check",
    icon: FileSpreadsheet,
    documents: [
      "Existing ration card available",
      "Address evidence available",
      "Household details reviewed",
    ],
  },
  {
    id: "land",
    name: "Land Revenue Records",
    department: "State Revenue Department",
    category: "Agriculture",
    description:
      "Organise land-record references for the relevant state authority.",
    time: "Document-dependent",
    icon: Leaf,
    documents: [
      "Land-record reference available",
      "Identity document available",
      "District and village details available",
    ],
  },
  {
    id: "pension",
    name: "Pension Allocation",
    department: "Social Welfare Department",
    category: "Socio-Economic",
    description:
      "Prepare supporting information for pension eligibility assessment.",
    time: "Instant AI pre-check",
    icon: Users,
    documents: [
      "Identity document available",
      "Age evidence available",
      "Scheme-specific income evidence available",
    ],
  },
  {
    id: "education",
    name: "Education Assistance",
    department: "Education Department",
    category: "Education",
    description:
      "Organise enrolment and supporting records for assistance schemes.",
    time: "Instant AI pre-check",
    icon: GraduationCap,
    documents: [
      "Enrolment evidence available",
      "Academic records available",
      "Scheme-specific supporting document available",
    ],
  },
  {
    id: "health",
    name: "Healthcare Assistance",
    department: "Health & Family Welfare",
    category: "Healthcare",
    description:
      "Prepare the documents needed for healthcare support assessment.",
    time: "Document-dependent",
    icon: HeartPulse,
    documents: [
      "Identity document available",
      "Relevant health records available",
      "Scheme-specific supporting document available",
    ],
  },
  {
    id: "enterprise",
    name: "Small Business Support",
    department: "Enterprise Development",
    category: "Small Business",
    description:
      "Review business records before approaching the relevant scheme.",
    time: "Instant AI pre-check",
    icon: Building2,
    documents: [
      "Business details available",
      "Identity document available",
      "Financial supporting documents available",
    ],
  },
];

const CATEGORIES: Category[] = [
  "All",
  "Socio-Economic",
  "Agriculture",
  "Education",
  "Healthcare",
  "Small Business",
];

const INITIAL_APPLICATIONS: Application[] = [
  {
    id: "SKR-2026-9842",
    applicant: "Asha Verma",
    schemeId: "pension",
    scheme: "Pension Allocation",
    risk: "Low",
    confidence: 98.6,
    status: "Review ready",
    stage: 5,
    updatedAt: "2026-09-29T10:30:00.000Z",
  },
  {
    id: "SKR-2026-9843",
    applicant: "Ravi Kumar",
    schemeId: "land",
    scheme: "Land Revenue Records",
    risk: "Medium",
    confidence: 86.4,
    status: "Manual audit",
    stage: 3,
    updatedAt: "2026-09-29T10:31:00.000Z",
  },
  {
    id: "SKR-2026-9844",
    applicant: "Meera Das",
    schemeId: "ration",
    scheme: "Ration Card Renewal",
    risk: "Low",
    confidence: 97.2,
    status: "Review ready",
    stage: 5,
    updatedAt: "2026-09-29T10:32:00.000Z",
  },
  {
    id: "SKR-2026-9845",
    applicant: "Arun Rao",
    schemeId: "enterprise",
    scheme: "Small Business Support",
    risk: "High Anomaly",
    confidence: 62.8,
    status: "Manual audit",
    stage: 3,
    updatedAt: "2026-09-29T10:33:00.000Z",
  },
  {
    id: "SKR-2026-9846",
    applicant: "Fatima Ali",
    schemeId: "education",
    scheme: "Education Assistance",
    risk: "Low",
    confidence: 96.9,
    status: "Review ready",
    stage: 5,
    updatedAt: "2026-09-29T10:34:00.000Z",
  },
];

const PIPELINE_STAGES = [
  "Submitted",
  "OCR Parsing",
  "FraudGuard Audit",
  "Policy Match",
  "Certificate Preview",
];

const AGENTS: {
  name: string;
  description: string;
  icon: LucideIcon;
}[] = [
  {
    name: "Agent-OCR",
    description:
      "Text extraction and document checks for identity, income and land records.",
    icon: FileText,
  },
  {
    name: "Agent-FraudGuard",
    description:
      "Metadata anomalies, reference-hash checks and zero-trust validation.",
    icon: Fingerprint,
  },
  {
    name: "Agent-PolicyMatcher",
    description:
      "Versioned rule evaluation and evidence-based eligibility checks.",
    icon: ShieldCheck,
  },
  {
    name: "Agent-Router",
    description:
      "Department routing and exception dispatch to authorised officers.",
    icon: Building2,
  },
];

const LOG_EVENTS = [
  {
    agent: "Intake",
    event: "payload.parsed",
    confidence: null,
    summary: "Required envelope fields found; processing record created.",
    payload: { schema: "application.v1", documentCount: 3 },
  },
  {
    agent: "Agent-OCR",
    event: "document.fields_extracted",
    confidence: 98.4,
    summary: "Scenario document fields matched the expected schema.",
    payload: { extractedFields: 12, missingFields: 0 },
  },
  {
    agent: "Agent-FraudGuard",
    event: "audit.completed",
    confidence: 97.8,
    summary:
      "Scenario metadata checks passed. No biometric data was collected.",
    payload: { anomalyCount: 0, biometricSource: "not_connected" },
  },
  {
    agent: "Agent-PolicyMatcher",
    event: "policy.evaluated",
    confidence: 99.1,
    summary: "Configured scenario rules matched the supplied example evidence.",
    payload: { policyVersion: "scenario.v1", matchedRules: 4 },
  },
  {
    agent: "Agent-Router",
    event: "review.routed",
    confidence: 98.6,
    summary:
      "Recommendation prepared for officer review; no benefit was sanctioned.",
    payload: { destination: "department_review", recommendation: "approve" },
  },
  {
    agent: "Registry",
    event: "preview.ready",
    confidence: null,
    summary: "Unsigned processing-record preview is ready in the tracker.",
    payload: { signature: "not_issued", status: "review_ready" },
  },
];

let browserClient: SupabaseClient | null = null;

function getSupabase(): SupabaseClient | null {
  if (browserClient) return browserClient;

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!url || !key) return null;

browserClient = createClient(url, key, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  });

return browserClient;
}

function isOfficer(session: Session | null): boolean {
  const role: unknown = session?.user.app_metadata?.role;
  return role === "officer" || role === "admin";
}

function departmentOf(session: Session | null): string {
  const department: unknown = session?.user.app_metadata?.department;
  return typeof department === "string"
    ? department
    : isOfficer(session)
      ? "Department not assigned"
      : "Citizen access";
}

function formatTime(value: string): string {
  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "medium",
    timeZone: "Asia/Kolkata",
  }).format(new Date(value));
}

function makeId(prefix: string): string {
  return `${prefix}-${crypto.randomUUID()}`;
}

function createReference(): string {
  const suffix = crypto.randomUUID().replaceAll("-", "").slice(0, 8).toUpperCase();
  return `SKR-${new Date().getUTCFullYear()}-${suffix}`;
}

function errorText(error: unknown): string {
  return error instanceof Error
    ? error.message
    : "The request could not be completed. Please try again.";
}

/* -------------------------------------------------------------------------- */
/* Shared UI                                                                  */
/* -------------------------------------------------------------------------- */

function Button({
  children,
  variant = "primary",
  className = "",
  type = "button",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "quiet" | "danger";
}) {
  const variants = {
    primary:
      "border-[#1A365D] bg-[#1A365D] text-white hover:bg-[#0B192C]",
    secondary:
      "border-slate-300 bg-white text-[#1A365D] hover:bg-slate-50",
    quiet:
      "border-transparent bg-transparent text-[#1A365D] hover:bg-slate-100",
    danger: "border-red-700 bg-red-700 text-white hover:bg-red-800",
  };

return (
    <button
      type={type}
      className={`inline-flex min-h-11 items-center justify-center gap-2
        rounded border px-4 py-2 font-semibold transition-colors
        disabled:cursor-not-allowed disabled:opacity-50
        ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

function Badge({
  children,
  tone = "neutral",
}: {
  children: ReactNode;
  tone?: "neutral" | "green" | "amber" | "red";
}) {
  const colors = {
    neutral: "border-slate-300 bg-slate-50 text-slate-700",
    green: "border-green-300 bg-green-50 text-green-800",
    amber: "border-amber-300 bg-amber-50 text-amber-900",
    red: "border-red-300 bg-red-50 text-red-800",
  };

return (
    <span
      className={`inline-flex items-center gap-1.5 rounded border
        px-2 py-1 text-xs font-semibold ${colors[tone]}`}
    >
      {children}
    </span>
  );
}

function RiskBadge({ risk }: { risk: Risk }) {
  return (
    <Badge
      tone={risk === "Low" ? "green" : risk === "Medium" ? "amber" : "red"}
    >
      {risk === "High Anomaly" && (
        <AlertTriangle size={13} aria-hidden="true" />
      )}
      {risk}
    </Badge>
  );
}

function Chakra({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <circle cx="50" cy="50" r="44" stroke="currentColor" strokeWidth="4" />
      <circle cx="50" cy="50" r="7" fill="currentColor" />
      {Array.from({ length: 24 }, (_, index) => (
        <line
          key={index}
          x1="50"
          y1="43"
          x2="50"
          y2="7"
          stroke="currentColor"
          strokeWidth="1.5"
          transform={`rotate(${index * 15} 50 50)`}
        />
      ))}
    </svg>
  );
}

function SectionHeading({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow: string;
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div className="max-w-3xl">
        <p className="mb-2 text-xs font-bold uppercase tracking-[0.16em] text-slate-600">
          {eyebrow}
        </p>
        <h2 className="text-2xl font-bold tracking-tight text-[#0B192C] sm:text-3xl">
          {title}
        </h2>
        <p className="mt-2 leading-7 text-slate-600">{description}</p>
      </div>
      {action}
    </div>
  );
}

function Field({
  label,
  children,
  hint,
}: {
  label: string;
  children: ReactNode;
  hint?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-semibold text-slate-800">
        {label}
      </span>
      {children}
      {hint && (
        <span className="mt-1.5 block text-xs leading-5 text-slate-600">
          {hint}
        </span>
      )}
    </label>
  );
}

const INPUT =
  "min-h-11 w-full rounded border border-slate-400 bg-white px-3 py-2 text-slate-900";

function Modal({
  title,
  children,
  onClose,
  wide = false,
}: {
  title: string;
  children: ReactNode;
  onClose: () => void;
  wide?: boolean;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const titleId = useId();

useEffect(() => {
    const node = dialog.current;
    const previous = document.activeElement as HTMLElement | null;
    const oldOverflow = document.body.style.overflow;

node?.showModal();
    document.body.style.overflow = "hidden";

return () => {
      node?.close();
      document.body.style.overflow = oldOverflow;
      previous?.focus();
    };
  }, []);

return (
    <dialog
      ref={dialog}
      aria-labelledby={titleId}
      className={`m-auto max-h-[90dvh] w-[calc(100%-2rem)] overflow-auto
        rounded-md border border-slate-300 bg-white p-0 text-slate-900
        shadow-xl backdrop:bg-slate-950/60
        ${wide ? "max-w-3xl" : "max-w-lg"}`}
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onClick={(event) => {
        if (event.target !== event.currentTarget) return;
        const rect = event.currentTarget.getBoundingClientRect();
        if (
          event.clientX < rect.left ||
          event.clientX > rect.right ||
          event.clientY < rect.top ||
          event.clientY > rect.bottom
        ) {
          onClose();
        }
      }}
    >
      <div className="flex items-center justify-between gap-4 border-b p-5">
        <h2 id={titleId} className="text-xl font-bold text-[#1A365D]">
          {title}
        </h2>
        <Button
          variant="quiet"
          aria-label={`Close ${title}`}
          onClick={onClose}
          className="shrink-0 px-3"
        >
          <X size={20} aria-hidden="true" />
        </Button>
      </div>
      <div className="p-5 sm:p-6">{children}</div>
    </dialog>
  );
}

/* Safe, intentionally small Markdown renderer.
 * React escapes text; no raw HTML or untrusted links are rendered.
 */
function MarkdownText({ text }: { text: string }) {
  const inline = (line: string) =>
    line.split(/(\*\*[^*]+\*\*|`[^`]+`)/g).map((part, index) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return <strong key={index}>{part.slice(2, -2)}</strong>;
      }
      if (part.startsWith("`") && part.endsWith("`")) {
        return (
          <code key={index} className="rounded bg-slate-100 px-1 text-sm">
            {part.slice(1, -1)}
          </code>
        );
      }
      return <span key={index}>{part}</span>;
    });

const lines = text.split("\n");
  const blocks: ReactNode[] = [];

for (let i = 0; i < lines.length; i += 1) {
    const line = lines[i];
    if (!line.trim()) continue;

if (line.startsWith("- ")) {
      const items: string[] = [line.slice(2)];
      while (i + 1 < lines.length && lines[i + 1].startsWith("- ")) {
        i += 1;
        items.push(lines[i].slice(2));
      }
      blocks.push(
        <ul key={`list-${i}`} className="list-disc space-y-1 pl-5">
          {items.map((item, index) => (
            <li key={index}>{inline(item)}</li>
          ))}
        </ul>,
      );
    } else if (line.startsWith("### ")) {
      blocks.push(
        <h3 key={i} className="font-bold text-[#1A365D]">
          {inline(line.slice(4))}
        </h3>,
      );
    } else {
      blocks.push(<p key={i}>{inline(line)}</p>);
    }
  }

return <div className="space-y-3 leading-7">{blocks}</div>;
}

/* -------------------------------------------------------------------------- */
/* Supabase authentication                                                    */
/* -------------------------------------------------------------------------- */

function AuthDialog({
  client,
  onClose,
  onNotice,
}: {
  client: SupabaseClient | null;
  onClose: () => void;
  onNotice: (message: string) => void;
}) {
  const [mode, setMode] = useState<"citizen" | "officer">("citizen");
  const [method, setMethod] = useState<"login" | "signup" | "otp">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [token, setToken] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [failure, setFailure] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const alive = useRef(true);

useEffect(() => {
    alive.current = true;
    return () => {
      alive.current = false;
    };
  }, []);

useEffect(() => {
    if (cooldown <= 0) return;
    const timer = window.setTimeout(() => setCooldown((n) => n - 1), 1000);
    return () => window.clearTimeout(timer);
  }, [cooldown]);

async function finish(session: Session | null) {
    if (!session) return false;

if (mode === "officer" && !isOfficer(session)) {
      setFailure(true);
      setMessage(
        "Signed in with citizen access. This account has no officer role. " +
          "Selecting Officer Access does not grant additional permissions.",
      );
      return true;
    }

onNotice(
      isOfficer(session)
        ? "Officer session established."
        : "Citizen session established.",
    );
    onClose();
    return true;
  }

async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;

setMessage("");
    setFailure(false);

if (!client) {
      setFailure(true);
      setMessage(
        "Authentication is not configured. Set the public Supabase URL and key.",
      );
      return;
    }

setBusy(true);

try {
      const normalisedEmail = email.trim();

if (method === "login") {
        const { data, error } = await client.auth.signInWithPassword({
          email: normalisedEmail,
          password,
        });
        if (error) throw error;
        if (!alive.current) return;
        await finish(data.session);
      } else if (method === "signup") {
        if (mode === "officer") {
          throw new Error("Officer accounts must be provisioned by an administrator.");
        }

const { data, error } = await client.auth.signUp({
          email: normalisedEmail,
          password,
          options: {
            emailRedirectTo: window.location.origin + window.location.pathname,
          },
        });

if (error) throw error;
        if (!alive.current) return;

if (!(await finish(data.session))) {
          setMessage(
            "Check your email for confirmation instructions, if registration is available.",
          );
        }
      } else if (!otpSent) {
        if (cooldown > 0) return;

const { error } = await client.auth.signInWithOtp({
          email: normalisedEmail,
          options: {
            // Registration has its own explicit flow.
            shouldCreateUser: false,
            emailRedirectTo: window.location.origin + window.location.pathname,
          },
        });

if (error) throw error;
        if (!alive.current) return;

setOtpSent(true);
        setCooldown(60);
        setMessage("If the account is eligible, a sign-in code has been sent.");
      } else {
        const { data, error } = await client.auth.verifyOtp({
          email: normalisedEmail,
          token: token.trim(),
          type: "email",
        });

if (error) throw error;
        if (!alive.current) return;
        await finish(data.session);
      }
    } catch {
      if (alive.current) {
        setFailure(true);
        setMessage(
          "Authentication could not be completed. Check your details, code " +
            "and email confirmation, or try again later.",
        );
      }
    } finally {
      if (alive.current) setBusy(false);
    }
  }

function changeMethod(next: "login" | "signup" | "otp") {
    setMethod(next);
    setOtpSent(false);
    setToken("");
    setPassword("");
    setMessage("");
  }

return (
    <Modal title="Citizen / Officer Single Sign-On" onClose={onClose}>
      <div className="mb-5 flex items-start gap-3 rounded border bg-slate-50 p-4">
        <Lock className="mt-0.5 shrink-0 text-[#1A365D]" size={20} aria-hidden="true" />
        <p className="text-sm leading-6">
          Email authentication through Supabase. Officer permissions are assigned
          by an authorised administrator.
        </p>
      </div>

<form onSubmit={submit} className="space-y-5" aria-busy={busy}>
        <fieldset disabled={busy} className="space-y-4">
          <legend className="mb-2 text-sm font-semibold">Access mode</legend>
          <div className="grid gap-2 sm:grid-cols-2">
            {(["citizen", "officer"] as const).map((value) => (
              <label
                key={value}
                className={`flex min-h-12 cursor-pointer items-center gap-2
                  rounded border p-3 text-sm font-semibold
                  ${mode === value ? "border-[#1A365D] bg-blue-50" : "border-slate-300"}`}
              >
                <input
                  type="radio"
                  name="access-mode"
                  checked={mode === value}
                  onChange={() => {
                    setMode(value);
                    if (value === "officer" && method === "signup") {
                      changeMethod("login");
                    }
                    setMessage("");
                  }}
                />
                {value === "citizen" ? "Citizen Access" : "Officer / Admin Access"}
              </label>
            ))}
          </div>

<Field label="Sign-in method">
            <select
              className={INPUT}
              value={method}
              onChange={(event) =>
                changeMethod(event.target.value as "login" | "signup" | "otp")
              }
            >
              <option value="login">Email and password</option>
              <option value="otp">Email one-time code</option>
              {mode === "citizen" && <option value="signup">Create citizen account</option>}
            </select>
          </Field>

<Field label="Email address">
            <input
              className={INPUT}
              type="email"
              autoComplete="email"
              maxLength={254}
              required
              readOnly={otpSent}
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="name@example.com"
            />
          </Field>

{method !== "otp" && (
            <Field
              label="Password"
              hint={
                method === "signup"
                  ? "Use at least 12 characters. Project password policies also apply."
                  : undefined
              }
            >
              <input
                className={INPUT}
                type="password"
                required
                minLength={method === "signup" ? 12 : 1}
                maxLength={128}
                autoComplete={method === "signup" ? "new-password" : "current-password"}
                value={password}
                onChange={(event)

