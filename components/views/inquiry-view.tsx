"use client";

import { usePortal } from "@/components/providers/portal-provider";
import { QUICK_PROMPTS } from "@/lib/domain";
import { Loader2, Send } from "lucide-react";
import { useEffect, useRef, useState } from "react";

function formatTime(iso: string): string {
  return new Intl.DateTimeFormat("en-IN", { hour: "2-digit", minute: "2-digit" }).format(new Date(iso));
}

export function InquiryView() {
  const { messages, inquiryPending, ask, workflow } = usePortal();
  const [draft, setDraft] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, inquiryPending]);

  function submit(question: string) {
    const next = question.trim();
    if (!next || inquiryPending) return;
    setDraft("");
    void ask(next);
  }

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-4">
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-semibold text-slate-900">Citizen inquiry</h1>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          Ask about eligibility, documents, consent, or application status.
          {workflow.result ? ` This session includes ${workflow.result.application_id}.` : " File a request first if you need a live tracking id."}
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {QUICK_PROMPTS.map((prompt) => (
            <button
              key={prompt}
              type="button"
              disabled={inquiryPending}
              onClick={() => submit(prompt)}
              className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-700 hover:border-blue-300 hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {prompt}
            </button>
          ))}
        </div>
      </section>

      <section className="flex min-h-[28rem] flex-col rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex-1 space-y-4 overflow-y-auto px-4 py-5 sm:px-6" aria-live="polite">
          {messages.map((message) => (
            <article key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-6 ${
                  message.role === "user" ? "bg-blue-600 text-white" : "border border-slate-200 bg-slate-50 text-slate-800"
                }`}
              >
                <p>{message.content}</p>
                <p className={`mt-2 text-[11px] ${message.role === "user" ? "text-blue-100" : "text-slate-400"}`}>
                  {formatTime(message.timestamp)}
                </p>
              </div>
            </article>
          ))}
          {inquiryPending ? (
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              Checking the service record
            </div>
          ) : null}
          <div ref={bottomRef} />
        </div>
        <form
          className="border-t border-slate-100 p-4"
          onSubmit={(event) => {
            event.preventDefault();
            submit(draft);
          }}
        >
          <label htmlFor="inquiry" className="sr-only">
            Your question
          </label>
          <div className="flex items-end gap-2">
            <textarea
              id="inquiry"
              rows={2}
              maxLength={500}
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter" && !event.shiftKey) {
                  event.preventDefault();
                  submit(draft);
                }
              }}
              placeholder="Ask about a scheme, documents, or an application id"
              className="min-h-12 flex-1 resize-none rounded-xl border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30"
            />
            <button
              type="submit"
              disabled={inquiryPending || draft.trim().length === 0}
              className="inline-flex h-11 items-center gap-2 rounded-xl bg-slate-900 px-4 text-sm font-semibold text-white hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 disabled:opacity-50"
            >
              <Send className="h-4 w-4" />
              Send
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
