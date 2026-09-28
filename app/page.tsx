'use client';

import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
  type ReactNode,
} from 'react';
import {
  Activity,
  ArrowRight,
  ArrowUpRight,
  Check,
  CheckCircle2,
  ChevronRight,
  Clock3,
  FileCheck2,
  FileText,
  Fingerprint,
  Globe2,
  Landmark,
  LayoutDashboard,
  LockKeyhole,
  MessageSquare,
  Network,
  Paperclip,
  Pause,
  Play,
  RefreshCw,
  Search,
  Send,
  ShieldCheck,
  Sparkles,
  Users,
  Wallet,
  X,
  Zap,
  type LucideIcon,
} from 'lucide-react';

/* -------------------------------------------------------------------------- */
/* Types and deterministic demo data                                          */
/* -------------------------------------------------------------------------- */

type TabId = 'services' | 'swarm' | 'tracker' | 'assistant' | 'admin';
type Tone = 'slate' | 'indigo' | 'emerald' | 'amber' | 'rose';
type ApplicationStatus = 'Approved' | 'In review' | 'Flagged' | 'Processing';

interface Application {
  id: string;
  citizen: string;
  initials: string;
  service: string;
  district: string;
  submittedAt: string;
  status: ApplicationStatus;
  risk: number;
}

interface Attachment {
  name: string;
  size: number;
}

interface ChatMessage {
  id: number;
  role: 'assistant' | 'user';
  text: string;
  attachment?: Attachment;
}

interface SwarmStep {
  agent: string;
  event: string;
  detail: string;
  duration: string;
}

const NAVIGATION: {
  id: TabId;
  label: string;
  shortLabel: string;
  icon: LucideIcon;
}[] = [
  {
    id: 'services',
    label: 'Citizen services',
    shortLabel: 'Services',
    icon: Landmark,
  },
  {
    id: 'swarm',
    label: 'Agent control room',
    shortLabel: 'Agent swarm',
    icon: Network,
  },
  {
    id: 'tracker',
    label: 'Track & verify',
    shortLabel: 'Tracker',
    icon: Fingerprint,
  },
  {
    id: 'assistant',
    label: 'Citizen assistant',
    shortLabel: 'Assistant',
    icon: MessageSquare,
  },
  {
    id: 'admin',
    label: 'Operations center',
    shortLabel: 'Operations',
    icon: LayoutDashboard,
  },
];

const TITLES: Record<TabId, { eyebrow: string; title: string; description: string }> = {
  services: {
    eyebrow: 'CITIZEN EXPERIENCE',
    title: 'Public services. Personal progress.',
    description:
      'A clearer path from application to outcome, with assistance at every step.',
  },
  swarm: {
    eyebrow: 'AUTONOMOUS ORCHESTRATION',
    title: 'The intelligence behind every service.',
    description:
      'Observe a simulated application moving through four specialized agents.',
  },
  tracker: {
    eyebrow: 'TRANSPARENCY & TRUST',
    title: 'Every milestone, accounted for.',
    description:
      'Track a sample application and inspect its browser-generated integrity receipt.',
  },
  assistant: {
    eyebrow: 'GUIDED CITIZEN SUPPORT',
    title: 'A little guidance. A lot less friction.',
    description:
      'Explore service guidance through a local, scripted assistant demonstration.',
  },
  admin: {
    eyebrow: 'ADMINISTRATIVE INTELLIGENCE',
    title: 'A national view. An actionable queue.',
    description:
      'Illustrative operations analytics and an interactive, session-only review workspace.',
  },
};

const SERVICES: {
  title: string;
  category: string;
  description: string;
  icon: LucideIcon;
  tag: string;
  prompt: string;
}[] = [
  {
    title: 'Identity & Aadhaar sync',
    category: 'IDENTITY SERVICES',
    description:
      'Understand identity-linking requirements and prepare for verification.',
    icon: Fingerprint,
    tag: 'Identity assistance',
    prompt: 'How do I prepare for Aadhaar and identity verification?',
  },
  {
    title: 'Welfare pension',
    category: 'SOCIAL PROTECTION',
    description:
      'Explore pension pathways and the documents an eligibility review may require.',
    icon: Wallet,
    tag: 'Eligibility guidance',
    prompt: 'Help me understand welfare pension eligibility and documents.',
  },
  {
    title: 'Fast-track ration verification',
    category: 'FOOD SECURITY',
    description:
      'Prepare household records for a clear, traceable ration verification process.',
    icon: FileCheck2,
    tag: 'Document readiness',
    prompt: 'Which documents should I prepare for ration verification?',
  },
  {
    title: 'AI scheme recommender',
    category: 'PERSONALIZED DISCOVERY',
    description:
      'Discover how an assisted eligibility journey could surface relevant schemes.',
    icon: Sparkles,
    tag: 'Assisted discovery',
    prompt: 'How can I find government schemes relevant to my household?',
  },
];

const AGENTS: {
  id: string;
  role: string;
  description: string;
  icon: LucideIcon;
  latency: string;
  success: string;
}[] = [
  {
    id: 'Agent-OCR',
    role: 'Document intelligence',
    description: 'Document parsing & text extraction',
    icon: FileText,
    latency: '184 ms',
    success: '99.2%',
  },
  {
    id: 'Agent-FraudGuard',
    role: 'Trust & anomaly detection',
    description: 'Simulated biometric & metadata checks',
    icon: ShieldCheck,
    latency: '92 ms',
    success: '99.8%',
  },
  {
    id: 'Agent-PolicyMatcher',
    role: 'Eligibility intelligence',
    description: 'Socio-economic policy matching',
    icon: Sparkles,
    latency: '216 ms',
    success: '98.6%',
  },
  {
    id: 'Agent-Router',
    role: 'Department orchestration',
    description: 'Grievance & application dispatch',
    icon: Network,
    latency: '38 ms',
    success: '99.9%',
  },
];

const SWARM_STEPS: SwarmStep[] = [
  {
    agent: 'Gateway',
    event: 'Application accepted',
    detail: 'A synthetic pension application entered the demonstration queue.',
    duration: '12 ms',
  },
  {
    agent: 'Agent-OCR',
    event: 'Document classified',
    detail: 'Sample document identified as an income certificate.',
    duration: '76 ms',
  },
  {
    agent: 'Agent-OCR',
    event: 'Fields extracted',
    detail: 'Six synthetic fields mapped into a normalized application schema.',
    duration: '108 ms',
  },
  {
    agent: 'Agent-FraudGuard',
    event: 'Metadata checks completed',
    detail: 'Fixture metadata passed. No real biometrics were collected or analyzed.',
    duration: '92 ms',
  },
  {
    agent: 'Agent-PolicyMatcher',
    event: 'Policy fixture evaluated',
    detail: 'Sample household attributes matched a fictional demonstration rule.',
    duration: '216 ms',
  },
  {
    agent: 'Agent-PolicyMatcher',
    event: 'Human approval required',
    detail: 'An eligibility suggestion was prepared; no benefit was allocated.',
    duration: '24 ms',
  },
  {
    agent: 'Agent-Router',
    event: 'Department selected',
    detail: 'The simulated submission was assigned to a social-welfare review queue.',
    duration: '38 ms',
  },
  {
    agent: 'Gateway',
    event: 'Audit event appended',
    detail: 'The local simulation completed. No external record was created.',
    duration: '16 ms',
  },
];

const INITIAL_APPLICATIONS: Application[] = [
  {
    id: 'SKR-2026-1042',
    citizen: 'Demo citizen 1042',
    initials: 'D1',
    service: 'Welfare pension',
    district: 'Lucknow',
    submittedAt: '2026-09-28T09:41:00Z',
    status: 'Approved',
    risk: 4,
  },
  {
    id: 'SKR-2026-1043',
    citizen: 'Demo citizen 1043',
    initials: 'D2',
    service: 'Ration verification',
    district: 'Jaipur',
    submittedAt: '2026-09-28T09:44:00Z',
    status: 'In review',
    risk: 18,
  },
  {
    id: 'SKR-2026-1044',
    citizen: 'Demo citizen 1044',
    initials: 'D3',
    service: 'Identity sync',
    district: 'Bengaluru',
    submittedAt: '2026-09-28T09:48:00Z',
    status: 'Flagged',
    risk: 76,
  },
  {
    id: 'SKR-2026-1045',
    citizen: 'Demo citizen 1045',
    initials: 'D4',
    service: 'Scheme discovery',
    district: 'Pune',
    submittedAt: '2026-09-28T09:52:00Z',
    status: 'Processing',
    risk: 9,
  },
  {
    id: 'SKR-2026-1046',
    citizen: 'Demo citizen 1046',
    initials: 'D5',
    service: 'Welfare pension',
    district: 'Guwahati',
    submittedAt: '2026-09-28T09:57:00Z',
    status: 'In review',
    risk: 24,
  },
  {
    id: 'SKR-2026-1047',
    citizen: 'Demo citizen 1047',
    initials: 'D6',
    service: 'Identity sync',
    district: 'Hyderabad',
    submittedAt: '2026-09-28T10:02:00Z',
    status: 'Approved',
    risk: 3,
  },
];

const QUICK_PROMPTS = [
  'Pension eligibility',
  'Ration documents',
  'Track my application',
];

const FOCUS =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2';

