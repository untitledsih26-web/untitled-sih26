"use client";

import { useCallback, useEffect, useRef, useState, type FormEvent } from "react";
import { createClient, type Session, type SupabaseClient } from "@supabase/supabase-js";
import {
  Activity, AlertTriangle, ArrowLeft, ArrowRight, BadgeCheck, BrainCircuit, Building2,
  CheckCircle2, Clock, Cpu, FileCheck2, Landmark, Loader2, Lock, LogOut, Mail, Phone,
  RefreshCw, ShieldCheck, UserRound, X, Zap,
} from "lucide-react";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "https://sarkar-seva-demo.supabase.co";
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "public-anon-fallback-key";
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";
const IS_SUPABASE_CONFIGURED =
  Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL) && Boolean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

const supabase: SupabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true },
});

type ViewKind = "landing" | "user" | "admin";
type OtpChannel = "email" | "sms";
type AgentStatus = "queued" | "running" | "success" | "error";
type ConsentScope = "revenue" | "income" | "identity";

const AGENT_PIPELINE = ["Request", "Routing", "Data", "Validation", "Consent", "Response", "Notifier"] as const;
type AgentName = (typeof AGENT_PIPELINE)[number];

interface AgentTraceEntry {
  agent: AgentName;
  status: AgentStatus;
  message: string;
  durationMs: number;
}

interface ProcessApplicationResult {
  applicationId: string;
  status: "cleared" | "anomaly";
  executionMs: number;
  tokensUsed: number;
  trace: AgentTraceEntry[];
}

interface DataMismatch {
  field: string;
  expected: string;
  actual: string;
  sourceDepartment: string;
}

interface InteropRequest {
  appId: string;
  applicantName: string;
  service: string;
  departmentsQueried: string[];
  aiStatus: "Cleared" | "Anomaly";
  mismatches: DataMismatch[];
  receivedAt: string;
  decision: "Approved Exception" | "Rejected" | null;
}

const CONSENT_SCOPES: { key: ConsentScope; label: string; detail: string }[] = [
  { key: "revenue", label: "Revenue Department", detail: "Land, property & domicile records" },
  { key: "income", label: "Income Tax Department", detail: "Declared income & assessment records" },
  { key: "identity", label: "Identity Registry (UIDAI)", detail: "Demographic match only — no biometrics" },
];

const SEED_REQUESTS: InteropRequest[] = [
  { appId: "SS-2026-000871", applicantName: "Rameshwar Yadav", service: "Income Certificate", departmentsQueried: ["Revenue", "Income Tax", "Identity"], aiStatus: "Cleared", mismatches: [], receivedAt: "2026-09-29T09:14:00Z", decision: null },
  { appId: "SS-2026-000872", applicantName: "Meenakshi Sharma", service: "Domicile Certificate", departmentsQueried: ["Revenue", "Identity"], aiStatus: "Anomaly", mismatches: [{ field: "Date of Birth", expected: "1992-04-11", actual: "1992-04-01", sourceDepartment: "Identity Registry" }, { field: "Declared Income", expected: "₹4,80,000", actual: "₹6,20,000", sourceDepartment: "Income Tax" }], receivedAt: "2026-09-29T09:31:00Z", decision: null },
  { appId: "SS-2026-000873", applicantName: "Aniket Kulkarni", service: "Caste Validity Certificate", departmentsQueried: ["Revenue", "Identity"], aiStatus: "Cleared", mismatches: [], receivedAt: "2026-09-29T09:47:00Z", decision: null },
  { appId: "SS-2026-000874", applicantName: "Fatima Bano", service: "Pension Eligibility Review", departmentsQueried: ["Revenue", "Income Tax", "Identity"], aiStatus: "Anomaly", mismatches: [{ field: "Land Parcel Ownership", expected: "Hissa 12/2, Washim", actual: "No record found", sourceDepartment: "Revenue" }], receivedAt: "2026-09-29T10:02:00Z", decision: "Rejected" },
];

