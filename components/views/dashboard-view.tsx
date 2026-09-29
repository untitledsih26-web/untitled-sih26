"use client";

import { PipelineBadge } from "@/components/layout/pipeline-badge";
import { usePortal } from "@/components/providers/portal-provider";
import { PIPELINE_AGENTS } from "@/lib/domain";
import type { AdminCase } from "@/lib/types";
import { AlertTriangle, CheckCircle2, RefreshCw } from "lucide-react";

function statusBadge(item: AdminCase) {
  if (item.status === "Rejected") {
    return <span className="rounded-full bg-slate-200 px-2.5 py-1 text-xs font-medium text-slate-700">Rejected</span>;
  }
  if (item.flagged || item.status === "Anomaly Detected") {
    return <span className="rounded-full bg-amber-100 px-2.5 py-1 text-xs font-medium text-amber-800">Anomaly Detected</span>;
  }
  return <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-medium text-emerald-800">Cleared</span>;
}

export function DashboardView() {
  const { cases, selectedCaseId, selectCase, resolveCase, pipelineHealth, refreshHealth } = usePortal();
  const selected = cases.find((item) => item.id === selectedCaseId) ?? cases[0];
  const openAnomalies = cases.filter((item) => item.flagged).length;
  const mismatch = selected ? selected.revenueName.trim().toLowerCase() !== selected.identityName.trim().toLowerCase() : false;

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">System pulse</p>
            <h1 className="mt-1 text-2xl font-semibold text-slate-900">LangGraph pipeline</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
              {openAnomalies === 0
                ? "No open anomalies. Cleared files stay available in the interoperability queue."
                : `${openAnomalies} flagged ${openAnomalies === 1 ? "file needs" : "files need"} an approve or reject decision.`}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <PipelineBadge health={pipelineHealth} />
            <button
              type="button"
              onClick={refreshHealth}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              Refresh status
            </button>
          </div>
        </div>
        <ul className="mt-5 flex flex-wrap gap-2">
          {PIPELINE_AGENTS.map((agent) => (
            <li key={agent.id} className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-800">
              {agent.name}
            </li>
          ))}
        </ul>
      </section>

      <div className="grid gap-6 lg:grid-cols-3">
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm lg:col-span-2">
          <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
            <h2 className="text-sm font-semibold text-slate-900">Interoperability requests</h2>
            <span className="text-xs text-slate-500">Session queue</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-5 py-3 font-semibold">Application</th>
                  <th className="px-5 py-3 font-semibold">Applicant</th>
                  <th className="px-5 py-3 font-semibold">Service</th>
                  <th className="px-5 py-3 font-semibold">AI status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {cases.map((item) => {
                  const active = item.id === selected?.id;
                  return (
                    <tr
                      key={item.id}
                      onClick={() => selectCase(item.id)}
                      onKeyDown={(event) => {
                        if (event.key === "Enter" || event.key === " ") {
                          event.preventDefault();
                          selectCase(item.id);
                        }
                      }}
                      tabIndex={0}
                      aria-selected={active}
                      className={`cursor-pointer ${active ? "bg-blue-50/70" : item.flagged ? "bg-amber-50/40" : "hover:bg-slate-50"}`}
                    >
                      <td className="px-5 py-4 font-mono text-xs font-semibold text-slate-900">{item.id}</td>
                      <td className="px-5 py-4 text-sm text-slate-800">{item.name}</td>
                      <td className="px-5 py-4 text-sm text-slate-600">{item.service}</td>
                      <td className="px-5 py-4">{statusBadge(item)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>

        <section className="flex flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between gap-3 border-b border-slate-100 pb-3">
            <h2 className="text-sm font-semibold text-slate-900">AI validation review</h2>
            {selected?.flagged ? (
              <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[11px] font-semibold text-amber-800">Action required</span>
            ) : (
              <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-600">On record</span>
            )}
          </div>
          {selected ? (
            <div className="mt-4 space-y-3 text-sm text-slate-700">
              <p>
                <span className="font-semibold text-slate-900">{selected.id}</span>
                <span className="text-slate-500"> · {selected.name}</span>
              </p>
              <p className="text-xs leading-5 text-slate-600">{selected.note}</p>
              <div className={`rounded-xl border px-3 py-2 ${mismatch ? "border-rose-200 bg-rose-50" : "border-slate-200 bg-slate-50"}`}>
                <div className="flex items-center justify-between gap-3 text-xs">
                  <span className="text-slate-500">Revenue Dept</span>
                  <span className={`font-semibold ${mismatch ? "text-rose-700" : "text-slate-900"}`}>{selected.revenueName}</span>
                </div>
              </div>
              <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
                <div className="flex items-center justify-between gap-3 text-xs">
                  <span className="text-slate-500">Identity Portal</span>
                  <span className="font-semibold text-slate-900">{selected.identityName}</span>
                </div>
              </div>
              {selected.resolution ? (
                <p className="flex items-start gap-2 rounded-xl bg-slate-50 px-3 py-2 text-xs leading-5 text-slate-700" role="status">
                  {selected.status === "Cleared" ? <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" /> : <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />}
                  {selected.resolution}
                </p>
              ) : null}
            </div>
          ) : (
            <p className="mt-4 text-sm text-slate-500">Select a request from the queue.</p>
          )}
          <div className="mt-6 grid grid-cols-2 gap-3">
            <button
              type="button"
              disabled={!selected || selected.status === "Cleared"}
              onClick={() => selected && resolveCase(selected.id, "approve")}
              className="rounded-xl bg-blue-600 px-3 py-2.5 text-xs font-semibold text-white hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Approve Exception
            </button>
            <button
              type="button"
              disabled={!selected || selected.status === "Rejected"}
              onClick={() => selected && resolveCase(selected.id, "reject")}
              className="rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-xs font-semibold text-slate-800 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Reject
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
