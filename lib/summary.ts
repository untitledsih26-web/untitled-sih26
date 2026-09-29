import { displayedExecution, maskName, schemeById } from "@/lib/domain";
import type { AgentRun, CitizenForm, ProcessResult } from "@/lib/types";

export function trackingSummaryText(
  form: CitizenForm,
  result: ProcessResult,
  agents: AgentRun[],
  consentedAt: string | null,
): string {
  const scheme = schemeById(form.scheme);
  const lines = [
    "SARKAR SEVA — APPLICATION TRACKING SUMMARY",
    "SIH 2026",
    "",
    `Application ID: ${result.application_id}`,
    `Service: ${scheme.label}`,
    `Applicant: ${form.name.trim()}`,
    `Date of birth: ${form.dob}`,
    `Identifier: ${form.aadhaarRef}`,
    `Eligibility: ${result.eligibility}`,
    `Decision: ${result.decision}`,
    `Consent granted: ${consentedAt ?? "recorded"}`,
    `Telemetry source: ${result.source === "live" ? "Live pipeline" : "Cached trace"}`,
    `Execution time: ${displayedExecution(result, agents)} ms`,
    `Token usage: ${result.telemetry.token_usage}`,
    `Pipeline: ${result.telemetry.pipeline_status}`,
    "",
    "Consulted departments:",
    ...result.consulted_departments.map((department) => `- ${department}`),
    "",
    "Agent trace:",
    ...agents.map((agent) => `- ${agent.name} (${agent.detail}): ${agent.status}, ${agent.latencyMs ?? 0} ms`),
    "",
    "Privacy: department payloads in the interoperability ledger use masked names",
    `and redacted identifiers. Ledger name preview: ${maskName(form.name)}`,
    "",
    "This summary is generated for the signed-in citizen session.",
  ];
  return lines.join("\n");
}

export function downloadTextFile(filename: string, contents: string): void {
  const blob = new Blob([contents], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}
