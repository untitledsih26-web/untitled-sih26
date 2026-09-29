"use client";

import { Component, type ErrorInfo, type ReactNode } from "react";

interface ErrorBoundaryProps {
  children: ReactNode;
  title?: string;
}

interface ErrorBoundaryState {
  error: Error | null;
}

export class AppErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { error: null };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error("Sarkar Seva view failed", error, info.componentStack);
  }

  render(): ReactNode {
    if (!this.state.error) return this.props.children;

    return (
      <div className="mx-auto max-w-xl rounded-2xl border border-rose-200 bg-white p-6 shadow-sm" role="alert">
        <p className="text-xs font-semibold uppercase tracking-wide text-rose-700">Something interrupted this screen</p>
        <h2 className="mt-2 text-lg font-semibold text-slate-900">{this.props.title ?? "This view could not be displayed"}</h2>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          {this.state.error.message || "An unexpected error stopped this section. The rest of the session is unchanged."}
        </p>
        <button
          type="button"
          onClick={() => this.setState({ error: null })}
          className="mt-5 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2"
        >
          Try this screen again
        </button>
      </div>
    );
  }
}
