"use client";

import { usePortal } from "@/components/providers/portal-provider";
import type { AppView } from "@/lib/types";
import { ChevronsLeft, ChevronsRight, FileText, Home, LayoutDashboard, MessageSquare, ShieldCheck, X } from "lucide-react";
import type { LucideIcon } from "lucide-react";

const NAV_ITEMS: Array<{ id: AppView; label: string; icon: LucideIcon }> = [
  { id: "overview", label: "Landing / Overview", icon: Home },
  { id: "dashboard", label: "Department Dashboard", icon: LayoutDashboard },
  { id: "services", label: "Welfare Services", icon: FileText },
  { id: "inquiry", label: "Citizen Inquiry & Support", icon: MessageSquare },
  { id: "settings", label: "Account & Digital Consent", icon: ShieldCheck },
];

export function Sidebar() {
  const { view, setView, collapsed, setCollapsed, mobileOpen, setMobileOpen } = usePortal();

  function navigate(next: AppView) {
    setView(next);
    setMobileOpen(false);
  }

  return (
    <>
      {mobileOpen ? (
        <button
          type="button"
          aria-label="Close navigation"
          className="fixed inset-0 z-30 bg-slate-900/50 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      ) : null}
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex flex-col bg-slate-900 text-slate-300 transition-[width,transform] duration-200 ${
          collapsed ? "w-72 lg:w-[4.75rem]" : "w-72"
        } ${mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
      >
        <div className="flex items-center gap-3 border-b border-white/10 px-4 py-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-sm font-bold text-slate-900">
            SS
          </div>
          <div className={collapsed ? "min-w-0 lg:hidden" : "min-w-0"}>
            <p className="truncate text-sm font-semibold text-white">Sarkar Seva</p>
            <p className="truncate text-[11px] text-slate-400">SIH 2026 · GovTech</p>
          </div>
          <button
            type="button"
            className="ml-auto inline-flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-white/10 hover:text-white lg:hidden"
            onClick={() => setMobileOpen(false)}
            aria-label="Close sidebar"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="flex h-1" aria-hidden="true">
          <span className="flex-1 bg-[#FF9933]" />
          <span className="flex-1 bg-white" />
          <span className="flex-1 bg-[#138808]" />
        </div>
        <nav aria-label="Primary" className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const active = view === item.id;
            return (
              <button
                key={item.id}
                type="button"
                title={item.label}
                aria-current={active ? "page" : undefined}
                onClick={() => navigate(item.id)}
                className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition focus:outline-none focus:ring-2 focus:ring-blue-400 ${
                  active ? "bg-white/10 font-semibold text-white" : "hover:bg-white/5 hover:text-white"
                }`}
              >
                <Icon className="h-4 w-4 shrink-0" />
                <span className={collapsed ? "truncate lg:sr-only" : "truncate"}>{item.label}</span>
              </button>
            );
          })}
        </nav>
        <div className="border-t border-white/10 p-3">
          <button
            type="button"
            onClick={() => setCollapsed(!collapsed)}
            className="hidden w-full items-center justify-center gap-2 rounded-xl px-3 py-2 text-xs font-medium text-slate-400 hover:bg-white/5 hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-400 lg:flex"
            aria-pressed={collapsed}
          >
            {collapsed ? <ChevronsRight className="h-4 w-4" /> : <ChevronsLeft className="h-4 w-4" />}
            <span className={collapsed ? "sr-only" : ""}>{collapsed ? "Expand sidebar" : "Collapse sidebar"}</span>
          </button>
          <p className={`px-2 pt-3 text-[11px] leading-5 text-slate-500 ${collapsed ? "lg:hidden" : ""}`}>
            Consent-gated exchange across identity, revenue, land, and income systems.
          </p>
        </div>
      </aside>
    </>
  );
}
