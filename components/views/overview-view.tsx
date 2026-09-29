"use client";

import { useAuth } from "@/components/providers/auth-provider";
import { usePortal } from "@/components/providers/portal-provider";
import { PIPELINE_AGENTS } from "@/lib/domain";
import { displayName } from "@/lib/session";
import { ArrowRight, FileText, LayoutDashboard, MessageSquare, ShieldCheck } from "lucide-react";

export function OverviewView() {
  const { session } = useAuth();
  const { cases, setView, workflow, pipelineHealth } = usePortal();
  const name = session ? displayName(session) : "Citizen";
  const cleared = cases.filter((item) => item.status === "Cleared").length;
  const flagged = cases.filter((item) => item.flagged).length;
  const rejected = cases.filter((item) => item.status === "Rejected").length;

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-700">National interoperability portal</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">Welcome, {name}</h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
          File a welfare request once. Sarkar Seva asks for consent, then runs the LangGraph pipeline across identity, revenue, land, and income systems. Officers review only the files the validation agent flags.
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={() => setView("services")}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Start a welfare request
            <ArrowRight className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => setView("dashboard")}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-800 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2"
          >
            Open department dashboard
          </button>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "Pipeline agents", value: String(PIPELINE_AGENTS.length), detail: pipelineHealth === "online" ? "Service reachable" : "Status on the header" },
          { label: "Cleared files", value: String(cleared), detail: "Validation passed" },
          { label: "Open anomalies", value: String(flagged), detail: "Waiting on an officer" },
          { label: "Rejected", value: String(rejected), detail: "Needs a corrected match" },
        ].map((stat) => (
          <article key={stat.label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-medium text-slate-500">{stat.label}</p>
            <p className="mt-2 text-3xl font-semibold text-slate-900">{stat.value}</p>
            <p className="mt-1 text-xs text-slate-500">{stat.detail}</p>
          </article>
        ))}
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        {[
          {
            title: "Welfare Services",
            copy: "Five guided steps: details, consent, live agents, the exchange ledger, and a tracking summary.",
            icon: FileText,
            view: "services" as const,
          },
          {
            title: "Department Dashboard",
            copy: "Review cross-department requests and clear or reject validation anomalies.",
            icon: LayoutDashboard,
            view: "dashboard" as const,
          },
          {
            title: "Citizen Inquiry",
            copy: "Ask about eligibility, documents, consent, or the status of an application id.",
            icon: MessageSquare,
            view: "inquiry" as const,
          },
        ].map((card) => {
          const Icon = card.icon;
          return (
            <button
              key={card.title}
              type="button"
              onClick={() => setView(card.view)}
              className="rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:border-blue-300 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
                <Icon className="h-5 w-5" />
              </span>
              <h2 className="mt-4 text-base font-semibold text-slate-900">{card.title}</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">{card.copy}</p>
            </button>
          );
        })}
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-start gap-3">
          <ShieldCheck className="mt-0.5 h-5 w-5 text-emerald-600" />
          <div>
            <h2 className="text-base font-semibold text-slate-900">Your latest request</h2>
            {workflow.result ? (
              <p className="mt-2 text-sm leading-6 text-slate-600">
                {workflow.result.application_id} is {workflow.result.eligibility}. Decision: {workflow.result.decision}. Continue from Welfare Services to read the ledger or download the tracking summary.
              </p>
            ) : (
              <p className="mt-2 text-sm leading-6 text-slate-600">
                No request has been filed in this session. The department queue on the dashboard includes demonstration files until a new submission arrives.
              </p>
            )}
          </div>
        </div>
        <ol className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {PIPELINE_AGENTS.map((agent, index) => (
            <li key={agent.id} className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">0{index + 1}</p>
              <p className="mt-1 text-sm font-semibold text-slate-900">{agent.name}</p>
              <p className="text-xs text-slate-500">{agent.detail}</p>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}
