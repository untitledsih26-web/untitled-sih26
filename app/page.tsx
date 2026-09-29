'use client';

import React, {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
  type ReactNode,
} from 'react';
import { createClient } from '@supabase/supabase-js';
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
  Mail,
  MessageSquare,
  Network,
  Paperclip,
  Pause,
  Phone,
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
/* Supabase Client Initialization                                            */
/* -------------------------------------------------------------------------- */

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder'
);

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
  { id: 'services', label: 'Citizen services', shortLabel: 'Services', icon: Landmark },
  { id: 'swarm', label: 'Agent control room', shortLabel: 'Agent swarm', icon: Network },
  { id: 'tracker', label: 'Track & verify', shortLabel: 'Tracker', icon: Fingerprint },
  { id: 'assistant', label: 'Citizen assistant', shortLabel: 'Assistant', icon: MessageSquare },
  { id: 'admin', label: 'Operations center', shortLabel: 'Operations', icon: LayoutDashboard },
];

const TITLES: Record<TabId, { eyebrow: string; title: string; description: string }> = {
  services: {
    eyebrow: 'CITIZEN EXPERIENCE',
    title: 'Public services. Personal progress.',
    description: 'A clearer path from application to outcome, with assistance at every step.',
  },
  swarm: {
    eyebrow: 'AUTONOMOUS ORCHESTRATION',
    title: 'The intelligence behind every service.',
    description: 'Observe a simulated application moving through four specialized agents.',
  },
  tracker: {
    eyebrow: 'TRANSPARENCY & TRUST',
    title: 'Every milestone, accounted for.',
    description: 'Track a sample application and inspect its browser-generated integrity receipt.',
  },
  assistant: {
    eyebrow: 'GUIDED CITIZEN SUPPORT',
    title: 'A little guidance. A lot less friction.',
    description: 'Explore service guidance through a local, scripted assistant demonstration.',
  },
  admin: {
    eyebrow: 'ADMINISTRATIVE INTELLIGENCE',
    title: 'A national view. An actionable queue.',
    description: 'Illustrative operations analytics and an interactive, session-only review workspace.',
  },
};

const SERVICES = [
  {
    title: 'Identity & Aadhaar sync',
    category: 'IDENTITY SERVICES',
    description: 'Understand identity-linking requirements and prepare for verification.',
    icon: Fingerprint,
    tag: 'Identity assistance',
    prompt: 'How do I prepare for Aadhaar and identity verification?',
  },
  {
    title: 'Welfare pension',
    category: 'SOCIAL PROTECTION',
    description: 'Explore pension pathways and the documents an eligibility review may require.',
    icon: Wallet,
    tag: 'Eligibility guidance',
    prompt: 'Help me understand welfare pension eligibility and documents.',
  },
  {
    title: 'Fast-track ration verification',
    category: 'FOOD SECURITY',
    description: 'Prepare household records for a clear, traceable ration verification process.',
    icon: FileCheck2,
    tag: 'Document readiness',
    prompt: 'Which documents should I prepare for ration verification?',
  },
  {
    title: 'AI scheme recommender',
    category: 'PERSONALIZED DISCOVERY',
    description: 'Discover how an assisted eligibility journey could surface relevant schemes.',
    icon: Sparkles,
    tag: 'Assisted discovery',
    prompt: 'How can I find government schemes relevant to my household?',
  },
];

const AGENTS = [
  { id: 'Agent-OCR', role: 'Document intelligence', description: 'Document parsing & text extraction', icon: FileText, latency: '184 ms', success: '99.2%' },
  { id: 'Agent-FraudGuard', role: 'Trust & anomaly detection', description: 'Simulated biometric & metadata checks', icon: ShieldCheck, latency: '92 ms', success: '99.8%' },
  { id: 'Agent-PolicyMatcher', role: 'Eligibility intelligence', description: 'Socio-economic policy matching', icon: Sparkles, latency: '216 ms', success: '98.6%' },
  { id: 'Agent-Router', role: 'Department orchestration', description: 'Grievance & application dispatch', icon: Network, latency: '38 ms', success: '99.9%' },
];

