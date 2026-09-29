"use client";

import { usePortal } from "@/components/providers/portal-provider";
import { displayedExecution, SCHEMES, schemeById, todayInputValue, validateCitizenForm } from "@/lib/domain";
import { downloadTextFile, trackingSummaryText } from "@/lib/summary";
import type { AgentRun } from "@/lib/types";
import { AlertTriangle, CheckCircle2, Download, Loader2, Lock } from "lucide-react";
import { useEffect, useState } from "react";

const STEPS = ["Request", "Consent", "Agents", "Exchange", "Result"] as const;

const inputClass =
  "w-full rounded-xl border border-slate-300 bg-white px-3 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30";

function Stepper({ step }: { step: number }) {
  return (
    <ol className="grid grid-cols-5 gap-2">
      {STEPS.map((label, index) => {
        const current = index + 1;
        const active = step === current;
        const done = step > current;
        return (
          <li key={label} className="min-w-0">
            <div className={`h-1.5 rounded-full ${done || active ? "bg-blue-600" : "bg-slate-200"}`} />
            <p className={`mt-2 truncate text-[11px] font-semibold ${active ? "text-blue-700" : "text-slate-500"}`}>
              {current}. {label}
            </p>
          </li>
        );
      })}
    </ol>
  );
}

function AgentTrace({ agents }: { agents: AgentRun[] }) {
  const [now, setNow] = useState(() => Date.now());
  const running = agents.some((agent) => agent.status === "running");

  useEffect(() => {
    if (!running) return;
    const timer = window.setInterval(() => setNow(Date.now()), 80);
    return () => window.clearInterval(timer);
  }, [running]);

  return (
    <ol className="space-y-3">
      {agents.map((agent, index) => {
        const elapsed = agent.status === "running" && agent.startedAt ? Math.max(0, now - agent.startedAt) : agent.latencyMs;
        return (
          <li key={agent.id} className="flex gap-3">
            <div className="flex flex-col items-center">
              <span className="relative flex h-3 w-3">
                {agent.status === "running" ? (
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-400 opacity-75 motion-reduce:animate-none" />
                ) : null}
                <span
                  className={`relative h-3 w-3 rounded-full ${
                    agent.status === "complete" ? "bg-emerald-500" : agent.status === "running" ? "bg-blue-600" : "bg-slate-300"
                  }`}
                />
              </span>
              {index < agents.length - 1 ? <span className="mt-1 w-px flex-1 bg-slate-200" /> : null}
            </div>
            <div className="flex min-w-0 flex-1 items-start justify-between gap-3 rounded-xl border border-slate-200 bg-slate-50 px-3 py-3">
              <div>
                <p className="text-sm font-semibold text-slate-900">{agent.name}</p>
                <p className="text-xs text-slate-500">{agent.detail}</p>
              </div>
              <div className="text-right">
                <p className="font-mono text-xs text-slate-700">{elapsed === null ? "Queued" : `${elapsed} ms`}</p>
                <p className="text-[11px] uppercase tracking-wide text-slate-500">{agent.status}</p>
              </div>
            </div>
          </li>
        );
      })}
    </ol>
  );
}