const PRIMARY_BUTTON =
  `inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-800 disabled:cursor-not-allowed disabled:opacity-50 motion-reduce:transition-none ${FOCUS}`;

const SECONDARY_BUTTON =
  `inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 motion-reduce:transition-none ${FOCUS}`;

const INPUT =
  `w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-400 focus:outline-none focus:ring-4 focus:ring-indigo-500/10`;

function statusTone(status: ApplicationStatus): Tone {
  if (status === 'Approved') return 'emerald';
  if (status === 'Flagged') return 'rose';
  if (status === 'In review') return 'amber';
  return 'indigo';
}

function formatAuditTime(value: string): string {
  const date = new Date(value);
  return `${date.toISOString().slice(11, 19)} UTC`;
}

function formatBytes(bytes: number): string {
  return bytes < 1024 * 1024
    ? `${Math.max(1, Math.round(bytes / 1024))} KB`
    : `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function assistantReply(text: string, attachment?: Attachment): string {
  if (attachment) {
    return (
      `“${attachment.name}” is attached as a local filename preview only. ` +
      'This demo has not uploaded, parsed, or verified the file.\n\n' +
      'For a real application, use the relevant official service portal, check its accepted document formats, ' +
      'and redact information that is not required. Never share an OTP or full Aadhaar number in chat.'
    );
  }

const normalized = text.toLowerCase();

if (/track|reference|status/.test(normalized)) {
    return (
      'Open Track & verify and enter SKR-2026-1042 to explore a sample audit timeline.\n\n' +
      'Only the six synthetic records in this session are searchable. ' +
      'The SHA-256 demonstration checks a local receipt; it is not a government-issued digital signature.'
    );
  }

if (/pension|welfare/.test(normalized)) {
    return (
      'Pension eligibility varies by scheme, state, age, income, and household circumstances.\n\n' +
      'Common document categories include proof of age, residence, identity, and any income evidence required by the scheme. ' +
      'Exact requirements must be confirmed on the relevant official portal.\n\n' +
      'This scripted demonstration cannot determine eligibility, submit an application, or allocate benefits.'
    );
  }

if (/ration|food/.test(normalized)) {
    return (
      'Ration verification requirements depend on your state or union territory and the type of request.\n\n' +
      'You may need household details, address evidence, identity documents, and an existing ration-card reference if applicable. ' +
      'Confirm the current checklist with the official food and civil supplies department.\n\n' +
      'Do not upload real identity documents into a demonstration environment.'
    );
  }

if (/aadhaar|identity|otp/.test(normalized)) {
    return (
      'For Aadhaar-related services, use UIDAI’s official website or an authorized service center and follow the applicable consent process.\n\n' +
      'Never disclose an OTP, biometric data, or your full Aadhaar number in this chat. ' +
      'Use masked identity documents where the receiving authority permits them.\n\n' +
      'Sarkar Seva is a prototype and is not connected to UIDAI.'
    );
  }

if (/scheme|household|recommend/.test(normalized)) {
    return (
      'A real scheme-discovery service would compare consented household information against current official eligibility rules.\n\n' +
      'Start with your state, the type of support you need, and the eligibility categories published by the relevant department. ' +
      'Check official scheme directories such as myScheme for current information.\n\n' +
      'This demonstration does not profile you or make eligibility decisions.'
    );
  }

return (
    'I can demonstrate guidance for identity services, pension eligibility, ration documents, and application tracking.\n\n' +
    'Choose a suggested prompt to explore a workflow. Responses here are scripted, not generated by a connected AI model, ' +
    'and should not be treated as an official determination.'
  );
}

/* -------------------------------------------------------------------------- */
/* Reusable interface primitives                                              */
/* -------------------------------------------------------------------------- */

function Badge({
  children,
  tone = 'slate',
  dot = false,
}: {
  children: ReactNode;
  tone?: Tone;
  dot?: boolean;
}) {
  const tones: Record<Tone, string> = {
    slate: 'border-slate-200 bg-slate-50 text-slate-600',
    indigo: 'border-indigo-200/70 bg-indigo-50 text-indigo-700',
    emerald: 'border-emerald-200/70 bg-emerald-50 text-emerald-700',
    amber: 'border-amber-200/70 bg-amber-50 text-amber-800',
    rose: 'border-rose-200/70 bg-rose-50 text-rose-700',
  };

return (
    <span
      className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold leading-none ${tones[tone]}`}
    >
      {dot && <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-current" />}
      {children}
    </span>
  );
}

function SectionTitle({
  eyebrow,
  title,
  aside,
}: {
  eyebrow?: string;
  title: string;
  aside?: ReactNode;
}) {
  return (
    <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
      <div>
        {eyebrow && (
          <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">
            {eyebrow}
          </p>
        )}
        <h2 className="text-lg font-semibold tracking-tight text-slate-900">{title}</h2>
      </div>
      {aside}
    </div>
  );
}

function Metric({
  label,
  value,
  note,
  icon: Icon,
  accent = false,
}: {
  label: string;
  value: string;
  note: string;
  icon: LucideIcon;
  accent?: boolean;
}) {
  return (
    <div
      className={`relative overflow-hidden rounded-2xl border p-5 ${
        accent
          ? 'border-indigo-200/70 bg-indigo-50/70'
          : 'border-slate-200/80 bg-white'
      }`}
    >
      <div className="mb-5 flex items-center justify-between">
        <span className="text-xs font-medium text-slate-500">{label}</span>
        <Icon aria-hidden="true" className="h-4 w-4 text-slate-400" />
      </div>
      <p className="text-3xl font-semibold tracking-tight text-slate-900">{value}</p>
      <p className="mt-2 text-xs leading-5 text-slate-500">{note}</p>
    </div>
  );
}

function IntegrityVerifier({ receipt }: { receipt: string }) {
  const [digest, setDigest] = useState('');
  const [state, setState] = useState<'idle' | 'checking' | 'verified' | 'error'>('idle');
  const [error, setError] = useState('');
  const alive = useRef(true);

async function hash(value: string): Promise<string> {
    if (!globalThis.crypto?.subtle) {
      throw new Error('SHA-256 requires a secure context such as HTTPS or localhost.');
    }

const result = await globalThis.crypto.subtle.digest(
      'SHA-256',
      new TextEncoder().encode(value),
    );

return Array.from(new Uint8Array(result))
      .map((byte) => byte.toString(16).padStart(2, '0'))
      .join('');
  }

useEffect(() => {
    alive.current = true;
    let cancelled = false;

setDigest('');
    setState('idle');
    setError('');

void hash(receipt)
      .then((value) => {
        if (!cancelled) setDigest(value);
      })
      .catch((caught: unknown) => {
        if (!cancelled) {
          setState('error');
          setError(caught instanceof Error ? caught.message : 'Could not generate a receipt hash.');
        }
      });

return () => {
      cancelled = true;
      alive.current = false;
    };
  }, [receipt]);

async function verify() {
    if (!digest || state === 'checking') return;

setState('checking');
    setError('');

try {
      const current = await hash(receipt);
      if (!alive.current) return;

if (current !== digest) {
        throw new Error('The local receipt does not match its initial hash.');
      }

setState('verified');
    } catch (caught: unknown) {
      if (!alive.current) return;
      setState('error');
      setError(caught instanceof Error ? caught.message : 'Receipt verification failed.');
    }
  }

return (
    <section className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white">
      <div className="border-b border-slate-100 p-5">
        <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-700">
          <LockKeyhole aria-hidden="true" className="h-5 w-5" />
        </div>
        <h2 className="font-semibold text-slate-900">Cryptographic receipt</h2>
        <p className="mt-2 text-xs leading-6 text-slate-500">
          A real SHA-256 calculation over a synthetic application receipt.
        </p>
      </div>

<div className="space-y-5 p-5">
        <div className="flex items-center justify-between text-xs">
          <span className="text-slate-500">Algorithm</span>
          <span className="font-mono font-semibold text-slate-700">SHA-256</span>
        </div>
        <div className="flex items-center justify-between text-xs">
          <span className="text-slate-500">Execution</span>
          <Badge>Browser · local</Badge>
        </div>

<div>
          <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-slate-500">
            Receipt fingerprint
          </p>
          <code className="block break-all rounded-xl border border-slate-200 bg-slate-50 p-3 font-mono text-[11px] leading-6 text-slate-600">
            {digest || (error ? 'Hash unavailable' : 'Generating local fingerprint…')}
          </code>
        </div>

<button
          type="button"
          className={`${PRIMARY_BUTTON} w-full`}
          onClick={() => void verify()}
          disabled={!digest || state === 'checking' || state === 'verified'}
        >
          <ShieldCheck aria-hidden="true" className="h-4 w-4" />
          {state === 'checking'
            ? 'Checking receipt…'
            : state === 'verified'
              ? 'Local integrity verified'
              : 'Verify local integrity'}
        </button>

<div aria-live="polite">
          {state === 'verified' && (
            <p className="text-xs leading-5 text-emerald-700">
              The receipt matches the hash generated when this panel opened.
            </p>
          )}
          {error && <p className="text-xs leading-5 text-rose-700">{error}</p>}
        </div>

<p className="border-t border-slate-100 pt-4 text-[11px] leading-5 text-slate-500">
          This is not a digital signature, identity check, or proof of government issuance.
          Both the receipt and its comparison hash are generated locally.
        </p>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/* Application                                                                */
/* -------------------------------------------------------------------------- */

export default function Page() {
  const [activeTab, setActiveTab] = useState<TabId>('services');
  const [applications, setApplications] = useState<Application[]>(INITIAL_APPLICATIONS);

const [simulation, setSimulation] = useState({ cursor: 0, running: true });

const [trackingInput, setTrackingInput] = useState('SKR-2026-1042');
  const [trackedId, setTrackedId] = useState<string | null>('SKR-2026-1042');
  const [trackingError, setTrackingError] = useState('');

const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 1,
      role: 'assistant',
      text:
        'Namaste. Let’s make public services easier to navigate.\n\n' +
        'I can walk you through sample document checklists, explain service pathways, ' +
        'or help you explore application tracking. What would you like to do?',
    },
  ]);
  const [draft, setDraft] = useState('');
  const [attachment, setAttachment] = useState<Attachment | undefined>();
  const [uploadError, setUploadError] = useState('');
  const [pendingReply, setPendingReply] = useState<{ id: number; text: string } | null>(null);

