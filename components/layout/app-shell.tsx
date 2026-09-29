"use client";

import { AppErrorBoundary } from "@/components/error-boundary";
import { Sidebar } from "@/components/layout/sidebar";
import { TopHeader } from "@/components/layout/header";
import { usePortal } from "@/components/providers/portal-provider";
import { DashboardView } from "@/components/views/dashboard-view";
import { InquiryView } from "@/components/views/inquiry-view";
import { OverviewView } from "@/components/views/overview-view";
import { SettingsView } from "@/components/views/settings-view";
import { WorkflowView } from "@/components/views/workflow-view";

export function AppShell() {
  const { view, collapsed } = usePortal();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-white focus:px-3 focus:py-2 focus:shadow"
      >
        Skip to content
      </a>
      <Sidebar />
      <div className={`min-h-screen transition-[padding] duration-200 ${collapsed ? "lg:pl-[4.75rem]" : "lg:pl-72"}`}>
        <TopHeader />
        <main id="main" className="px-4 py-6 sm:px-6 lg:px-8">
          <AppErrorBoundary key={view} title="This section hit an unexpected error">
            {view === "overview" ? <OverviewView /> : null}
            {view === "dashboard" ? <DashboardView /> : null}
            {view === "services" ? <WorkflowView /> : null}
            {view === "inquiry" ? <InquiryView /> : null}
            {view === "settings" ? <SettingsView /> : null}
          </AppErrorBoundary>
        </main>
      </div>
    </div>
  );
}
