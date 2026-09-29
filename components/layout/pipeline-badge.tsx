import type { PipelineHealth } from "@/lib/types";

export function PipelineBadge({ health }: { health: PipelineHealth }) {
  const online = health === "online";
  const checking = health === "checking";
  const label = checking
    ? "LangGraph Agents: Checking"
    : online
      ? "LangGraph Agents: Online"
      : "LangGraph Agents: Standby";
  const tone = checking
    ? "border-slate-200 bg-slate-50 text-slate-600"
    : online
      ? "border-emerald-200 bg-emerald-50 text-emerald-800"
      : "border-amber-200 bg-amber-50 text-amber-800";
  const dot = checking ? "bg-slate-400" : online ? "bg-emerald-500" : "bg-amber-500";

  return (
    <span className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium ${tone}`}>
      <span className="relative flex h-2 w-2">
        {online ? (
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75 motion-reduce:animate-none" />
        ) : null}
        <span className={`relative inline-flex h-2 w-2 rounded-full ${dot}`} />
      </span>
      {label}
    </span>
  );
}
