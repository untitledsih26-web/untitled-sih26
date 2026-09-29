"use client";

import { useAuth } from "@/components/providers/auth-provider";
import { PipelineBadge } from "@/components/layout/pipeline-badge";
import { usePortal } from "@/components/providers/portal-provider";
import { displayContact, displayName, initials } from "@/lib/session";
import { Loader2, LogOut, Menu } from "lucide-react";
import { useState } from "react";

const VIEW_TITLES = {
  overview: "Landing / Overview",
  dashboard: "Department Dashboard",
  services: "Welfare Services",
  inquiry: "Citizen Inquiry & Support",
  settings: "Account & Digital Consent",
} as const;

export function TopHeader() {
  const { session, signOut } = useAuth();
  const { view, setMobileOpen, pipelineHealth } = usePortal();
  const [signingOut, setSigningOut] = useState(false);
  const [signOutError, setSignOutError] = useState("");

  if (!session) return null;

  const name = displayName(session);
  const contact = displayContact(session);

  async function handleSignOut() {
    setSigningOut(true);
    setSignOutError("");
    try {
      await signOut();
    } catch (error) {
      setSignOutError(error instanceof Error ? error.message : "Sign out failed. Try again.");
      setSigningOut(false);
    }
  }

  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="flex items-center gap-3 px-4 py-3 sm:px-6">
        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 lg:hidden"
          onClick={() => setMobileOpen(true)}
          aria-label="Open navigation"
        >
          <Menu className="h-5 w-5" />
        </button>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-slate-900">{VIEW_TITLES[view]}</p>
          <p className="truncate text-xs text-slate-500">Sarkar Seva · SIH 2026</p>
        </div>
        <div className="hidden md:block">
          <PipelineBadge health={pipelineHealth} />
        </div>
        <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 py-1 pl-1 pr-3">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-900 text-xs font-semibold text-white">
            {initials(name)}
          </span>
          <span className="hidden min-w-0 sm:block">
            <span className="block max-w-40 truncate text-xs font-semibold text-slate-900">{name}</span>
            <span className="block max-w-40 truncate text-[11px] text-slate-500">{contact}</span>
          </span>
        </div>
        <button
          type="button"
          onClick={() => void handleSignOut()}
          disabled={signingOut}
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-60"
        >
          {signingOut ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <LogOut className="h-3.5 w-3.5" />}
          <span className="hidden sm:inline">Sign Out</span>
        </button>
      </div>
      {signOutError ? (
        <p className="border-t border-rose-100 bg-rose-50 px-4 py-2 text-xs text-rose-700 sm:px-6" role="alert">
          {signOutError}
        </p>
      ) : null}
      <div className="border-t border-slate-100 px-4 py-2 md:hidden">
        <PipelineBadge health={pipelineHealth} />
      </div>
    </header>
  );
}
