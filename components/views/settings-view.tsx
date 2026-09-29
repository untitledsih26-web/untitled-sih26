"use client";

import { useAuth } from "@/components/providers/auth-provider";
import { usePortal } from "@/components/providers/portal-provider";
import { displayContact, displayName } from "@/lib/session";
import type { ConsentPreferences } from "@/lib/types";

const TOGGLES: Array<{ key: keyof Omit<ConsentPreferences, "updatedAt">; label: string; detail: string }> = [
  {
    key: "identity",
    label: "Identity Portal",
    detail: "Allow a standing preference to verify name and date of birth.",
  },
  {
    key: "landRecords",
    label: "Land Records",
    detail: "Allow a standing preference to confirm holding status. Parcel numbers stay redacted.",
  },
  {
    key: "revenue",
    label: "Revenue Department",
    detail: "Allow a standing preference to read the household revenue band.",
  },
  {
    key: "incomeRegistry",
    label: "Income Tax Registry",
    detail: "Allow a standing preference to read the income band. PAN stays masked.",
  },
  {
    key: "shareAnonymizedTelemetry",
    label: "Anonymized telemetry",
    detail: "Share pipeline timing with the department dashboard without the identifier.",
  },
];

export function SettingsView() {
  const { session } = useAuth();
  const { consent, updateConsent, resetConsent, consentError } = usePortal();
  if (!session) return null;
  const savedAt = consent.updatedAt
    ? new Intl.DateTimeFormat("en-IN", { dateStyle: "medium", timeStyle: "short" }).format(new Date(consent.updatedAt))
    : null;

  return (
    <div className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-[0.8fr_1.2fr]">
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Signed-in account</p>
        <h1 className="mt-2 text-2xl font-semibold text-slate-900">{displayName(session)}</h1>
        <p className="mt-2 text-sm text-slate-600">{displayContact(session)}</p>
        <dl className="mt-6 space-y-3 text-sm">
          <div className="flex items-center justify-between gap-3 border-t border-slate-100 pt-3">
            <dt className="text-slate-500">User id</dt>
            <dd className="max-w-[14rem] truncate font-mono text-xs text-slate-800">{session.user.id}</dd>
          </div>
          <div className="flex items-center justify-between gap-3">
            <dt className="text-slate-500">Session</dt>
            <dd className="text-slate-800">{session.user.email ? "Email OTP" : "Mobile OTP"}</dd>
          </div>
        </dl>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">Digital consent settings</h2>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          These preferences stay on this device. They do not replace the mandatory checkbox on each welfare request. Department APIs are called only after that authorization.
        </p>
        {consentError ? (
          <p className="mt-4 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-700" role="alert">
            {consentError}
          </p>
        ) : null}
        <ul className="mt-5 divide-y divide-slate-100">
          {TOGGLES.map((toggle) => {
            const enabled = consent[toggle.key];
            return (
              <li key={toggle.key} className="flex items-start justify-between gap-4 py-4">
                <div>
                  <p className="text-sm font-semibold text-slate-900">{toggle.label}</p>
                  <p className="mt-1 text-xs leading-5 text-slate-500">{toggle.detail}</p>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={enabled}
                  onClick={() => updateConsent({ [toggle.key]: !enabled })}
                  className={`relative mt-1 h-6 w-11 shrink-0 rounded-full transition focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                    enabled ? "bg-blue-600" : "bg-slate-300"
                  }`}
                >
                  <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition ${enabled ? "left-5" : "left-0.5"}`} />
                  <span className="sr-only">{enabled ? "On" : "Off"}</span>
                </button>
              </li>
            );
          })}
        </ul>
        <div className="mt-2 flex flex-col gap-3 border-t border-slate-100 pt-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-slate-500">{savedAt ? `Saved on this device ${savedAt}` : "No preferences saved yet."}</p>
          <button
            type="button"
            onClick={resetConsent}
            className="rounded-xl border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-400"
          >
            Reset preferences
          </button>
        </div>
      </section>
    </div>
  );
}