const SWARM_STEPS: SwarmStep[] = [
  { agent: 'Gateway', event: 'Application accepted', detail: 'A synthetic pension application entered the demonstration queue.', duration: '12 ms' },
  { agent: 'Agent-OCR', event: 'Document classified', detail: 'Sample document identified as an income certificate.', duration: '76 ms' },
  { agent: 'Agent-OCR', event: 'Fields extracted', detail: 'Six synthetic fields mapped into a normalized application schema.', duration: '108 ms' },
  { agent: 'Agent-FraudGuard', event: 'Metadata checks completed', detail: 'Fixture metadata passed. No real biometrics were collected or analyzed.', duration: '92 ms' },
  { agent: 'Agent-PolicyMatcher', event: 'Policy fixture evaluated', detail: 'Sample household attributes matched a fictional demonstration rule.', duration: '216 ms' },
  { agent: 'Agent-PolicyMatcher', event: 'Human approval required', detail: 'An eligibility suggestion was prepared; no benefit was allocated.', duration: '24 ms' },
  { agent: 'Agent-Router', event: 'Department selected', detail: 'The simulated submission was assigned to a social-welfare review queue.', duration: '38 ms' },
  { agent: 'Gateway', event: 'Audit event appended', detail: 'The local simulation completed. No external record was created.', duration: '16 ms' },
];

const INITIAL_APPLICATIONS: Application[] = [
  { id: 'SKR-2026-1042', citizen: 'Demo citizen 1042', initials: 'D1', service: 'Welfare pension', district: 'Lucknow', submittedAt: '2026-09-28T09:41:00Z', status: 'Approved', risk: 4 },
  { id: 'SKR-2026-1043', citizen: 'Demo citizen 1043', initials: 'D2', service: 'Ration verification', district: 'Jaipur', submittedAt: '2026-09-28T09:44:00Z', status: 'In review', risk: 18 },
  { id: 'SKR-2026-1044', citizen: 'Demo citizen 1044', initials: 'D3', service: 'Identity sync', district: 'Bengaluru', submittedAt: '2026-09-28T09:48:00Z', status: 'Flagged', risk: 76 },
  { id: 'SKR-2026-1045', citizen: 'Demo citizen 1045', initials: 'D4', service: 'Scheme discovery', district: 'Pune', submittedAt: '2026-09-28T09:52:00Z', status: 'Processing', risk: 9 },
  { id: 'SKR-2026-1046', citizen: 'Demo citizen 1046', initials: 'D5', service: 'Welfare pension', district: 'Guwahati', submittedAt: '2026-09-28T09:57:00Z', status: 'In review', risk: 24 },
  { id: 'SKR-2026-1047', citizen: 'Demo citizen 1047', initials: 'D6', service: 'Identity sync', district: 'Hyderabad', submittedAt: '2026-09-28T10:02:00Z', status: 'Approved', risk: 3 },
];

const QUICK_PROMPTS = ['Pension eligibility', 'Ration documents', 'Track my application'];

const FOCUS = 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2';
const PRIMARY_BUTTON = `inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-800 disabled:cursor-not-allowed disabled:opacity-50 motion-reduce:transition-none ${FOCUS}`;
const SECONDARY_BUTTON = `inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 motion-reduce:transition-none ${FOCUS}`;
const INPUT = `w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-400 focus:outline-none focus:ring-4 focus:ring-indigo-500/10`;

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
      'and redact information that is not required. Never share an OTP or full ID number in chat.'
    );
  }
  const normalized = text.toLowerCase();
  if (/track|reference|status/.test(normalized)) {
    return 'Open Track & verify and enter SKR-2026-1042 to explore a sample audit timeline.';
  }
  if (/pension|welfare/.test(normalized)) {
    return 'Pension eligibility varies by scheme, state, age, income, and household circumstances.';
  }
  if (/ration|food/.test(normalized)) {
    return 'Ration verification requirements depend on your state or union territory and the type of request.';
  }
  if (/aadhaar|identity|otp/.test(normalized)) {
    return 'For Aadhaar-related services, use UIDAI’s official website or an authorized service center.';
  }
  return 'I can demonstrate guidance for identity services, pension eligibility, ration documents, and application tracking.';
}

