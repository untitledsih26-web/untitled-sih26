"use client";

import { supabase } from "@/lib/supabase";
import type { Session, SupabaseClient } from "@supabase/supabase-js";
import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

interface AuthContextValue {
  session: Session | null;
  initializing: boolean;
  configured: boolean;
  supabase: SupabaseClient | null;
  adoptSession: (session: Session | null) => void;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [initializing, setInitializing] = useState(Boolean(supabase));

  useEffect(() => {
    if (!supabase) return;

    let cancelled = false;
    supabase.auth
      .getSession()
      .then(({ data, error }) => {
        if (cancelled) return;
        setSession(error ? null : data.session);
        setInitializing(false);
      })
      .catch(() => {
        if (cancelled) return;
        setSession(null);
        setInitializing(false);
      });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      setInitializing(false);
    });

    return () => {
      cancelled = true;
      subscription.unsubscribe();
    };
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      session,
      initializing,
      configured: Boolean(supabase),
      supabase,
      adoptSession: setSession,
      signOut: async () => {
        if (!supabase) {
          setSession(null);
          return;
        }
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
        setSession(null);
      },
    }),
    [session, initializing],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
