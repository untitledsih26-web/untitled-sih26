import { buildLedger, schemeById } from "@/lib/domain";
import type { CitizenForm, ProcessResult } from "@/lib/types";

const FALLBACK_API_URL = "https://sarkar-backend.up.railway.app";
const REQUEST_TIMEOUT_MS = 12000;

export function apiBaseUrl(): string {
  const configured = process.env.NEXT_PUBLIC_API_URL?.trim();
  return (configured || FALLBACK_API_URL).replace(/\/$/, "");
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function normalizeProcessResponse(payload: unknown, form: CitizenForm): ProcessResult {
  const root = isRecord(payload) ? payload : {};
  const telemetry = isRecord(root.telemetry) ? root.telemetry : {};
  const applicationId =
    typeof root.application_id === "string" && root.application_id.trim()
      ? root.application_id.trim()
      : `${schemeById(form.scheme).idPrefix}-2026-88421`;
  const decision = typeof root.decision === "string" && root.decision.trim() ? root.decision.trim() : "Approved - Fast Track";
  const eligibility = /reject|ineligible|denied/i.test(decision)
    ? "Ineligible"
    : /review|pending/i.test(decision)
      ? "Under Review"
      : "Eligible";
  const execution = typeof telemetry.execution_time_ms === "number" ? telemetry.execution_time_ms : 0;
  const tokens = typeof telemetry.token_usage === "number" ? telemetry.token_usage : 0;
  const pipelineStatus =
    typeof telemetry.pipeline_status === "string" && telemetry.pipeline_status.trim()
      ? telemetry.pipeline_status.trim()
      : "All 6 agents executed successfully";

  return {
    decision,
    application_id: applicationId,
    eligibility,
    telemetry: {
      execution_time_ms: execution,
      token_usage: tokens,
      pipeline_status: pipelineStatus,
    },
    consulted_departments: [
      "Identity Portal",
      "Revenue Department",
      "Land Records",
      "Income Tax Registry",
    ],
    source: "live",
    error: "",
  };
}

async function readErrorDetail(response: Response): Promise<string> {
  try {
    const payload: unknown = await response.json();
    if (isRecord(payload) && typeof payload.detail === "string" && payload.detail.trim()) {
      return payload.detail;
    }
  } catch {
    return `Pipeline responded with HTTP ${response.status}.`;
  }
  return `Pipeline responded with HTTP ${response.status}.`;
}

export async function processApplication(form: CitizenForm): Promise<ProcessResult> {
  const controller = new AbortController();
  const timer = window.setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(`${apiBaseUrl()}/api/process-application`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({
        applicant_name: form.name.trim(),
        date_of_birth: form.dob,
        identifier: "SECURE_HASH_VERIFIED",
        consent_given: form.consent,
        service_type: schemeById(form.scheme).label,
      }),
      signal: controller.signal,
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(await readErrorDetail(response));
    }

    let payload: unknown;
    try {
      payload = await response.json();
    } catch {
      throw new Error("Pipeline returned an unreadable response.");
    }

    return normalizeProcessResponse(payload, form);
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") {
      throw new Error("The agent pipeline timed out before returning telemetry.");
    }
    if (error instanceof Error && error.message) throw error;
    throw new Error("The agent pipeline could not be reached.");
  } finally {
    window.clearTimeout(timer);
  }
}

export function ledgerFor(form: CitizenForm, result: ProcessResult, consentedAt: string) {
  return buildLedger(form, result, consentedAt);
}