function Badge({ children, tone = 'slate', dot = false }: { children: ReactNode; tone?: Tone; dot?: boolean }) {
  const tones: Record<Tone, string> = {
    slate: 'border-slate-200 bg-slate-50 text-slate-600',
    indigo: 'border-indigo-200/70 bg-indigo-50 text-indigo-700',
    emerald: 'border-emerald-200/70 bg-emerald-50 text-emerald-700',
    amber: 'border-amber-200/70 bg-amber-50 text-amber-800',
    rose: 'border-rose-200/70 bg-rose-50 text-rose-700',
  };
  return (
    <span className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold leading-none ${tones[tone]}`}>
      {dot && <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-current" />}
      {children}
    </span>
  );
}

function SectionTitle({ eyebrow, title, aside }: { eyebrow?: string; title: string; aside?: ReactNode }) {
  return (
    <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
      <div>
        {eyebrow && <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">{eyebrow}</p>}
        <h2 className="text-lg font-semibold tracking-tight text-slate-900">{title}</h2>
      </div>
      {aside}
    </div>
  );
}

function Metric({ label, value, note, icon: Icon, accent = false }: { label: string; value: string; note: string; icon: LucideIcon; accent?: boolean }) {
  return (
    <div className={`relative overflow-hidden rounded-2xl border p-5 ${accent ? 'border-indigo-200/70 bg-indigo-50/70' : 'border-slate-200/80 bg-white'}`}>
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
    if (!globalThis.crypto?.subtle) throw new Error('SHA-256 requires HTTPS or localhost.');
    const result = await globalThis.crypto.subtle.digest('SHA-256', new TextEncoder().encode(value));
    return Array.from(new Uint8Array(result)).map((b) => b.toString(16).padStart(2, '0')).join('');
  }

  useEffect(() => {
    alive.current = true;
    let cancelled = false;
    setDigest('');
    setState('idle');
    setError('');

    void hash(receipt)
      .then((val) => { if (!cancelled) setDigest(val); })
      .catch((err: unknown) => {
        if (!cancelled) {
          setState('error');
          setError(err instanceof Error ? err.message : 'Could not generate receipt hash.');
        }
      });

    return () => { cancelled = true; alive.current = false; };
  }, [receipt]);

  async function verify() {
    if (!digest || state === 'checking') return;
    setState('checking');
    setError('');
    try {
      const current = await hash(receipt);
      if (!alive.current) return;
      if (current !== digest) throw new Error('Receipt does not match initial hash.');
      setState('verified');
    } catch (err: unknown) {
      if (!alive.current) return;
      setState('error');
      setError(err instanceof Error ? err.message : 'Receipt verification failed.');
    }
  }

  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white">
      <div className="border-b border-slate-100 p-5">
        <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-700">
          <LockKeyhole aria-hidden="true" className="h-5 w-5" />
        </div>
        <h2 className="font-semibold text-slate-900">Cryptographic receipt</h2>
        <p className="mt-2 text-xs leading-6 text-slate-500">Real SHA-256 calculation over synthetic application receipt.</p>
      </div>
      <div className="space-y-5 p-5">
        <div className="flex items-center justify-between text-xs">
          <span className="text-slate-500">Algorithm</span>
          <span className="font-mono font-semibold text-slate-700">SHA-256</span>
        </div>
        <div>
          <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-slate-500">Receipt fingerprint</p>
          <code className="block break-all rounded-xl border border-slate-200 bg-slate-50 p-3 font-mono text-[11px] leading-6 text-slate-600">
            {digest || (error ? 'Hash unavailable' : 'Generating fingerprint…')}
          </code>
        </div>
        <button
          type="button"
          className={`${PRIMARY_BUTTON} w-full`}
          onClick={() => void verify()}
          disabled={!digest || state === 'checking' || state === 'verified'}
        >
          <ShieldCheck aria-hidden="true" className="h-4 w-4" />
          {state === 'checking' ? 'Checking…' : state === 'verified' ? 'Verified' : 'Verify Integrity'}
        </button>
        {state === 'verified' && <p className="text-xs text-emerald-700">Receipt matches generated hash.</p>}
        {error && <p className="text-xs text-rose-700">{error}</p>}
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/* Real Supabase OTP Login Component                                          */
/* -------------------------------------------------------------------------- */

function Login({ onLogin }: { onLogin: () => void }) {
  const [authMode, setAuthMode] = useState<'phone' | 'email'>('phone');
  const [step, setStep] = useState<'send' | 'verify'>('send');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      if (authMode === 'phone') {
        const fullPhone = phone.startsWith('+') ? phone : `+91${phone}`;
        const { error } = await supabase.auth.signInWithOtp({ phone: fullPhone });
        if (error) throw error;
        setMessage(`OTP sent via SMS to ${fullPhone}`);
      } else {
        const { error } = await supabase.auth.signInWithOtp({ email });
        if (error) throw error;
        setMessage(`OTP sent via email to ${email}`);
      }
      setStep('verify');
    } catch (err: any) {
      setError(err.message || 'Failed to send OTP. Ensure Supabase credentials are set.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (authMode === 'phone') {
        const fullPhone = phone.startsWith('+') ? phone : `+91${phone}`;
        const { error } = await supabase.auth.verifyOtp({
          phone: fullPhone,
          token: otp,
          type: 'sms',
        });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.verifyOtp({
          email,
          token: otp,
          type: 'email',
        });
        if (error) throw error;
      }
      onLogin();
    } catch (err: any) {
      setError(err.message || 'Invalid OTP token. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 flex flex-col">
      <header className="flex h-[72px] items-center justify-between border-b border-slate-200/80 bg-white/95 px-6 backdrop-blur-xl sm:px-10">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-900 text-white shadow-sm">
            <Landmark aria-hidden="true" className="h-5 w-5" />
          </div>
          <span className="text-[18px] font-semibold tracking-tight text-slate-900">
            Sarkar Seva<span className="text-indigo-600">.</span>
          </span>
        </div>
        <div className="flex items-center gap-4">
          <Badge tone="slate">Supabase OTP Auth</Badge>
        </div>
      </header>

      <main className="flex flex-1 items-center justify-center p-6 sm:p-10">
        <div className="grid w-full max-w-[1100px] items-center gap-12 lg:grid-cols-2 lg:gap-20">
          
          <div className="w-full max-w-md mx-auto rounded-3xl border border-slate-200/80 bg-white p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] sm:p-10">
            <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl border border-indigo-100 bg-gradient-to-br from-white to-indigo-50 text-indigo-700">
              <Users className="h-6 w-6" />
            </div>
            
            <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.18em] text-indigo-600">
              CITIZEN AUTHENTICATION
            </p>
            <h1 className="mb-3 text-3xl font-semibold tracking-tight text-slate-900">
              {step === 'send' ? 'Sign In / Register' : 'Enter OTP'}
            </h1>
            <p className="mb-6 text-sm leading-6 text-slate-500">
              {step === 'send'
                ? 'Receive an official One-Time Password to login securely.'
                : 'Check your mobile phone or inbox for the 6-digit code.'}
            </p>

            {/* Auth Mode Tabs */}
            {step === 'send' && (
              <div className="mb-6 flex rounded-xl border border-slate-200 bg-slate-50 p-1">
                <button
                  type="button"
                  onClick={() => { setAuthMode('phone'); setError(''); }}
                  className={`flex flex-1 items-center justify-center gap-2 rounded-lg py-2 text-xs font-semibold transition ${
                    authMode === 'phone' ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  <Phone className="h-3.5 w-3.5" />
                  Phone OTP
                </button>
                <button
                  type="button"
                  onClick={() => { setAuthMode('email'); setError(''); }}
                  className={`flex flex-1 items-center justify-center gap-2 rounded-lg py-2 text-xs font-semibold transition ${
                    authMode === 'email' ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  <Mail className="h-3.5 w-3.5" />
                  Email OTP
                </button>
              </div>
            )}

            {step === 'send' ? (
              <form onSubmit={handleSendOtp} className="space-y-5">
                {authMode === 'phone' ? (
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-900">Mobile Number</label>
                    <div className="relative">
                      <span className="absolute left-4 top-3.5 text-sm font-medium text-slate-500">+91</span>
                      <input
                        type="tel"
                        placeholder="Enter 10-digit mobile number"
                        value={phone}
                        maxLength={10}
                        onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                        className={`${INPUT} pl-12 font-mono`}
                        required
                      />
                    </div>
                  </div>
                ) : (
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-900">Email Address</label>
                    <input
                      type="email"
                      placeholder="citizen@example.gov.in"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={INPUT}
                      required
                    />
                  </div>
                )}

                {error && <div className="rounded-xl border border-rose-100 bg-rose-50 p-3 text-sm text-rose-700">{error}</div>}

                <button type="submit" disabled={loading} className={`${PRIMARY_BUTTON} w-full py-3 text-base`}>
                  {loading ? 'Sending OTP...' : 'Send OTP Code'}
                  <ArrowRight className="h-4 w-4" />
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp} className="space-y-5">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-900">6-Digit Verification Code</label>
                  <input
                    type="text"
                    placeholder="123456"
                    value={otp}
                    maxLength={6}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                    className={`${INPUT} text-center font-mono text-xl tracking-widest`}
                    required
                  />
                </div>

                {message && <div className="rounded-xl border border-emerald-100 bg-emerald-50 p-3 text-xs text-emerald-800">{message}</div>}
                {error && <div className="rounded-xl border border-rose-100 bg-rose-50 p-3 text-sm text-rose-700">{error}</div>}

                <button type="submit" disabled={loading || otp.length < 6} className={`${PRIMARY_BUTTON} w-full py-3 text-base`}>
                  {loading ? 'Verifying...' : 'Verify & Login'}
                  <ShieldCheck className="h-4 w-4" />
                </button>

                <button
                  type="button"
                  onClick={() => { setStep('send'); setOtp(''); setError(''); }}
                  className="w-full text-center text-xs font-semibold text-slate-500 hover:text-slate-800"
                >
                  ← Change number or resend
                </button>
              </form>
            )}
          </div>

          <div className="hidden lg:block">
            <h2 className="mb-6 text-4xl font-semibold leading-[1.15] tracking-tight text-slate-900">
              Real-time OTP Auth <br />
              <span className="text-indigo-600">Powered by Supabase.</span>
            </h2>
            <p className="mb-10 max-w-md text-base leading-7 text-slate-500">
              Integrated with Resend SMTP for instant email delivery and Twilio for SMS verification.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Main Dashboard Component                                                   */
/* -------------------------------------------------------------------------- */

function Dashboard() {
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
      text: 'Namaste. Let’s make public services easier to navigate.\n\nI can walk you through sample document checklists and explain service pathways.',
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
      !search || `${item.id} ${item.citizen} ${item.service} ${item.district}`.toLowerCase().includes(search);
    return matchesSearch && (statusFilter === 'All' || item.status === statusFilter);
  });

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

  function openAssistant(prompt?: string) {
    if (prompt) setDraft(prompt);
    setActiveTab('assistant');
  }

  function trackApplication(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const reference = trackingInput.trim().toUpperCase();
    setTrackingInput(reference);

    if (!/^SKR-2026-\d{4}$/.test(reference)) {
      setTrackingError('Use format SKR-2026-XXXX.');
      setTrackedId(null);
      return;
    }
    setTrackingError('');
    setTrackedId(reference);
  }

  function renderNavigation(mobile = false) {
    return NAVIGATION.map((item) => {
      const selected = activeTab === item.id;
      const Icon = item.icon;
      return (
        <button
          key={item.id}
          type="button"
          onClick={() => setActiveTab(item.id)}
          className={
            mobile
              ? `inline-flex shrink-0 items-center gap-2 rounded-lg px-3 py-2.5 text-xs font-semibold ${selected ? 'bg-indigo-50 text-indigo-700' : 'text-slate-500'}`
              : `flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-[13px] font-medium ${selected ? 'bg-indigo-50 text-indigo-800' : 'text-slate-500'}`
          }
        >
          <Icon className="h-[18px] w-[18px]" />
          <span>{mobile ? item.shortLabel : item.label}</span>
        </button>
      );
    });
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-[248px] flex-col border-r border-slate-200/80 bg-white lg:flex">
        <div className="mx-6 mt-8 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-900 text-white">
            <Landmark className="h-5 w-5" />
          </div>
          <span className="text-[18px] font-semibold text-slate-900">Sarkar Seva.</span>
        </div>
        <nav className="mt-8 space-y-1 px-4">{renderNavigation()}</nav>
        <div className="mt-auto p-5 border-t">
          <button
            type="button"
            onClick={async () => {
              await supabase.auth.signOut();
              window.location.reload();
            }}
            className="w-full text-left text-xs font-semibold text-rose-600 hover:text-rose-800"
          >
            Sign Out
          </button>
        </div>
      </aside>

      <div className="lg:pl-[248px]">
        <main className="mx-auto max-w-[1600px] px-5 py-7 sm:px-8 xl:px-10">
          <div className="mb-8">
            <h1 className="text-2xl font-semibold text-slate-900 sm:text-[29px]">{title.title}</h1>
            <p className="mt-2 text-sm text-slate-500">{title.description}</p>
          </div>

          {activeTab === 'services' && (
            <div className="grid gap-4 md:grid-cols-2">
              {SERVICES.map((s) => (
                <div key={s.title} className="rounded-2xl border bg-white p-6">
                  <h3 className="font-semibold text-slate-900">{s.title}</h3>
                  <p className="mt-2 text-xs text-slate-500">{s.description}</p>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'swarm' && (
            <div className="rounded-2xl border bg-white p-6">
              <h2 className="font-semibold">Swarm Active</h2>
              <p className="text-xs text-slate-500">7-Agent Pipeline Streaming telemetry...</p>
            </div>
          )}

          {activeTab === 'tracker' && (
            <div className="space-y-6">
              <form onSubmit={trackApplication} className="flex gap-3">
                <input
                  value={trackingInput}
                  onChange={(e) => setTrackingInput(e.target.value)}
                  className={INPUT}
                  placeholder="SKR-2026-1042"
                />
                <button type="submit" className={PRIMARY_BUTTON}>Track</button>
              </form>
              {trackedApplication && <IntegrityVerifier receipt={JSON.stringify(trackedApplication)} />}
            </div>
          )}

          {activeTab === 'assistant' && (
            <div className="rounded-2xl border bg-white p-6">
              <h2 className="font-semibold text-slate-900">AI Assistant Online</h2>
              <p className="text-xs text-slate-500">Ask questions about government applications.</p>
            </div>
          )}

          {activeTab === 'admin' && (
            <div className="rounded-2xl border bg-white p-6">
              <h2 className="font-semibold text-slate-900">Admin Control Center</h2>
              <p className="text-xs text-slate-500">Active submissions & risk evaluation queue.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Main Application Export                                                    */
/* -------------------------------------------------------------------------- */

export default function Page() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    // Check initial Supabase auth session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsAuthenticated(!!session);
    });

    // Listen for auth changes (e.g., OTP login, logout)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (isAuthenticated === null) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 text-sm text-slate-500">
        Checking session...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Login onLogin={() => setIsAuthenticated(true)} />;
  }

  return <Dashboard />;
}