export function WorkflowView() {
  const { workflow, updateWorkflow, startPipeline, resetWorkflow } = usePortal();
  const { step, form, fieldError, agents, apiStatus, apiError, result, ledger } = workflow;
  const [copied, setCopied] = useState(false);
  const pipelineReady = apiStatus === "success" || apiStatus === "fallback";
  const agentsReady = agents.every((agent) => agent.status === "complete");

  function continueFromDetails() {
    const error = validateCitizenForm(form);
    if (error) {
      updateWorkflow({ fieldError: error });
      return;
    }
    updateWorkflow({ step: 2, fieldError: "" });
  }

  async function copyId(applicationId: string) {
    try {
      await navigator.clipboard.writeText(applicationId);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className="mx-auto max-w-3xl space-y-5">
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-blue-700">Citizen service workflow</p>
            <h1 className="mt-1 text-2xl font-semibold text-slate-900">{schemeById(form.scheme).label}</h1>
          </div>
          <p className="text-xs text-slate-500">Identifier {form.aadhaarRef}</p>
        </div>
        <div className="mt-5">
          <Stepper step={step} />
        </div>
      </section>

      {step === 1 ? (
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <h2 className="text-lg font-semibold text-slate-900">Request review and details</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Enter the details once. Linked department records are fetched later, and only after you authorize the consent gate.
          </p>
          {fieldError ? (
            <p className="mt-4 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700" role="alert">
              {fieldError}
            </p>
          ) : null}
          <div className="mt-5 space-y-4">
            <label className="block text-xs font-semibold text-slate-700">
              Full name
              <input
                value={form.name}
                onChange={(event) => updateWorkflow({ form: { ...form, name: event.target.value }, fieldError: "" })}
                autoComplete="name"
                className={`${inputClass} mt-1`}
                placeholder="Name on the identity record"
              />
            </label>
            <label className="block text-xs font-semibold text-slate-700">
              Date of birth
              <input
                type="date"
                max={todayInputValue()}
                value={form.dob}
                onChange={(event) => updateWorkflow({ form: { ...form, dob: event.target.value }, fieldError: "" })}
                className={`${inputClass} mt-1`}
              />
            </label>
            <label className="block text-xs font-semibold text-slate-700">
              Secure identifier
              <input value={form.aadhaarRef} disabled className={`${inputClass} mt-1 cursor-not-allowed bg-slate-100 font-mono text-slate-500`} />
            </label>
            <fieldset>
              <legend className="text-xs font-semibold text-slate-700">Welfare scheme</legend>
              <div className="mt-2 grid gap-3">
                {SCHEMES.map((scheme) => {
                  const selected = form.scheme === scheme.id;
                  return (
                    <label
                      key={scheme.id}
                      className={`cursor-pointer rounded-xl border px-4 py-3 ${selected ? "border-blue-500 bg-blue-50" : "border-slate-200 bg-white"}`}
                    >
                      <span className="flex items-start gap-3">
                        <input
                          type="radio"
                          name="scheme"
                          checked={selected}
                          onChange={() => updateWorkflow({ form: { ...form, scheme: scheme.id } })}
                          className="mt-1"
                        />
                        <span>
                          <span className="block text-sm font-semibold text-slate-900">{scheme.label}</span>
                          <span className="mt-1 block text-xs leading-5 text-slate-500">{scheme.summary}</span>
                        </span>
                      </span>
                    </label>
                  );
                })}
              </div>
            </fieldset>
          </div>
          <button
            type="button"
            onClick={continueFromDetails}
            className="mt-6 w-full rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Continue to consent
          </button>
        </section>
      ) : null}

      {step === 2 ? (
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex items-start gap-3">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
              <Lock className="h-5 w-5" />
            </span>
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Consent and authorization</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Explicit digital consent is required before Sarkar Seva can query linked government databases through secure standardized APIs.
              </p>
            </div>
          </div>
          <div className="mt-5 rounded-xl border border-blue-100 bg-blue-50 px-4 py-4 text-sm leading-6 text-blue-950">
            <p className="font-semibold">Data-fetching notice</p>
            <p className="mt-1">With this authorization, the pipeline may read:</p>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              <li>Land Records — holding status, parcel reference redacted</li>
              <li>Revenue Department — household band and allotment flag</li>
              <li>Identity Portal — name and date-of-birth match</li>
              <li>Income Tax Registry — income band, PAN masked</li>
            </ul>
          </div>
          <label className="mt-5 flex items-start gap-3 rounded-xl border border-slate-200 px-4 py-3">
            <input
              type="checkbox"
              checked={form.consent}
              onChange={(event) => updateWorkflow({ form: { ...form, consent: event.target.checked } })}
              className="mt-1 h-4 w-4"
            />
            <span className="text-sm leading-6 text-slate-700">
              I authorize Sarkar Seva to query the linked departmental databases for this {schemeById(form.scheme).label} request. I understand the identifier remains {form.aadhaarRef}.
            </span>
          </label>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() => updateWorkflow({ step: 1 })}
              className="rounded-xl border border-slate-300 px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              Back
            </button>
            <button
              type="button"
              disabled={!form.consent || apiStatus === "loading"}
              onClick={startPipeline}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-500 disabled:opacity-50"
            >
              {apiStatus === "loading" ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              Authorize and run pipeline
            </button>
          </div>
        </section>
      ) : null}

      {step === 3 ? (
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <h2 className="text-lg font-semibold text-slate-900">Multi-agent orchestration</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            The request is moving through the LangGraph pipeline. Stage timers update while each agent is running.
          </p>
          {apiError ? (
            <p className="mt-4 flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 px-3 py-3 text-sm leading-6 text-amber-900" role="alert">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
              <span>
                {apiError} A cached trace is shown so you can review the exchange and download a tracking summary.
              </span>
            </p>
          ) : null}
          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            <article className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-3">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">execution_time_ms</p>
              <p className="mt-1 font-mono text-lg text-slate-900">
                {result ? displayedExecution(result, agents) : agentsReady ? "…" : "Live"}
              </p>
            </article>
            <article className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-3">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">token usage</p>
              <p className="mt-1 font-mono text-lg text-slate-900">{result ? result.telemetry.token_usage : "…"}</p>
            </article>
            <article className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-3">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">Source</p>
              <p className="mt-1 text-sm font-semibold text-slate-900">
                {apiStatus === "loading" ? "Contacting pipeline" : result?.source === "live" ? "Live API" : "Cached trace"}
              </p>
            </article>
          </div>
          {result ? <p className="mt-3 text-xs leading-5 text-slate-500">{result.telemetry.pipeline_status}</p> : null}
          <div className="mt-5">
            <AgentTrace agents={agents} />
          </div>
          <button
            type="button"
            disabled={!pipelineReady || !agentsReady}
            onClick={() => updateWorkflow({ step: 4 })}
            className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-50"
          >
            {pipelineReady && agentsReady ? "Open interoperability ledger" : "Waiting for the pipeline"}
            {!(pipelineReady && agentsReady) ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
          </button>
        </section>
      ) : null}

      {step === 4 && result ? (
        <section className="space-y-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <h2 className="text-lg font-semibold text-slate-900">Data exchange</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Standardized payloads exchanged for {result.application_id}. Names are masked and identity numbers are redacted.
            </p>
          </div>
          {ledger.map((entry) => (
            <article key={entry.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="text-sm font-semibold text-slate-900">{entry.system}</h3>
                <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-slate-600">
                  {entry.direction}
                </span>
              </div>
              <pre className="mt-3 overflow-x-auto rounded-xl bg-slate-950 p-4 text-xs leading-5 text-slate-100">
                {JSON.stringify(entry.payload, null, 2)}
              </pre>
            </article>
          ))}
          <button
            type="button"
            onClick={() => updateWorkflow({ step: 5 })}
            className="w-full rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-500"
          >
            View final result
          </button>
        </section>
      ) : null}

      {step === 5 && result ? (
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center">
            <span
              className={`inline-flex h-12 w-12 items-center justify-center rounded-full ${
                result.eligibility === "Eligible" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
              }`}
            >
              {result.eligibility === "Eligible" ? <CheckCircle2 className="h-6 w-6" /> : <AlertTriangle className="h-6 w-6" />}
            </span>
            <div>
              <h2 className="text-xl font-semibold text-slate-900">
                {result.eligibility === "Eligible" ? "Application verified" : result.eligibility}
              </h2>
              <p className="text-sm text-slate-600">{result.decision}</p>
            </div>
          </div>
          <dl className="mt-6 grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
              <dt className="text-xs text-slate-500">Application ID</dt>
              <dd className="mt-1 font-mono text-sm font-semibold text-blue-700">{result.application_id}</dd>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
              <dt className="text-xs text-slate-500">Applicant</dt>
              <dd className="mt-1 text-sm font-semibold text-slate-900">{form.name.trim()}</dd>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
              <dt className="text-xs text-slate-500">execution_time_ms</dt>
              <dd className="mt-1 font-mono text-sm text-slate-900">{displayedExecution(result, agents)}</dd>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
              <dt className="text-xs text-slate-500">Token usage</dt>
              <dd className="mt-1 font-mono text-sm text-slate-900">{result.telemetry.token_usage}</dd>
            </div>
          </dl>
          <div className="mt-5">
            <h3 className="text-sm font-semibold text-slate-900">Consulted department logs</h3>
            <ul className="mt-2 space-y-2">
              {result.consulted_departments.map((department) => (
                <li key={department} className="flex items-center justify-between rounded-xl border border-slate-200 px-3 py-2 text-sm">
                  <span>{department}</span>
                  <span className="text-xs font-semibold text-emerald-700">Responded</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() => void copyId(result.application_id)}
              className="rounded-xl border border-slate-300 px-4 py-3 text-sm font-semibold text-slate-800 hover:bg-slate-50"
            >
              {copied ? "Application ID copied" : "Copy application ID"}
            </button>
            <button
              type="button"
              onClick={() =>
                downloadTextFile(
                  `${result.application_id}-tracking-summary.txt`,
                  trackingSummaryText(form, result, agents, workflow.consentGrantedAt),
                )
              }
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white hover:bg-slate-800"
            >
              <Download className="h-4 w-4" />
              Download tracking summary
            </button>
          </div>
          <button
            type="button"
            onClick={resetWorkflow}
            className="mt-3 w-full rounded-xl border border-slate-300 px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            File another request
          </button>
        </section>
      ) : null}
    </div>
  );
}
