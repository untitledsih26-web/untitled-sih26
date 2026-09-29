"use client";

import { useAuth } from "@/components/providers/auth-provider";
import { Loader2, Mail, ShieldCheck, Smartphone } from "lucide-react";
import { useEffect, useState } from "react";

type Channel = "email" | "phone";
type Intent = "sign-in" | "register";

const inputClass =
  "w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40";

export function LoginView() {
  const { supabase, configured, adoptSession } = useAuth();
  const [intent, setIntent] = useState<Intent>("sign-in");
  const [channel, setChannel] = useState<Channel>("email");
  const [fullName, setFullName] = useState("");
  const [contactInput, setContactInput] = useState("");
  const [otpToken, setOtpToken] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState("");
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = window.setInterval(() => {
      setCooldown((current) => (current > 0 ? current - 1 : 0));
    }, 1000);
    return () => window.clearInterval(timer);
  }, [cooldown]);

  function switchChannel(next: Channel) {
    setChannel(next);
    setOtpSent(false);
    setOtpToken("");
    setContactInput("");
    setAuthError("");
  }

  function validateContact(): string | null {
    const contact = contactInput.trim();
    if (channel === "email") {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact)) return "Enter a valid email address.";
      return null;
    }
    const phone = contact.replace(/[\s()-]/g, "");
    if (!/^\+[1-9]\d{7,14}$/.test(phone)) return "Enter a mobile number in international format, for example +919876543210.";
    return null;
  }

  async function sendOtp() {
    if (!supabase || !configured) {
      setAuthError("Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.");
      return;
    }
    const validationError = validateContact();
    if (validationError) {
      setAuthError(validationError);
      return;
    }
    if (intent === "register" && fullName.trim().length < 3) {
      setAuthError("Enter the full name to register this account.");
      return;
    }
    if (cooldown > 0) return;

    setAuthLoading(true);
    setAuthError("");
    const contact = channel === "phone" ? contactInput.trim().replace(/[\s()-]/g, "") : contactInput.trim();
    setContactInput(contact);

    try {
      const metadata = intent === "register" ? { full_name: fullName.trim() } : undefined;
      const { error } =
        channel === "email"
          ? await supabase.auth.signInWithOtp({
              email: contact,
              options: {
                shouldCreateUser: intent === "register",
                emailRedirectTo: window.location.origin,
                data: metadata,
              },
            })
          : await supabase.auth.signInWithOtp({
              phone: contact,
              options: {
                shouldCreateUser: intent === "register",
                data: metadata,
              },
            });
      if (error) throw error;
      setOtpSent(true);
      setCooldown(60);
    } catch (error) {
      setAuthError(error instanceof Error ? error.message : "Failed to send the verification code.");
    } finally {
      setAuthLoading(false);
    }
  }

  async function verifyOtp() {
    if (!supabase) return;
    if (!/^\d{6}$/.test(otpToken.trim())) {
      setAuthError("Enter the 6-digit code.");
      return;
    }
    setAuthLoading(true);
    setAuthError("");
    try {
      const contact = contactInput.trim();
      const token = otpToken.trim();
      const { data, error } =
        channel === "email"
          ? await supabase.auth.verifyOtp({ email: contact, token, type: "email" })
          : await supabase.auth.verifyOtp({ phone: contact, token, type: "sms" });
      if (error) throw error;
      adoptSession(data.session);
    } catch (error) {
      setAuthError(error instanceof Error ? error.message : "The verification code was not accepted.");
    } finally {
      setAuthLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 lg:grid lg:grid-cols-[1.1fr_0.9fr]">
      <section className="hidden flex-col justify-center border-r border-white/10 px-12 py-12 lg:flex">
        <div className="max-w-lg">
          <div className="mb-8 flex h-1 w-40 overflow-hidden rounded-full" aria-hidden="true">
            <span className="flex-1 bg-[#FF9933]" />
            <span className="flex-1 bg-white" />
            <span className="flex-1 bg-[#138808]" />
          </div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-300">SIH 2026 GovTech Platform</p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-white">Sarkar Seva</h1>
          <p className="mt-4 text-sm leading-6 text-slate-400">
            One signed-in session for welfare requests, consent-gated department exchange, and officer review of validation anomalies.
          </p>
        <ul className="mt-8 max-w-md space-y-3 text-sm text-slate-300">
          <li className="flex gap-3">
            <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
            Email or mobile OTP before any service record is opened.
          </li>
          <li className="flex gap-3">
            <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
            Department calls run only after an explicit consent checkbox.
          </li>
          <li className="flex gap-3">
            <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
            Identity numbers stay masked in the interoperability ledger.
          </li>
        </ul>
        </div>
      </section>

      <section className="flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl sm:p-8">
          <div className="mb-6 lg:hidden">
            <p className="text-xs font-semibold uppercase tracking-wide text-blue-300">SIH 2026</p>
            <h1 className="mt-1 text-2xl font-semibold text-white">Sarkar Seva</h1>
          </div>
          <h2 className="text-lg font-semibold text-white">{intent === "register" ? "Create your account" : "Sign in"}</h2>
          <p className="mt-1 text-xs leading-5 text-slate-400">A one-time code is sent to the email or mobile number you enter. No password is stored in this portal.</p>

          <div className="mt-5 grid grid-cols-2 gap-1 rounded-xl border border-slate-800 bg-slate-950 p-1 text-xs font-semibold">
            <button
              type="button"
              onClick={() => {
                setIntent("sign-in");
                setAuthError("");
              }}
              className={`rounded-lg px-3 py-2 ${intent === "sign-in" ? "bg-slate-800 text-white" : "text-slate-400"}`}
            >
              Sign in
            </button>
            <button
              type="button"
              onClick={() => {
                setIntent("register");
                setAuthError("");
              }}
              className={`rounded-lg px-3 py-2 ${intent === "register" ? "bg-slate-800 text-white" : "text-slate-400"}`}
            >
              Register
            </button>
          </div>

          <div className="mt-3 grid grid-cols-2 gap-1 rounded-xl border border-slate-800 bg-slate-950 p-1 text-xs font-semibold">
            <button
              type="button"
              onClick={() => switchChannel("email")}
              className={`inline-flex items-center justify-center gap-2 rounded-lg px-3 py-2 ${channel === "email" ? "bg-blue-600 text-white" : "text-slate-400"}`}
            >
              <Mail className="h-3.5 w-3.5" />
              Email OTP
            </button>
            <button
              type="button"
              onClick={() => switchChannel("phone")}
              className={`inline-flex items-center justify-center gap-2 rounded-lg px-3 py-2 ${channel === "phone" ? "bg-blue-600 text-white" : "text-slate-400"}`}
            >
              <Smartphone className="h-3.5 w-3.5" />
              Mobile OTP
            </button>
          </div>

          {authError ? (
            <p className="mt-4 rounded-xl border border-rose-800/80 bg-rose-950/60 px-3 py-3 text-xs leading-5 text-rose-200" role="alert">
              {authError}
            </p>
          ) : null}

          {!otpSent ? (
            <form
              className="mt-5 space-y-4"
              onSubmit={(event) => {
                event.preventDefault();
                void sendOtp();
              }}
            >
              {intent === "register" ? (
                <label className="block text-xs font-medium text-slate-300">
                  Full name
                  <input
                    value={fullName}
                    onChange={(event) => setFullName(event.target.value)}
                    autoComplete="name"
                    className={`${inputClass} mt-1`}
                    placeholder="Name on the identity record"
                  />
                </label>
              ) : null}
              <label className="block text-xs font-medium text-slate-300">
                {channel === "email" ? "Email address" : "Mobile number"}
                <input
                  type={channel === "email" ? "email" : "tel"}
                  required
                  value={contactInput}
                  onChange={(event) => setContactInput(event.target.value)}
                  autoComplete={channel === "email" ? "email" : "tel"}
                  placeholder={channel === "email" ? "name@example.com" : "+919876543210"}
                  className={`${inputClass} mt-1`}
                />
              </label>
              <button
                type="submit"
                disabled={authLoading || cooldown > 0}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-slate-900 disabled:opacity-50"
              >
                {authLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                {cooldown > 0 ? `Wait ${cooldown}s to resend` : "Send secure OTP"}
              </button>
            </form>
          ) : (
            <form
              className="mt-5 space-y-4"
              onSubmit={(event) => {
                event.preventDefault();
                void verifyOtp();
              }}
            >
              <p className="text-xs leading-5 text-slate-400">
                Code sent to <span className="font-medium text-white">{contactInput}</span>
              </p>
              <label className="block text-xs font-medium text-slate-300">
                6-digit OTP
                <input
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  pattern="\d{6}"
                  maxLength={6}
                  required
                  value={otpToken}
                  onChange={(event) => setOtpToken(event.target.value.replace(/\D/g, "").slice(0, 6))}
                  className={`${inputClass} mt-1 text-center font-mono text-lg tracking-[0.4em]`}
                  placeholder="••••••"
                  aria-label="One-time password"
                />
              </label>
              <button
                type="submit"
                disabled={authLoading}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white hover:bg-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-2 focus:ring-offset-slate-900 disabled:opacity-50"
              >
                {authLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                Verify and enter portal
              </button>
              <div className="flex items-center justify-between gap-3 text-xs">
                <button
                  type="button"
                  onClick={() => {
                    setOtpSent(false);
                    setOtpToken("");
                    setAuthError("");
                  }}
                  className="text-slate-400 hover:text-white"
                >
                  Change contact
                </button>
                <button
                  type="button"
                  disabled={cooldown > 0 || authLoading}
                  onClick={() => void sendOtp()}
                  className="font-medium text-blue-300 hover:text-blue-200 disabled:text-slate-500"
                >
                  {cooldown > 0 ? `Resend in ${cooldown}s` : "Resend code"}
                </button>
              </div>
            </form>
          )}
        </div>
      </section>
    </div>
  );
}
