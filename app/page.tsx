"use client";

import { LoginView } from "@/components/auth/login-view";
import { AppErrorBoundary } from "@/components/error-boundary";
import { AppShell } from "@/components/layout/app-shell";
import { AuthProvider, useAuth } from "@/components/providers/auth-provider";
import { PortalProvider } from "@/components/providers/portal-provider";
import { Loader2 } from "lucide-react";

function Gate() {
  const { session, initializing } = useAuth();

  if (initializing) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-slate-200">
        <Loader2 className="h-6 w-6 animate-spin" aria-hidden="true" />
        <span className="sr-only">Checking your session</span>
      </div>
    );
  }

  if (!session) return <LoginView />;

  return (
    <PortalProvider>
      <AppShell />
    </PortalProvider>
  );
}

export default function HomePage() {
  return (
    <AppErrorBoundary title="Sarkar Seva could not start">
      <AuthProvider>
        <Gate />
      </AuthProvider>
    </AppErrorBoundary>
  );
}