function useCountdown(active: boolean, seconds = 60): number {
  const [remaining, setRemaining] = useState(seconds);
  useEffect(() => {
    if (!active) {
      setRemaining(seconds);
      return;
    }
    setRemaining(seconds);
    const tick = window.setInterval(() => {
      setRemaining((prev) => {
        if (prev <= 1) {
          window.clearInterval(tick);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => window.clearInterval(tick);
  }, [active, seconds]);
  return remaining;
}

function Brand({ compact = false }: { compact?: boolean }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-blue-600 shadow-lg shadow-emerald-500/20">
        <Landmark className="h-5 w-5 text-white" aria-hidden />
      </div>
      <div>
        <p className="text-base font-bold leading-tight tracking-tight text-slate-50">Sarkar Seva</p>
        {!compact && (
          <p className="text-[11px] font-medium uppercase tracking-widest text-emerald-400/80">
            SIH 2026 · Interop Platform
          </p>
        )}
      </div>
    </div>
  );
}

function ErrorBanner({ message }: { message: string }) {
  return (
    <div role="alert" className="flex items-start gap-2.5 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
      <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
      <span>{message}</span>
    </div>
  );
}

function AiBadge({ status }: { status: "Cleared" | "Anomaly" }) {
  const cleared = status === "Cleared";
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold ${
      cleared
        ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
        : "border-amber-500/30 bg-amber-500/10 text-amber-300"
    }`}>
      {cleared ? <CheckCircle2 className="h-3.5 w-3.5" aria-hidden /> : <AlertTriangle className="h-3.5 w-3.5" aria-hidden />}
      {status}
    </span>
  );
}

function AuthPanel({ pendingRole, onDismiss }: { pendingRole: "user" | "admin" | null; onDismiss: () => void }) {
  const [channel, setChannel] = useState<OtpChannel>("email");
  const [destination, setDestination] = useState("");
  const [code, setCode] = useState("");
  const [phase, setPhase] = useState<"entry" | "code">("entry");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [cooldownActive, setCooldownActive] = useState(false);
  const remaining = useCountdown(cooldownActive, 60);

const trimmed = destination.trim();
  const destinationValid =
    channel === "email"
      ? /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)
      : /^\+?[1-9]\d{9,13}$/.test(trimmed.replace(/\s/g, ""));
  const codeValid = /^\d{6}$/.test(code.trim());
  const masked =
    channel === "email"
      ? trimmed
      : trimmed.length > 6
        ? `${trimmed.slice(0, 3)}••••${trimmed.slice(-3)}`
        : "••••";

function switchChannel(next: OtpChannel) {
    setChannel(next);
    setDestination("");
    setCode("");
    setPhase("entry");
    setError(null);
    setInfo(null);
    setCooldownActive(false);
  }

const requestOtp = useCallback(
    async (resend: boolean) => {
      setBusy(true);
      setError(null);
      setInfo(null);
      try {
        const target = channel === "email" ? { email: trimmed } : { phone: trimmed };
        const { error: otpError } = await supabase.auth.signInWithOtp(target);
        if (otpError) throw otpError;
        setPhase("code");
        setCode("");
        setCooldownActive(true);
        setInfo(
          `${resend ? "A new" : "Verification"} 6-digit code was sent to ${masked} via ${channel === "email" ? "email" : "SMS"}. Valid for 10 minutes.`
        );
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : `Unable to send the OTP. Verify your ${channel === "email" ? "email address" : "mobile number"} and retry.`
        );
      } finally {
        setBusy(false);
      }
    },
    [channel, trimmed, masked]
  );

async function verifyOtp() {
    setBusy(true);
    setError(null);
    try {
      const payload =
        channel === "email"
          ? { type: "email" as const, email: trimmed, token: code.trim() }
          : { type: "sms" as const, phone: trimmed, token: code.trim() };
      const { error: verifyError } = await supabase.auth.verifyOtp(payload);
      if (verifyError) throw verifyError;
      onDismiss();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Verification failed. Check the 6-digit code and retry.");
    } finally {
      setBusy(false);
    }
  }

return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm" role="dialog" aria-modal="true">
      <div className="w-full max-w-md rounded-2xl border border-slate-700/60 bg-slate-900 p-6 shadow-2xl shadow-black/50 sm:p-8">
        <div className="mb-6 flex items-start justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-widest text-emerald-400">Secure Access · SIH 2026</p>
            <h2 className="mt-1.5 text-xl font-bold text-slate-50">Sarkar Seva Verification</h2>
            <p className="mt-1 text-sm text-slate-400">
              {pendingRole === "admin" ? "Department Admin sign-in" : "Citizen Portal sign-in"}
            </p>
          </div>
          <button
            type="button"
            onClick={onDismiss}
            disabled={busy}
            aria-label="Close authentication dialog"
            className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-800 hover:text-slate-200 disabled:opacity-50"
          >
            <X className="h-5 w-5" aria-hidden />
          </button>
        </div>

{!IS_SUPABASE_CONFIGURED && (
          <div className="mb-5">
            <ErrorBanner message="Supabase is running on fallback credentials. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY for live OTP delivery." />
          </div>
        )}

{phase === "entry" && (
          <div className="mb-5 grid grid-cols-2 gap-1 rounded-xl border border-slate-700/60 bg-slate-950/50 p-1" role="tablist" aria-label="OTP delivery channel">
            {(["email", "sms"] as const).map((option) => (
              <button
                key={option}
                type="button"
                role="tab"
                aria-selected={channel === option}
                onClick={() => switchChannel(option)}
                disabled={busy}
                className={`flex items-center justify-center gap-2 rounded-lg px-3 py-2.5 text-sm font-semibold transition-all duration-200 disabled:opacity-50 \${
                  channel === option
                    ? "bg-emerald-500/15 text-emerald-300"
                    : "text-slate-400 hover:bg-slate-800/70 hover:text-slate-200"
                }`}
              >
                {option === "email" ? <Mail className="h-4 w-4" aria-hidden /> : <Phone className="h-4 w-4" aria-hidden />}
                {option === "email" ? "Email OTP" : "Phone OTP"}
              </button>
            ))}
          </div>
        )}

{error && <div className="mb-5"><ErrorBanner message={error} /></div>}
        {info && !error && (
          <div role="status" className="mb-5 flex items-start gap-2.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300">
            <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
            <span>{info}</span>
          </div>
        )}

<form
          className="space-y-5"
          onSubmit={(event: FormEvent<HTMLFormElement>) => {
            event.preventDefault();
            if (busy) return;
            if (phase === "entry" && destinationValid) void requestOtp(false);
            else if (phase === "code" && codeValid) void verifyOtp();
          }}
        >
          {phase === "entry" ? (
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-slate-300">
                {channel === "email" ? "Registered email address" : "Registered mobile number"}
              </span>
              <input
                type={channel === "email" ? "email" : "tel"}
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                disabled={busy}
                required
                autoComplete={channel === "email" ? "email" : "tel"}
                inputMode={channel === "email" ? "email" : "tel"}
                placeholder={channel === "email" ? "citizen@example.gov.in" : "+919876543210"}
                className="w-full rounded-xl border border-slate-700/60 bg-slate-950/50 px-4 py-3 text-sm text-slate-100 placeholder:text-slate-500 outline-none transition focus:border-emerald-500/60 focus:ring-2 focus:ring-emerald-500/20 disabled:opacity-50"
              />
            </label>
          ) : (
            <>
              <label className="block">
                <span className="mb-1.5