const messageId = useRef(2);
  const uploadInput = useRef<HTMLInputElement>(null);
  const chatViewport = useRef<HTMLDivElement>(null);

const [adminSearch, setAdminSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | ApplicationStatus>('All');
  const [reviewId, setReviewId] = useState<string | null>(null);
  const [adminNotice, setAdminNotice] = useState('');

const title = TITLES[activeTab];
  const trackedApplication = applications.find((item) => item.id === trackedId);
  const reviewApplication = applications.find((item) => item.id === reviewId);

const visibleApplications = applications.filter((item) => {
    const search = adminSearch.trim().toLowerCase();
    const matchesSearch =
      !search ||
      `${item.id} ${item.citizen} ${item.service} ${item.district}`
        .toLowerCase()
        .includes(search);

return matchesSearch && (statusFilter === 'All' || item.status === statusFilter);
  });

const approvedCount = applications.filter((item) => item.status === 'Approved').length;
  const reviewCount = applications.filter((item) => item.status === 'In review').length;
  const flaggedCount = applications.filter((item) => item.status === 'Flagged').length;

useEffect(() => {
    if (!simulation.running) return;

const interval = window.setInterval(() => {
      setSimulation((current) => {
        if (!current.running) return current;
        const cursor = Math.min(current.cursor + 1, SWARM_STEPS.length);
        return { cursor, running: cursor < SWARM_STEPS.length };
      });
    }, 1600);

return () => window.clearInterval(interval);
  }, [simulation.running]);

useEffect(() => {
    if (!pendingReply) return;

const timeout = window.setTimeout(() => {
      setMessages((current) => [
        ...current,
        { id: pendingReply.id, role: 'assistant', text: pendingReply.text },
      ]);
      setPendingReply(null);
    }, 950);

return () => window.clearTimeout(timeout);
  }, [pendingReply]);

useEffect(() => {
    if (activeTab !== 'assistant' || !chatViewport.current) return;
    chatViewport.current.scrollTop = chatViewport.current.scrollHeight;
  }, [messages, pendingReply, activeTab]);

function openAssistant(prompt?: string) {
    if (prompt) setDraft(prompt);
    setActiveTab('assistant');
  }

function trackApplication(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const reference = trackingInput.trim().toUpperCase();
    setTrackingInput(reference);

if (!/^SKR-2026-\d{4}$/.test(reference)) {
      setTrackingError('Use the format SKR-2026-XXXX, for example SKR-2026-1042.');
      setTrackedId(null);
      return;
    }

if (!applications.some((item) => item.id === reference)) {
      setTrackingError(
        'No sample record matches this reference. Try SKR-2026-1042 through SKR-2026-1047.',
      );
      setTrackedId(null);
      return;
    }

setTrackingError('');
    setTrackedId(reference);
  }

function sendMessage(event?: FormEvent<HTMLFormElement>, suggestedText?: string) {
    event?.preventDefault();
    if (pendingReply) return;

const text = (suggestedText ?? draft).trim();
    if ((!text && !attachment) || text.length > 2000) return;

const outgoingText = text || 'Please explain how to prepare this document.';
    const userMessage: ChatMessage = {
      id: messageId.current++,
      role: 'user',
      text: outgoingText,
      ...(attachment ? { attachment } : {}),
    };

setMessages((current) => [...current, userMessage]);
    setPendingReply({
      id: messageId.current++,
      text: assistantReply(outgoingText, attachment),
    });
    setDraft('');
    setAttachment(undefined);
    setUploadError('');
  }

function handleAttachment(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;

const allowedTypes = ['application/pdf', 'image/png', 'image/jpeg'];

if (!allowedTypes.includes(file.type)) {
      setUploadError('Choose a PDF, PNG, or JPEG file.');
      return;
    }

if (file.size === 0 || file.size > 10 * 1024 * 1024) {
      setUploadError('Choose a non-empty file no larger than 10 MB.');
      return;
    }

// Deliberately retain metadata only. No file bytes are read or uploaded.
    setAttachment({ name: file.name, size: file.size });
    setUploadError('');
  }

function updateReview(status: ApplicationStatus) {
    if (!reviewApplication) return;

setApplications((current) =>
      current.map((item) =>
        item.id === reviewApplication.id ? { ...item, status } : item,
      ),
    );
    setAdminNotice(
      `${reviewApplication.id} marked “${status}” in this browser session only.`,
    );
  }

function renderNavigation(mobile = false) {
    return NAVIGATION.map((item) => {
      const selected = activeTab === item.id;
      const Icon = item.icon;

return (
        <button
          key={item.id}
          type="button"
          aria-current={selected ? 'page' : undefined}
          onClick={() => setActiveTab(item.id)}
          className={
            mobile
              ? `inline-flex shrink-0 items-center gap-2 rounded-lg px-3 py-2.5 text-xs font-semibold transition ${FOCUS} ${
                  selected
                    ? 'bg-indigo-50 text-indigo-700'
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                }`
              : `group flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-[13px] font-medium transition ${FOCUS} ${
                  selected
                    ? 'bg-indigo-50 text-indigo-800'
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                }`
          }
        >
          <Icon
            aria-hidden="true"
            className={`h-[18px] w-[18px] shrink-0 ${
              selected ? 'text-indigo-600' : 'text-slate-400'
            }`}
          />
          <span>{mobile ? item.shortLabel : item.label}</span>
          {!mobile && selected && (
            <span aria-hidden="true" className="ml-auto h-1.5 w-1.5 rounded-full bg-indigo-600" />
          )}
        </button>
      );
    });
  }

function renderServices() {
    return (
      <div className="space-y-9">
        <section className="relative overflow-hidden rounded-3xl bg-slate-950 text-white">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-gradient-to-br from-indigo-900 via-indigo-950 to-slate-950"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-28 -top-40 h-[440px] w-[440px] rounded-full border border-white/10"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-10 -top-20 h-[300px] w-[300px] rounded-full border border-white/10"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute right-16 top-10 h-40 w-40 rounded-full bg-indigo-400/10 blur-3xl"
          />

<div className="relative grid gap-9 p-6 sm:p-9 xl:grid-cols-[1.5fr_1fr] xl:p-10">
            <div>
              <div className="mb-6 inline-flex flex-wrap items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-[10px] font-semibold">
                <span className="relative flex h-1.5 w-1.5">
                  <span
                    aria-hidden="true"
                    className="absolute h-full w-full animate-ping rounded-full bg-emerald-400 opacity-50 motion-reduce:animate-none"
                  />
                  <span className="relative h-1.5 w-1.5 rounded-full bg-emerald-400" />
                </span>
                <span className="text-emerald-300">AI Governance Active</span>
                <span className="text-indigo-300/60">/</span>
                <span className="text-indigo-200">Simulation</span>
              </div>

<h2 className="max-w-xl text-3xl font-semibold leading-[1.15] tracking-tight sm:text-4xl xl:text-[43px]">
                Less paperwork.
                <br />
                <span className="text-indigo-200">More possibility.</span>
              </h2>
              <p className="mt-5 max-w-md text-sm leading-7 text-indigo-100/70">
                One connected experience for essential services. Designed around
                citizens, with visible progress and accountable decisions.
              </p>

<div className="mt-7 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() =>
                    document.getElementById('service-directory')?.scrollIntoView({
                      behavior: 'auto',
                      block: 'start',
                    })
                  }
                  className={`inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-indigo-950 transition hover:bg-indigo-50 ${FOCUS}`}
                >
                  Explore services
                  <ArrowRight aria-hidden="true" className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('tracker')}
                  className={`inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/5 px-5 py-3 text-sm font-medium text-white transition hover:bg-white/10 ${FOCUS}`}
                >
                  Track application
                  <ChevronRight aria-hidden="true" className="h-4 w-4" />
                </button>
              </div>
            </div>

<div className="flex flex-col justify-end xl:pl-6">
              <div className="rounded-2xl border border-white/15 bg-white/5 p-5 backdrop-blur-sm">
                <div className="mb-5 flex items-center justify-between">
                  <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-indigo-200">
                    A connected service journey
                  </span>
                  <Network aria-hidden="true" className="h-4 w-4 text-indigo-300" />
                </div>

{[
                  ['01', 'Prepare with confidence', 'Understand the document checklist'],
                  ['02', 'Follow every checkpoint', 'See a transparent verification trail'],
                  ['03', 'Keep a verifiable receipt', 'Inspect a local integrity demonstration'],
                ].map(([number, heading, detail], index) => (
                  <div key={number} className={`flex gap-3 ${index > 0 ? 'mt-5' : ''}`}>
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-indigo-300/25 font-mono text-[10px] text-indigo-200">
                      {number}
                    </span>
                    <div>
                      <p className="text-xs font-semibold text-white">{heading}</p>
                      <p className="mt-1 text-[11px] leading-5 text-indigo-200/65">{detail}</p>
                    </div>
                  </div>
                ))}
              </div>
              <p className="mt-3 text-[10px] leading-5 text-indigo-200/55">
                Independent prototype. Not an official government service.
              </p>
            </div>
          </div>

<div className="relative grid grid-cols-3 border-t border-white/10 bg-slate-950/20">
            {[
              ['04', 'Specialized agents'],
              ['06', 'Sample applications'],
              ['100%', 'Synthetic records'],
            ].map(([value, label], index) => (
              <div
                key={label}
                className={`px-4 py-5 sm:px-9 ${index > 0 ? 'border-l border-white/10' : ''}`}
              >
                <p className="text-xl font-semibold tracking-tight">{value}</p>
                <p className="mt-1 text-[10px] text-indigo-200/65 sm:text-xs">{label}</p>
              </div>
            ))}
          </div>
        </section>

<section id="service-directory" className="scroll-mt-28">
          <SectionTitle
            eyebrow="ESSENTIAL SERVICES"
            title="What would you like to do?"
            aside={<span className="text-xs text-slate-500">4 curated pathways</span>}
          />

<div className="grid gap-4 md:grid-cols-2">
            {SERVICES.map((service, index) => {
              const Icon = service.icon;
              return (
                <button
                  key={service.title}
                  type="button"
                  onClick={() => openAssistant(service.prompt)}
                  className={`group relative flex min-h-[220px] flex-col rounded-2xl border border-slate-200/80 bg-white p-6 text-left transition duration-200 hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-[0_12px_30px_-18px_rgba(49,46,129,0.35)] motion-reduce:transform-none motion-reduce:transition-none ${FOCUS}`}
                >
                  <div className="mb-5 flex w-full items-start justify-between">
                    <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl border border-indigo-100 bg-gradient-to-br from-white to-indigo-50 text-indigo-700">
                      <Icon aria-hidden="true" className="h-6 w-6" strokeWidth={1.6} />
                      <span
                        aria-hidden="true"
                        className="absolute -bottom-1 -right-1 h-3 w-3 rounded-full border-[3px] border-white bg-indigo-200"
                      />
                    </div>
                    <span className="font-mono text-[11px] text-slate-400">
                      0{index + 1}
                    </span>
                  </div>

<span className="text-[9px] font-bold tracking-[0.16em] text-slate-400">
                    {service.category}
                  </span>
                  <h3 className="mt-2 text-base font-semibold tracking-tight text-slate-900">
                    {service.title}
                  </h3>
                  <p className="mt-2 max-w-sm text-xs leading-6 text-slate-500">
                    {service.description}
                  </p>

<div className="mt-5 flex w-full items-center justify-between border-t border-slate-100 pt-4">
                    <span className="text-[11px] font-medium text-slate-500">{service.tag}</span>
                    <span className="flex items-center gap-2 text-xs font-semibold text-indigo-700">
                      Get started
                      <ArrowUpRight
                        aria-hidden="true"
                        className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 motion-reduce:transform-none"
                      />
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </section>

<section className="flex flex-col items-start justify-between gap-5 rounded-2xl border border-slate-200/80 bg-white p-6 sm:flex-row sm:items-center">
          <div className="flex gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-600">
              <MessageSquare aria-hidden="true" className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-slate-900">Not sure where to begin?</h2>
              <p className="mt-1 text-xs leading-6 text-slate-500">
                Let the citizen assistant explain your next step.
              </p>
            </div>
          </div>
          <button type="button" onClick={() => openAssistant()} className={SECONDARY_BUTTON}>
            Talk to the assistant
            <ArrowRight aria-hidden="true" className="h-4 w-4" />
          </button>
        </section>
      </div>
    );
  }

function renderSwarm() {
    const completed = simulation.cursor === SWARM_STEPS.length;
    const currentAgent = SWARM_STEPS[simulation.cursor]?.agent;

const payload = {
      environment: 'local_simulation',
      reference: 'SKR-2026-1042',
      document: 'income_certificate.sample.pdf',
      orchestration: {
        state: completed ? 'completed' : simulation.running ? 'running' : 'paused',
        completed_steps: simulation.cursor,
        total_steps: SWARM_STEPS.length,
      },
      extraction:
        simulation.cursor >= 3
          ? { fields: 6, confidence: 0.992, source: 'synthetic_fixture' }
          : null,
      trust:
        simulation.cursor >= 4
          ? { metadata: 'fixture_passed', biometric_check: 'not_performed' }
          : null,
      policy:
        simulation.cursor >= 6
          ? { rule: 'DEMO-PENSION-01', outcome: 'human_review_required' }
          : null,
      dispatch:
        simulation.cursor >= 7
          ? { queue: 'social_welfare_demo', external_write: false }
          : null,
    };

return (
      <div className="space-y-6">
        <div className="flex flex-col justify-between gap-4 rounded-2xl border border-slate-200/80 bg-white p-5 sm:flex-row sm:items-center">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <Activity aria-hidden="true" className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900">Swarm orchestration</p>
              <p className="mt-1 text-xs text-slate-500">
                4 agents ready · browser simulation · no external execution
              </p>
            </div>
          </div>
          <Badge tone={simulation.running ? 'emerald' : 'slate'} dot>
            {completed ? 'Run complete' : simulation.running ? 'Simulation running' : 'Paused'}
          </Badge>
        </div>

<div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {AGENTS.map((agent) => {
            const Icon = agent.icon;
            const working = simulation.running && currentAgent === agent.id;
            const hasRun = SWARM_STEPS.slice(0, simulation.cursor).some(
              (step) => step.agent === agent.id,
            );

return (
              <section
                key={agent.id}
                className={`rounded-2xl border bg-white p-5 transition duration-300 ${
                  working
                    ? 'border-indigo-300 shadow-[0_0_0_3px_rgba(99,102,241,0.06)]'
                    : 'border-slate-200/80'
                }`}
              >
                <div className="mb-6 flex items-center justify-between">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                      working ? 'bg-indigo-600 text-white' : 'bg-slate-50 text-slate-600'
                    }`}
                  >
                    <Icon aria-hidden="true" className="h-5 w-5" strokeWidth={1.7} />
                  </div>
                  <Badge tone="emerald" dot>
                    {working ? 'Working' : hasRun ? 'Ready' : 'Online'}
                  </Badge>
                </div>
                <h2 className="break-words font-mono text-xs font-semibold text-slate-900">
                  {agent.id}
                </h2>
                <p className="mt-2 text-[11px] font-medium text-slate-500">{agent.role}</p>
                <p className="mt-3 min-h-[40px] text-xs leading-5 text-slate-400">
                  {agent.description}
                </p>
                <div className="mt-5 grid grid-cols-2 gap-2 border-t border-slate-100 pt-4">
                  <div>
                    <p className="font-mono text-sm font-semibold text-slate-800">{agent.latency}</p>
                    <p className="mt-1 text-[9px] text-slate-400">Sample latency</p>
                  </div>
                  <div className="text-right">
                    <p className="font-mono text-sm font-semibold text-slate-800">{agent.success}</p>
                    <p className="mt-1 text-[9px] text-slate-400">Illustrative success</p>
                  </div>
                </div>
              </section>
            );
          })}
        </div>

<section className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-950">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 px-5 py-4">
            <div className="flex items-center gap-3">
              <div aria-hidden="true" className="flex gap-1.5">
                <span className="h-2 w-2 rounded-full bg-slate-600" />
                <span className="h-2 w-2 rounded-full bg-slate-600" />
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
              </div>
              <h2 className="font-mono text-xs text-slate-200">orchestrator / execution trace</h2>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() =>
                  setSimulation((current) => ({
                    cursor: current.cursor === SWARM_STEPS.length ? 0 : current.cursor,
                    running: !current.running,
                  }))
                }
                className={`inline-flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-[11px] font-medium text-slate-200 hover:bg-slate-800 ${FOCUS}`}
              >
                {simulation.running ? (
                  <Pause aria-hidden="true" className="h-3 w-3" />
                ) : (
                  <Play aria-hidden="true" className="h-3 w-3" />
                )}
                {simulation.running ? 'Pause' : completed ? 'Run again' : 'Resume'}
              </button>
              <button
                type="button"
                aria-label="Restart simulation"
                onClick={() => setSimulation({ cursor: 0, running: true })}
                className={`rounded-lg border border-slate-700 p-2 text-slate-300 hover:bg-slate-800 ${FOCUS}`}
              >
                <RefreshCw aria-hidden="true" className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

<div className="grid xl:grid-cols-[1.2fr_1fr]">
            <div className="min-w-0 border-b border-white/10 xl:border-b-0 xl:border-r">
              <div className="flex items-center justify-between gap-2 px-5 py-4">
                <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500">
                  Execution events
                </p>
                <span className="font-mono text-[10px] text-slate-500">
                  {simulation.cursor}/{SWARM_STEPS.length} steps
                </span>
              </div>

<div
                role="log"
                aria-label="Simulated agent execution events"
                aria-live="off"
                tabIndex={0}
                className={`h-[390px] overflow-y-auto px-5 pb-5 ${FOCUS}`}
              >
                {simulation.cursor === 0 && (
                  <div className="flex items-center gap-3 py-8 font-mono text-xs text-slate-400">
                    <Clock3 aria-hidden="true" className="h-4 w-4" />
                    Waiting for the first orchestration event…
                  </div>
                )}

{SWARM_STEPS.slice(0, simulation.cursor).map((step, index) => (
                  <div key={`${step.agent}-${step.event}`} className="flex gap-3 py-3">
                    <span className="mt-1 font-mono text-[10px] text-slate-600">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                        <span className="font-mono text-[11px] font-medium text-indigo-300">
                          {step.agent}
                        </span>
                        <span className="font-mono text-[9px] text-slate-600">
                          T+{((index + 1) * 1.6).toFixed(1)}s
                        </span>
                        <span className="ml-auto font-mono text-[9px] text-emerald-400">
                          {step.duration}
                        </span>
                      </div>
                      <p className="mt-1.5 text-xs font-medium text-slate-200">{step.event}</p>
                      <p className="mt-1 text-[11px] leading-5 text-slate-500">{step.detail}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

<div className="min-w-0">
              <div className="flex items-center justify-between px-5 py-4">
                <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500">
                  Structured payload
                </p>
                <span className="rounded border border-slate-700 px-1.5 py-0.5 font-mono text-[9px] text-slate-400">
                  JSON
                </span>
              </div>
              <pre
                tabIndex={0}
                aria-label="Current synthetic application payload"
                className={`h-[390px] overflow-auto px-5 pb-5 font-mono text-[11px] leading-[1.9] text-indigo-200 ${FOCUS}`}
              >
                <code>{JSON.stringify(payload, null, 2)}</code>
              </pre>
            </div>
          </div>

<div className="border-t border-white/10 px-5 py-4">
            <div className="mb-2 flex justify-between text-[10px] text-slate-500">
              <span>Sample application pipeline</span>
              <span>{Math.round((simulation.cursor / SWARM_STEPS.length) * 100)}%</span>
            </div>
            <div
              role="progressbar"
              aria-label="Simulation progress"
              aria-valuemin={0}
              aria-valuemax={SWARM_STEPS.length}
              aria-valuenow={simulation.cursor}
              className="h-1 overflow-hidden rounded-full bg-slate-800"
            >
              <div
                className="h-full rounded-full bg-indigo-400 transition-all duration-500 motion-reduce:transition-none"
                style={{ width: `${(simulation.cursor / SWARM_STEPS.length) * 100}%` }}
              />
            </div>
          </div>
        </section>

<div className="flex gap-3 rounded-xl border border-indigo-100 bg-indigo-50/60 px-4 py-3">
          <ShieldCheck aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-indigo-600" />
          <p className="text-xs leading-6 text-indigo-900/70">
            Events show concise operational decision summaries, not private model reasoning.
            Agent metrics and timings are illustrative. A production service must enforce consent,
            server-side authorization, policy validation, and human oversight.
          </p>
        </div>
      </div>
    );
  }

function renderTracker() {
    const app = trackedApplication;
    const completedStages = app
      ? app.status === 'Approved'
        ? 5
        : app.status === 'In review'
          ? 3
          : app.status === 'Flagged'
            ? 2
            : 1
      : 0;

const stageDefinitions = [
      ['Application received', 'Gateway accepted the synthetic application.'],
      ['Document extraction', 'The sample document fields were normalized.'],
      ['Trust & policy checks', 'Fixture checks completed; no real identity was verified.'],
      ['Department review', 'An authorized official would assess the recommendation.'],
      ['Decision recorded', 'A sample decision is reflected in the local application record.'],
    ];

const receipt = app
      ? JSON.stringify({
          schema: 'sarkar-seva.demo-receipt.v1',
          reference: app.id,
          service: app.service,
          submitted_at: app.submittedAt,
          status: app.status,
          synthetic: true,
        })
      : '';

return (
      <div className="space-y-6">
        <section className="rounded-2xl border border-slate-200/80 bg-white p-5 sm:p-7">
          <form onSubmit={trackApplication}>
            <label htmlFor="reference" className="mb-3 block text-sm font-semibold text-slate-900">
              Your application reference
            </label>
            <div className="flex flex-col gap-3 sm:flex-row">
              <div className="relative flex-1">
                <Search
                  aria-hidden="true"
                  className="absolute left-4 top-3.5 h-4 w-4 text-slate-400"
                />
                <input
                  id="reference"
                  value={trackingInput}
                  onChange={(event) => setTrackingInput(event.target.value)}
                  maxLength={20}
                  autoComplete="off"
                  spellCheck={false}
                  aria-invalid={Boolean(trackingError)}
                  aria-describedby={trackingError ? 'tracking-error' : 'tracking-hint'}
                  placeholder="SKR-2026-1042"
                  className={`${INPUT} pl-11 font-mono uppercase`}
                />
              </div>
              <button type="submit" className={PRIMARY_BUTTON}>
                Track application
                <ArrowRight aria-hidden="true" className="h-4 w-4" />
              </button>
            </div>
            <p id="tracking-hint" className="mt-3 text-xs leading-6 text-slate-500">
              Demo references: SKR-2026-1042 through SKR-2026-1047. All timestamps below
              belong to synthetic audit fixtures.
            </p>
            {trackingError && (
              <p id="tracking-error" role="alert" className="mt-3 text-sm text-rose-700">
                {trackingError}
              </p>
            )}
          </form>
        </section>

{app ? (
          <div className="grid items-start gap-6 xl:grid-cols-[1.65fr_1fr]">
            <section className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white">
              <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-100 p-6">
                <div>
                  <p className="font-mono text-[11px] font-medium text-indigo-600">{app.id}</p>
                  <h2 className="mt-2 text-xl font-semibold tracking-tight text-slate-900">
                    {app.service}
                  </h2>
                  <p className="mt-2 text-xs text-slate-500">
                    {app.district} · Submitted 28 September 2026
                  </p>
                </div>
                <Badge tone={statusTone(app.status)} dot>{app.status}</Badge>
              </div>

<div className="p-6">
                <div className="mb-7 flex items-center justify-between">
                  <h3 className="text-xs font-semibold text-slate-700">Verification timeline</h3>
                  <span className="font-mono text-[10px] text-slate-400">
                    {completedStages}/5 COMPLETE
                  </span>
                </div>

<ol>
                  {stageDefinitions.map(([heading, detail], index) => {
                    const done = index < completedStages;
                    const current = index === completedStages;
                    const flagged = current && app.status === 'Flagged';
                    const auditTime = new Date(
                      new Date(app.submittedAt).getTime() + index * 90_000,
                    ).toISOString();

return (
                      <li key={heading} className="relative flex gap-4 pb-8 last:pb-0">
                        {index < stageDefinitions.length - 1 && (
                          <span
                            aria-hidden="true"
                            className={`absolute bottom-0 left-[15px] top-8 w-px ${
                              done ? 'bg-indigo-200' : 'bg-slate-200'
                            }`}
                          />
                        )}

<span
                          className={`relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border ${
                            done
                              ? 'border-indigo-600 bg-indigo-600 text-white'
                              : flagged
                                ? 'border-rose-200 bg-rose-50 text-rose-600'
                                : current
                                  ? 'border-indigo-300 bg-indigo-50 text-indigo-700'
                                  : 'border-slate-200 bg-white text-slate-300'
                          }`}
                        >
                          {done ? (
                            <Check aria-hidden="true" className="h-4 w-4" />
                          ) : (
                            <span className="text-[11px] font-semibold">{index + 1}</span>
                          )}
                        </span>

<div className="min-w-0 flex-1 pt-1">
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <h4
                              className={`text-sm font-semibold ${
                                done || current ? 'text-slate-900' : 'text-slate-400'
                              }`}
                            >
                              {heading}
                            </h4>
                            {done && (
                              <time dateTime={auditTime} className="font-mono text-[10px] text-slate-400">
                                {formatAuditTime(auditTime)}
                              </time>
                            )}
                          </div>
                          <p className="mt-1.5 text-xs leading-6 text-slate-500">{detail}</p>
                          {current && (
                            <div className="mt-2">
                              <Badge tone={flagged ? 'rose' : 'indigo'}>
                                {flagged ? 'Attention required' : 'Next checkpoint'}
                              </Badge>
                            </div>
                          )}
                        </div>
                      </li>
                    );
                  })}
                </ol>
              </div>

<div className="flex items-start gap-3 border-t border-slate-100 bg-slate-50/70 p-5">
                <ShieldCheck aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-slate-500" />
                <p className="text-[11px] leading-6 text-slate-500">
                  This timeline is sample data, not an official audit record. Operations-center
                  changes affect this session only; milestone timestamps remain illustrative.
                </p>
              </div>
            </section>

<IntegrityVerifier key={`${app.id}-${app.status}`} receipt={receipt} />
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">
            <Search aria-hidden="true" className="mx-auto h-8 w-8 text-slate-300" />
            <h2 className="mt-4 font-semibold text-slate-900">No matching sample application</h2>
            <p className="mt-2 text-sm text-slate-500">
              Check the reference format or use one of the demo IDs above.
            </p>
          </div>
        )}
      </div>
    );
  }

function renderAssistant() {
    return (
      <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_280px]">
        <section className="flex h-[720px] max-h-[85dvh] min-h-[520px] flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white">
          <div className="flex items-center justify-between gap-3 border-b border-slate-100 px-5 py-4">
            <div className="flex items-center gap-3">
              <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-700 text-white">
                <Sparkles aria-hidden="true" className="h-5 w-5" />
                <span
                  aria-hidden="true"
                  className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-white bg-emerald-500"
                />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-slate-900">Seva Assistant</h2>
                <p className="mt-1 text-[10px] text-slate-500">Guidance, one step at a time</p>
              </div>
            </div>
            <Badge tone="indigo">Scripted demo</Badge>
          </div>

<div className="border-b border-slate-100 bg-slate-50/80 px-5 py-2.5">
            <p className="flex items-center gap-2 text-[10px] leading-5 text-slate-500">
              <LockKeyhole aria-hidden="true" className="h-3 w-3 shrink-0" />
              Local session only. No AI API, upload endpoint, or persistent storage.
            </p>
          </div>

<div
            ref={chatViewport}
            role="log"
            aria-label="Citizen assistant conversation"
            aria-live="polite"
            aria-relevant="additions"
            tabIndex={0}
            className={`min-h-0 flex-1 space-y-6 overflow-y-auto bg-gradient-to-b from-slate-50/60 to-white p-5 sm:p-6 ${FOCUS}`}
          >
            <div className="flex items-center justify-center gap-3">
              <span className="h-px w-10 bg-slate-200" />
              <span className="text-[9px] font-semibold uppercase tracking-wider text-slate-400">
                Demonstration conversation
              </span>
              <span className="h-px w-10 bg-slate-200" />
            </div>

{messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {message.role === 'assistant' && (
                  <div className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-indigo-100 bg-white text-indigo-600">
                    <Sparkles aria-hidden="true" className="h-3.5 w-3.5" />
                  </div>
                )}

<div className="max-w-[88%] sm:max-w-[80%]">
                  <p
                    className={`mb-1.5 text-[10px] font-medium text-slate-400 ${
                      message.role === 'user' ? 'text-right' : ''
                    }`}
                  >
                    {message.role === 'user' ? 'You' : 'Seva Assistant'}
                  </p>
                  <div
                    className={`rounded-2xl px-4 py-3.5 text-sm leading-7 ${
                      message.role === 'user'
                        ? 'rounded-tr-md bg-indigo-700 text-white'
                        : 'rounded-tl-md border border-slate-200/80 bg-white text-slate-600 shadow-sm'
                    }`}
                  >
                    {message.attachment && (
                      <div className="mb-3 flex items-center gap-3 rounded-xl border border-white/20 bg-white/10 p-3">
                        <FileText aria-hidden="true" className="h-5 w-5 shrink-0" />
                        <div className="min-w-0">
                          <p className="truncate text-xs font-medium">{message.attachment.name}</p>
                          <p className="text-[10px] text-indigo-200">
                            {formatBytes(message.attachment.size)} · metadata preview
                          </p>
                        </div>
                      </div>
                    )}
                    <p className="whitespace-pre-wrap break-words">{message.text}</p>
                  </div>
                </div>
              </div>
            ))}

{pendingReply && (
              <div className="flex items-center gap-3 text-xs text-slate-400" role="status">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg border border-indigo-100 bg-white text-indigo-600">
                  <Sparkles aria-hidden="true" className="h-3.5 w-3.5" />
                </div>
                <span className="flex gap-1" aria-hidden="true">
                  <span className="h-1 w-1 animate-pulse rounded-full bg-indigo-400 motion-reduce:animate-none" />
                  <span className="h-1 w-1 animate-pulse rounded-full bg-indigo-400 motion-reduce:animate-none" />
                  <span className="h-1 w-1 animate-pulse rounded-full bg-indigo-400 motion-reduce:animate-none" />
                </span>
                Preparing sample guidance…
              </div>
            )}
          </div>

<div className="border-t border-slate-100 bg-white p-4">
            <div className="mb-3 flex flex-wrap gap-2">
              {QUICK_PROMPTS.map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  disabled={Boolean(pendingReply)}
                  onClick={() => sendMessage(undefined, prompt)}
                  className={`rounded-full border border-slate-200 px-3 py-1.5 text-[10px] font-medium text-slate-600 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700 disabled:cursor-not-allowed disabled:opacity-50 ${FOCUS}`}
                >
                  {prompt}
                </button>
              ))}
            </div>

{attachment && (
              <div className="mb-3 flex items-center gap-3 rounded-xl border border-indigo-100 bg-indigo-50/50 p-3">
                <FileText aria-hidden="true" className="h-5 w-5 shrink-0 text-indigo-600" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-medium text-slate-700">{attachment.name}</p>
                  <p className="mt-1 text-[10px] text-slate-500">
                    {formatBytes(attachment.size)} · local preview only
                  </p>
                </div>
                <button
                  type="button"
                  aria-label="Remove attachment"
                  onClick={() => setAttachment(undefined)}
                  className={`rounded-lg p-1 text-slate-400 hover:text-slate-700 ${FOCUS}`}
                >
                  <X aria-hidden="true" className="h-4 w-4" />
                </button>
              </div>
            )}

{uploadError && (
              <p role="alert" className="mb-3 text-xs text-rose-700">{uploadError}</p>
            )}

<form onSubmit={sendMessage}>
              <div className="flex items-end gap-2 rounded-2xl border border-slate-200 bg-slate-50 p-2 transition focus-within:border-indigo-300 focus-within:ring-4 focus-within:ring-indigo-500/5">
                <input
                  ref={uploadInput}
                  type="file"
                  accept="application/pdf,image/png,image/jpeg"
                  onChange={handleAttachment}
                  className="hidden"
                  tabIndex={-1}
                  aria-label="Choose a sample attachment"
                />
                <button
                  type="button"
                  aria-label="Attach a sample PDF or image, up to 10 MB"
                  disabled={Boolean(pendingReply)}
                  onClick={() => uploadInput.current?.click()}
                  className={`rounded-xl p-2.5 text-slate-400 hover:bg-white hover:text-indigo-600 disabled:opacity-40 ${FOCUS}`}
                >
                  <Paperclip aria-hidden="true" className="h-4 w-4" />
                </button>

<label htmlFor="chat-message" className="sr-only">Message the assistant</label>
                <textarea
                  id="chat-message"
                  value={draft}
                  onChange={(event) => setDraft(event.target.value)}
                  onKeyDown={(event) => {
                    if (
                      event.key === 'Enter' &&
                      !event.shiftKey &&
                      !event.nativeEvent.isComposing
                    ) {
                      event.preventDefault();
                      sendMessage();
                    }
                  }}
                  rows={2}
                  maxLength={2000}
                  placeholder="Ask about a service or document…"
                  aria-describedby="chat-disclaimer"
                  className="max-h-32 min-h-[48px] min-w-0 flex-1 resize-none bg-transparent py-2 text-sm leading-6 text-slate-700 outline-none placeholder:text-slate-400"
                />

<button
                  type="submit"
                  aria-label="Send message"
                  disabled={Boolean(pendingReply) || (!draft.trim() && !attachment)}
                  className={`rounded-xl bg-indigo-700 p-3 text-white transition hover:bg-indigo-800 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400 ${FOCUS}`}
                >
                  <Send aria-hidden="true" className="h-4 w-4" />
                </button>
              </div>
              <div className="mt-2 flex items-start justify-between gap-4">
                <p id="chat-disclaimer" className="text-[9px] leading-5 text-slate-400">
                  Do not share real identity documents, Aadhaar numbers, biometrics, or OTPs.
                </p>
                <span className="shrink-0 text-[9px] leading-5 text-slate-400">
                  {draft.length}/2000
                </span>
              </div>
            </form>
          </div>
        </section>

<aside className="space-y-5">
          <section className="rounded-2xl border border-slate-200/80 bg-white p-5">
            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-400">
              DESIGNED TO HELP
            </p>
            <h2 className="mt-3 text-base font-semibold tracking-tight text-slate-900">
              Clear answers.
              <br />
              Informed next steps.
            </h2>

<div className="mt-6 space-y-5">
              {[
                { icon: FileCheck2, title: 'Document readiness', text: 'Understand typical document categories.' },
                { icon: Sparkles, title: 'Service discovery', text: 'Explore sample eligibility pathways.' },
                { icon: Fingerprint, title: 'Visible progress', text: 'Navigate an application audit trail.' },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.title} className="flex gap-3">
                    <Icon aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-indigo-600" />
                    <div>
                      <p className="text-xs font-semibold text-slate-700">{item.title}</p>
                      <p className="mt-1 text-[11px] leading-5 text-slate-500">{item.text}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

<section className="rounded-2xl border border-indigo-100 bg-indigo-50/70 p-5">
            <ShieldCheck aria-hidden="true" className="h-6 w-6 text-indigo-600" />
            <h2 className="mt-4 text-sm font-semibold text-indigo-950">You remain in control.</h2>
            <p className="mt-2 text-xs leading-6 text-indigo-900/65">
              This prototype cannot submit applications, verify identity, or issue official advice.
              Confirm requirements with the responsible department.
            </p>
            <button
              type="button"
              onClick={() => setActiveTab('tracker')}
              className={`mt-5 inline-flex items-center gap-2 rounded text-xs font-semibold text-indigo-700 ${FOCUS}`}
            >
              Explore the sample tracker
              <ArrowRight aria-hidden="true" className="h-3.5 w-3.5" />
            </button>
          </section>
        </aside>
      </div>
    );
  }

function renderAdmin() {
    const activity = [42, 56, 48, 68, 60, 82, 72, 91, 76, 65, 84, 95];

return (
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Badge tone="indigo">Demo administrator</Badge>
            <span className="text-[11px] text-slate-400">No authentication or production access</span>
          </div>
          <span className="flex items-center gap-2 text-xs text-slate-500">
            <Clock3 aria-hidden="true" className="h-3.5 w-3.5" />
            Sample snapshot · 28 Sep 2026
          </span>
        </div>

<div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <Metric
            label="National submissions"
            value="128,430"
            note="Illustrative 30-day total · not live data"
            icon={Users}
            accent
          />
          <Metric
            label="Median processing"
            value="4.2 min"
            note="Illustrative end-to-end completion"
            icon={Zap}
          />
          <Metric
            label="Human review rate"
            value="8.4%"
            note="Illustrative referral rate"
            icon={ShieldCheck}
          />
          <Metric
            label="Platform availability"
            value="99.98%"
            note="Illustrative service-level metric"
            icon={Activity}
          />
        </div>

<div className="grid gap-6 xl:grid-cols-[1.6fr_1fr]">
          <section className="rounded-2xl border border-slate-200/80 bg-white p-5 sm:p-6">
            <SectionTitle
              eyebrow="ILLUSTRATIVE THROUGHPUT"
              title="A steady flow of public services"
              aside={<Badge>Today · UTC</Badge>}
            />
            <div className="mb-5 flex items-baseline gap-3">
              <span className="text-3xl font-semibold tracking-tight text-slate-900">8,642</span>
              <span className="text-[11px] font-medium text-emerald-700">+12.8% sample change</span>
            </div>

<svg
              viewBox="0 0 600 150"
              role="img"
              aria-labelledby="throughput-title throughput-description"
              className="h-40 w-full"
            >
              <title id="throughput-title">Illustrative submission activity</title>
              <desc id="throughput-description">
                Twelve synthetic hourly samples range from 42 to 95 relative activity units.
                These bars are not connected to live operational data.
              </desc>
              {[25, 65, 105, 145].map((y) => (
                <line
                  key={y}
                  x1="0"
                  x2="600"
                  y1={y}
                  y2={y}
                  stroke="#e2e8f0"
                  strokeDasharray="3 5"
                />
              ))}
              {activity.map((value, index) => (
                <rect
                  key={index}
                  x={index * 50 + 8}
                  y={145 - value * 1.2}
                  width="28"
                  height={value * 1.2}
                  rx="4"
                  fill={index === activity.length - 1 ? '#4338ca' : '#c7d2fe'}
                />
              ))}
            </svg>

<div className="mt-2 flex justify-between font-mono text-[9px] text-slate-400">
              <span>00:00</span>
              <span>04:00</span>
              <span>08:00</span>
              <span>12:00</span>
            </div>
          </section>

<section className="rounded-2xl border border-slate-200/80 bg-white p-6">
            <SectionTitle eyebrow="THIS BROWSER SESSION" title="Review queue health" />
            <div className="space-y-5">
              {[
                { label: 'Approved', count: approvedCount, color: 'bg-emerald-500' },
                { label: 'In review', count: reviewCount, color: 'bg-amber-400' },
                { label: 'Flagged', count: flaggedCount, color: 'bg-rose-500' },
                {
                  label: 'Processing',
                  count: applications.filter((item) => item.status === 'Processing').length,
                  color: 'bg-indigo-500',
                },
              ].map((item) => (
                <div key={item.label}>
                  <div className="mb-2 flex items-center justify-between text-xs">
                    <span className="text-slate-500">{item.label}</span>
                    <span className="font-mono font-semibold text-slate-700">{item.count}</span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className={`h-full rounded-full transition-all ${item.color}`}
                      style={{ width: `${(item.count / applications.length) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <p className="mt-5 border-t border-slate-100 pt-4 text-[10px] leading-5 text-slate-400">
              Counts reflect the {applications.length} synthetic records below, not the national metrics.
            </p>
          </section>
        </div>

<section className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white">
          <div className="flex flex-col justify-between gap-4 border-b border-slate-100 p-5 lg:flex-row lg:items-center">
            <div>
              <h2 className="text-base font-semibold tracking-tight text-slate-900">Recent submissions</h2>
              <p className="mt-1 text-xs text-slate-500">
                {visibleApplications.length} of {applications.length} sample records
              </p>
            </div>

<div className="flex flex-col gap-2 sm:flex-row">
              <div className="relative">
                <label htmlFor="admin-search" className="sr-only">Search sample submissions</label>
                <Search aria-hidden="true" className="absolute left-3 top-3 h-3.5 w-3.5 text-slate-400" />
                <input
                  id="admin-search"
                  value={adminSearch}
                  onChange={(event) => setAdminSearch(event.target.value)}
                  placeholder="Search reference, service…"
                  className={`${INPUT} py-2.5 pl-9 text-xs sm:w-60`}
                />
              </div>
              <label htmlFor="status-filter" className="sr-only">Filter submissions by status</label>
              <select
                id="status-filter"
                value={statusFilter}
                onChange={(event) =>
                  setStatusFilter(event.target.value as 'All' | ApplicationStatus)
                }
                className={`${INPUT} py-2.5 text-xs sm:w-40`}
              >
                <option value="All">All statuses</option>
                <option value="Approved">Approved</option>
                <option value="In review">In review</option>
                <option value="Flagged">Flagged</option>
                <option value="Processing">Processing</option>
              </select>
            </div>
          </div>

<div
            className={`overflow-x-auto ${FOCUS}`}
            role="region"
            aria-label="Recent sample submissions table"
            tabIndex={0}
          >
            <table className="w-full min-w-[850px] border-collapse text-left">
              <caption className="sr-only">
                Six synthetic submissions. Status buttons filter the queue. Review buttons open a local review panel.
              </caption>
              <thead>
                <tr className="border-b border-slate-200/70 bg-slate-50/80 text-[9px] font-semibold uppercase tracking-wider text-slate-500">
                  <th scope="col" className="px-5 py-3.5">Citizen / reference</th>
                  <th scope="col" className="px-4 py-3.5">Service</th>
                  <th scope="col" className="px-4 py-3.5">District</th>
                  <th scope="col" className="px-4 py-3.5">Status</th>
                  <th scope="col" className="px-4 py-3.5">Risk / 100</th>
                  <th scope="col" className="px-4 py-3.5">Submitted</th>
                  <th scope="col" className="px-5 py-3.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {visibleApplications.map((item) => (
                  <tr
                    key={item.id}
                    className={`border-b border-slate-100 transition last:border-b-0 hover:bg-slate-50/70 ${
                      reviewId === item.id ? 'bg-indigo-50/50' : ''
                    }`}
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-[9px] font-bold text-slate-500">
                          {item.initials}
                        </span>
                        <div>
                          <p className="whitespace-nowrap text-xs font-semibold text-slate-700">
                            {item.citizen}
                          </p>
                          <p className="mt-1 font-mono text-[10px] text-slate-400">{item.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-xs text-slate-600">{item.service}</td>
                    <td className="px-4 py-4 text-xs text-slate-500">{item.district}</td>
                    <td className="px-4 py-4">
                      <button
                        type="button"
                        onClick={() => setStatusFilter(item.status)}
                        aria-label={`Filter by ${item.status}`}
                        className={`rounded-full ${FOCUS}`}
                      >
                        <Badge tone={statusTone(item.status)} dot>{item.status}</Badge>
                      </button>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${
                            item.risk >= 60 ? 'bg-rose-500' : item.risk >= 20 ? 'bg-amber-400' : 'bg-emerald-500'
                          }`}
                          aria-hidden="true"
                        />
                        <span className="font-mono text-xs text-slate-600">
                          {String(item.risk).padStart(2, '0')}
                        </span>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-4 py-4 font-mono text-[10px] text-slate-400">
                      {formatAuditTime(item.submittedAt)}
                    </td>
                    <td className="px-5 py-4 text-right">
                      <button
                        type="button"
                        onClick={() => {
                          setReviewId(item.id);
                          setAdminNotice('');
                        }}
                        aria-controls="review-panel"
                        aria-expanded={reviewId === item.id}
                        className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-[11px] font-semibold text-indigo-700 hover:bg-indigo-50 ${FOCUS}`}
                      >
                        Review
                        <ChevronRight aria-hidden="true" className="h-3 w-3" />
                      </button>
                    </td>
                  </tr>
                ))}
                {visibleApplications.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-5 py-12 text-center text-sm text-slate-500">
                      No sample submissions match these filters.
                      <button
                        type="button"
                        onClick={() => {
                          setAdminSearch('');
                          setStatusFilter('All');
                        }}
                        className={`ml-2 rounded font-semibold text-indigo-700 ${FOCUS}`}
                      >
                        Clear filters
                      </button>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="flex flex-wrap justify-between gap-2 border-t border-slate-100 bg-slate-50/50 px-5 py-3 text-[10px] text-slate-400">
            <span>Risk scores are synthetic indicators, not findings of fraud.</span>
            <span>Click a status to filter · all records are fictional</span>
          </div>
        </section>

<div aria-live="polite">
          {adminNotice && (
            <p className="flex items-center gap-2 rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-xs text-emerald-800">
              <CheckCircle2 aria-hidden="true" className="h-4 w-4 shrink-0" />
              {adminNotice}
            </p>
          )}
        </div>

{reviewApplication && (
          <section
            id="review-panel"
            aria-labelledby="review-title"
            className="rounded-2xl border border-indigo-200 bg-white p-6 shadow-[0_8px_28px_-20px_rgba(49,46,129,0.3)]"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-wider text-indigo-500">
                  LOCAL REVIEW WORKSPACE
                </p>
                <h2 id="review-title" className="mt-2 text-lg font-semibold text-slate-900">
                  {reviewApplication.id}
                </h2>
                <p className="mt-2 text-xs text-slate-500">
                  {reviewApplication.service} · {reviewApplication.district}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setReviewId(null)}
                aria-label="Close review workspace"
                className={`rounded-lg p-2 text-slate-400 hover:bg-slate-50 hover:text-slate-700 ${FOCUS}`}
              >
                <X aria-hidden="true" className="h-4 w-4" />
              </button>
            </div>

<div className="my-5 flex flex-wrap items-center gap-3">
              <Badge tone={statusTone(reviewApplication.status)} dot>
                {reviewApplication.status}
              </Badge>
              <span className="font-mono text-xs text-slate-500">
                Sample risk: {reviewApplication.risk}/100
              </span>
            </div>

<p className="max-w-3xl text-xs leading-6 text-slate-500">
              This panel demonstrates a review interaction only. No evidence has been evaluated
              and no real benefits or identity records can be changed. Actions update React state
              and reset when the page reloads.
            </p>

<div className="mt-5 flex flex-wrap gap-3">
              <button
                type="button"
                disabled={reviewApplication.status === 'Approved'}
                onClick={() => updateReview('Approved')}
                className={PRIMARY_BUTTON}
              >
                <Check aria-hidden="true" className="h-4 w-4" />
                Approve demo record
              </button>
              <button
                type="button"
                disabled={reviewApplication.status === 'Flagged'}
                onClick={() => updateReview('Flagged')}
                className={SECONDARY_BUTTON}
              >
                Flag for review
              </button>
              <button
                type="button"
                onClick={() => {
                  setTrackedId(reviewApplication.id);
                  setTrackingInput(reviewApplication.id);
                  setTrackingError('');
                  setActiveTab('tracker');
                }}
                className={SECONDARY_BUTTON}
              >
                Open audit timeline
                <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
              </button>
            </div>
          </section>
        )}
      </div>
    );
  }

return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-indigo-100 selection:text-indigo-900">
      <a
        href="#main-content"
        className="sr-only fixed left-4 top-4 z-50 rounded-lg bg-indigo-700 px-4 py-3 text-sm text-white focus:not-sr-only"
      >
        Skip to content
      </a>

{/* Persistent desktop navigation */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-[248px] flex-col border-r border-slate-200/80 bg-white lg:flex">
        <button
          type="button"
          onClick={() => setActiveTab('services')}
          aria-label="Sarkar Seva home"
          className={`mx-6 mt-8 flex items-center gap-3 rounded-xl text-left ${FOCUS}`}
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-900 text-white shadow-sm">
            <Landmark aria-hidden="true" className="h-5 w-5" strokeWidth={1.7} />
          </div>
          <div>
            <span className="block text-[18px] font-semibold tracking-tight text-slate-900">
              Sarkar Seva<span className="text-indigo-500">.</span>
            </span>
            <span className="mt-0.5 block text-[9px] font-medium uppercase tracking-[0.16em] text-slate-400">
              Public service, reimagined
            </span>
          </div>
        </button>

<div className="mx-6 mb-7 mt-8 flex items-center gap-2 rounded-lg border border-slate-200/80 bg-slate-50 px-3 py-2.5">
          <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-amber-400" />
          <span className="text-[10px] font-semibold text-slate-600">Interactive prototype</span>
          <span className="ml-auto font-mono text-[9px] text-slate-400">v1.0</span>
        </div>

<p className="mb-3 px-7 text-[9px] font-semibold uppercase tracking-[0.18em] text-slate-400">
          Workspace
        </p>
        <nav aria-label="Main navigation" className="space-y-1 px-4">
          {renderNavigation()}
        </nav>

<div className="mt-auto p-5">
          <div className="rounded-2xl border border-slate-200/80 bg-gradient-to-br from-slate-50 to-white p-4">
            <div className="mb-3 flex items-center gap-2">
              <ShieldCheck aria-hidden="true" className="h-4 w-4 text-indigo-600" />
              <span className="text-xs font-semibold text-slate-700">Trust by design</span>
            </div>
            <p className="text-[11px] leading-6 text-slate-500">
              Consent-led workflows.
              <br />
              Traceable decisions.
              <br />
              Human accountability.
            </p>
            <button
              type="button"
              onClick={() => setActiveTab('tracker')}
              className={`mt-4 inline-flex items-center gap-2 rounded text-[11px] font-semibold text-indigo-700 ${FOCUS}`}
            >
              Explore verification
              <ArrowUpRight aria-hidden="true" className="h-3 w-3" />
            </button>
          </div>

<div className="mt-5 flex items-center gap-3 border-t border-slate-100 pt-5">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-[10px] font-bold text-slate-500">
              DC
            </div>
            <div>
              <p className="text-[11px] font-semibold text-slate-700">Demo citizen</p>
              <p className="mt-0.5 text-[9px] text-slate-400">Guest workspace · local session</p>
            </div>
          </div>
        </div>
      </aside>

<div className="lg:pl-[248px]">
        {/* Header and compact responsive navigation */}
        <header className="sticky top-0 z-20 border-b border-slate-200/80 bg-white/95 backdrop-blur-xl">
          <div className="mx-auto flex h-[72px] max-w-[1600px] items-center justify-between gap-3 px-5 sm:px-8 xl:px-10">
            <div className="hidden items-center gap-2 text-xs text-slate-400 lg:flex">
              <span>Workspace</span>
              <ChevronRight aria-hidden="true" className="h-3 w-3" />
              <span className="font-medium text-slate-700">
                {NAVIGATION.find((item) => item.id === activeTab)?.label}
              </span>
            </div>

<button
              type="button"
              onClick={() => setActiveTab('services')}
              className={`flex items-center gap-2.5 rounded-lg lg:hidden ${FOCUS}`}
              aria-label="Sarkar Seva home"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-900 text-white">
                <Landmark aria-hidden="true" className="h-4 w-4" />
              </div>
              <span className="text-base font-semibold tracking-tight">
                Sarkar Seva<span className="text-indigo-600">.</span>
              </span>
            </button>

<div className="flex items-center gap-3 sm:gap-5">
              <span className="hidden items-center gap-1.5 text-[11px] text-slate-500 sm:flex">
                <Globe2 aria-hidden="true" className="h-3.5 w-3.5" />
                English
              </span>
              <span className="hidden h-4 w-px bg-slate-200 sm:block" aria-hidden="true" />
              <Badge tone="slate">Demo environment</Badge>
              <button
                type="button"
                onClick={() => openAssistant()}
                aria-label="Open citizen support"
                className={`flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 transition hover:bg-indigo-50 hover:text-indigo-700 ${FOCUS}`}
              >
                <MessageSquare aria-hidden="true" className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

<nav
            aria-label="Mobile main navigation"
            className="flex gap-1 overflow-x-auto border-t border-slate-100 px-4 py-2 lg:hidden"
          >
            {renderNavigation(true)}
          </nav>
        </header>

<main
          id="main-content"
          tabIndex={-1}
          className="mx-auto max-w-[1600px] px-5 py-7 outline-none sm:px-8 sm:py-9 xl:px-10"
        >
          <div className="mb-8">
            <div className="mb-3 flex items-center gap-2">
              <span aria-hidden="true" className="h-1 w-5 rounded-full bg-indigo-600" />
              <p className="text-[9px] font-bold tracking-[0.18em] text-indigo-600">
                {title.eyebrow}
              </p>
            </div>
            <h1 className="text-2xl font-semibold leading-tight tracking-tight text-slate-900 sm:text-[29px]">
              {title.title}
            </h1>
            <p className="mt-3 max-w-3xl text-xs leading-6 text-slate-500 sm:text-sm">
              {title.description}
            </p>
          </div>

{activeTab === 'services' && renderServices()}
          {activeTab === 'swarm' && renderSwarm()}
          {activeTab === 'tracker' && renderTracker()}
          {activeTab === 'assistant' && renderAssistant()}
          {activeTab === 'admin' && renderAdmin()}

<footer className="mt-10 flex flex-col justify-between gap-3 border-t border-slate-200/80 pt-5 sm:flex-row">
            <p className="text-[10px] leading-5 text-slate-400">
              Sarkar Seva · Independent govtech prototype · Not affiliated with a government agency
            </p>
            <p className="flex items-center gap-1.5 text-[10px] leading-5 text-slate-400">
              <LockKeyhole aria-hidden="true" className="h-3 w-3" />
              Synthetic data. No official transactions.
            </p>
          </footer>
        </main>
      </div>
    </div>
  );
}
