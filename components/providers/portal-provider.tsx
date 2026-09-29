"use client";

import { apiBaseUrl, ledgerFor, processApplication } from "@/lib/api";
import {
  DEFAULT_CONSENT,
  WELCOME_MESSAGE,
  answerInquiry,
  buildFallbackResult,
  createPendingAgents,
  initialAdminCases,
  initialWorkflow,
  schemeById,
  sleep,
} from "@/lib/domain";
import type {
  AdminCase,
  AppView,
  ChatMessage,
  ConsentPreferences,
  PipelineHealth,
  WorkflowState,
} from "@/lib/types";
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";

const CONSENT_STORAGE_KEY = "sarkar-seva.consent.v1";

interface PortalContextValue {
  view: AppView;
  setView: (view: AppView) => void;
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
  workflow: WorkflowState;
  updateWorkflow: (patch: Partial<WorkflowState>) => void;
  resetWorkflow: () => void;
  startPipeline: () => void;
  cases: AdminCase[];
  selectedCaseId: string;
  selectCase: (id: string) => void;
  resolveCase: (id: string, action: "approve" | "reject") => void;
  messages: ChatMessage[];
  inquiryPending: boolean;
  ask: (question: string) => Promise<void>;
  consent: ConsentPreferences;
  updateConsent: (patch: Partial<ConsentPreferences>) => void;
  resetConsent: () => void;
  consentError: string;
  pipelineHealth: PipelineHealth;
  refreshHealth: () => void;
}

const PortalContext = createContext<PortalContextValue | null>(null);

function loadConsent(): ConsentPreferences {
  if (typeof window === "undefined") return DEFAULT_CONSENT;
  try {
    const raw = window.localStorage.getItem(CONSENT_STORAGE_KEY);
    if (!raw) return DEFAULT_CONSENT;
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return DEFAULT_CONSENT;
    return { ...DEFAULT_CONSENT, ...(parsed as Partial<ConsentPreferences>) };
  } catch {
    return DEFAULT_CONSENT;
  }
}

function createMessage(role: ChatMessage["role"], content: string): ChatMessage {
  return {
    id: crypto.randomUUID(),
    role,
    content,
    timestamp: new Date().toISOString(),
  };
}

function welcomeMessage(): ChatMessage {
  return createMessage("assistant", WELCOME_MESSAGE);
}

export function PortalProvider({ children }: { children: ReactNode }) {
  const [view, setView] = useState<AppView>("overview");
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [workflow, setWorkflow] = useState<WorkflowState>(initialWorkflow);
  const [cases, setCases] = useState<AdminCase[]>(initialAdminCases);
  const [selectedCaseId, setSelectedCaseId] = useState(initialAdminCases()[1]?.id ?? "");
  const [messages, setMessages] = useState<ChatMessage[]>([welcomeMessage()]);
  const [inquiryPending, setInquiryPending] = useState(false);
  const [consent, setConsent] = useState<ConsentPreferences>(loadConsent);
  const [consentError, setConsentError] = useState("");
  const [pipelineHealth, setPipelineHealth] = useState<PipelineHealth>("checking");
  const workflowRef = useRef(workflow);
  const runningRef = useRef(false);
  const runToken = useRef(0);
  const healthRequest = useRef(0);

  useEffect(() => {
    workflowRef.current = workflow;
  }, [workflow]);

  const refreshHealth = useCallback(() => {
    const requestId = healthRequest.current + 1;
    healthRequest.current = requestId;
    const controller = new AbortController();
    const timer = window.setTimeout(() => controller.abort(), 5000);

    fetch(`${apiBaseUrl()}/`, { signal: controller.signal, cache: "no-store" })
      .then((response) => {
        if (healthRequest.current !== requestId) return;
        setPipelineHealth(response.ok ? "online" : "degraded");
      })
      .catch(() => {
        if (healthRequest.current !== requestId) return;
        setPipelineHealth("degraded");
      })
      .finally(() => window.clearTimeout(timer));
  }, []);

  useEffect(() => {
    refreshHealth();
    const interval = window.setInterval(refreshHealth, 30000);
    return () => window.clearInterval(interval);
  }, [refreshHealth]);

  const persistConsent = useCallback((next: ConsentPreferences) => {
    setConsent(next);
    try {
      window.localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(next));
      setConsentError("");
    } catch {
      setConsentError("Preferences could not be saved on this device.");
    }
  }, []);

  const updateWorkflow = useCallback((patch: Partial<WorkflowState>) => {
    setWorkflow((current) => ({ ...current, ...patch }));
  }, []);

  const resetWorkflow = useCallback(() => {
    runToken.current += 1;
    runningRef.current = false;
    setWorkflow(initialWorkflow());
  }, []);

  const registerApplication = useCallback((application: AdminCase) => {
    setCases((current) => [application, ...current.filter((item) => item.id !== application.id)]);
    setSelectedCaseId(application.id);
  }, []);

  const startPipeline = useCallback(() => {
    if (runningRef.current) return;
    const form = workflowRef.current.form;
    if (!form.consent) return;

    runningRef.current = true;
    const token = runToken.current + 1;
    runToken.current = token;
    const consentedAt = new Date().toISOString();
    setWorkflow((current) => ({
      ...current,
      step: 3,
      fieldError: "",
      apiStatus: "loading",
      apiError: "",
      result: null,
      ledger: [],
      consentGrantedAt: consentedAt,
      agents: createPendingAgents(),
    }));

    void (async () => {
      try {
      const fetchPromise = processApplication(form).then(
        (result) => ({ ok: true as const, result }),
        (error: unknown) => ({
          ok: false as const,
          reason: error instanceof Error ? error.message : "The agent pipeline could not be reached.",
        }),
      );

      const stageCount = createPendingAgents().length;
      for (let index = 0; index < stageCount; index += 1) {
        if (runToken.current !== token) return;
        const startedAt = Date.now();
        setWorkflow((current) => ({
          ...current,
          agents: current.agents.map((agent, agentIndex) =>
            agentIndex === index ? { ...agent, status: "running", startedAt } : agent,
          ),
        }));
        const started = Date.now();
        await sleep(480 + index * 90);
        if (runToken.current !== token) return;
        const latencyMs = Date.now() - started;
        setWorkflow((current) => ({
          ...current,
          agents: current.agents.map((agent, agentIndex) =>
            agentIndex === index ? { ...agent, status: "complete", latencyMs, startedAt } : agent,
          ),
        }));
      }

      const settled = await fetchPromise;
      if (runToken.current !== token) return;
      const agents = workflowRef.current.agents;
      const result = settled.ok ? settled.result : buildFallbackResult(form, agents, settled.reason);
      const ledger = ledgerFor(form, result, consentedAt);

      setWorkflow((current) => ({
        ...current,
        apiStatus: result.source === "live" ? "success" : "fallback",
        apiError: result.error,
        result,
        ledger,
      }));

      registerApplication({
        id: result.application_id,
        name: form.name.trim(),
        service: schemeById(form.scheme).label,
        status: result.eligibility === "Eligible" ? "Cleared" : "Anomaly Detected",
        flagged: result.eligibility !== "Eligible",
        revenueName: form.name.trim(),
        identityName: form.name.trim(),
        note:
          result.eligibility === "Eligible"
            ? "Citizen submission cleared by the validation agent in this session."
            : "Pipeline returned a review outcome for officer attention.",
        resolution: null,
      });
      } finally {
        if (runToken.current === token) runningRef.current = false;
      }
    })();
  }, [registerApplication]);

  const resolveCase = useCallback((id: string, action: "approve" | "reject") => {
    setCases((current) =>
      current.map((item) => {
        if (item.id !== id) return item;
        if (action === "approve") {
          return {
            ...item,
            status: "Cleared",
            flagged: false,
            resolution: "Exception approved. Validation status set to cleared.",
          };
        }
        return {
          ...item,
          status: "Rejected",
          flagged: false,
          resolution: "Request rejected. The applicant must submit a corrected identity match.",
        };
      }),
    );
    setSelectedCaseId(id);
  }, []);

  const ask = useCallback(async (question: string) => {
    const trimmed = question.trim();
    if (!trimmed || inquiryPending) return;
    setMessages((current) => [...current, createMessage("user", trimmed)]);
    setInquiryPending(true);
    await sleep(700);
    const currentWorkflow = workflowRef.current;
    const reply = answerInquiry(trimmed, {
      applicationId: currentWorkflow.result?.application_id ?? null,
      eligibility: currentWorkflow.result?.eligibility ?? null,
      decision: currentWorkflow.result?.decision ?? null,
      schemeLabel: schemeById(currentWorkflow.form.scheme).label,
    });
    setMessages((current) => [...current, createMessage("assistant", reply)]);
    setInquiryPending(false);
  }, [inquiryPending]);

  const value = useMemo<PortalContextValue>(
    () => ({
      view,
      setView,
      collapsed,
      setCollapsed,
      mobileOpen,
      setMobileOpen,
      workflow,
      updateWorkflow,
      resetWorkflow,
      startPipeline,
      cases,
      selectedCaseId,
      selectCase: setSelectedCaseId,
      resolveCase,
      messages,
      inquiryPending,
      ask,
      consent,
      updateConsent: (patch) =>
        persistConsent({ ...consent, ...patch, updatedAt: new Date().toISOString() }),
      resetConsent: () => persistConsent({ ...DEFAULT_CONSENT, updatedAt: new Date().toISOString() }),
      consentError,
      pipelineHealth,
      refreshHealth,
    }),
    [
      view,
      collapsed,
      mobileOpen,
      workflow,
      updateWorkflow,
      resetWorkflow,
      startPipeline,
      cases,
      selectedCaseId,
      resolveCase,
      messages,
      inquiryPending,
      ask,
      consent,
      persistConsent,
      consentError,
      pipelineHealth,
      refreshHealth,
    ],
  );

  return <PortalContext.Provider value={value}>{children}</PortalContext.Provider>;
}

export function usePortal(): PortalContextValue {
  const context = useContext(PortalContext);
  if (!context) throw new Error("usePortal must be used within PortalProvider");
  return context;
}
