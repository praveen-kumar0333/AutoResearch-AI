import { useLocation } from "wouter";
import { motion } from "framer-motion";
import {
  History as HistoryIcon,
  FileText,
  Clock,
  CheckCircle,
  AlertCircle,
  Loader2,
  ChevronRight,
  Search,
} from "lucide-react";
import { useGetHistory, useDeleteReport } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useQueryClient } from "@tanstack/react-query";
import { getGetHistoryQueryKey } from "@workspace/api-client-react";

const STATUS_COLORS: Record<string, string> = {
  completed: "text-green-500 bg-green-500/10",
  running: "text-blue-500 bg-blue-500/10",
  pending: "text-yellow-500 bg-yellow-500/10",
  failed: "text-red-500 bg-red-500/10",
};

const STATUS_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  completed: CheckCircle,
  running: Loader2,
  pending: Clock,
  failed: AlertCircle,
};

export default function History() {
  const [, navigate] = useLocation();
  const { data: history, isLoading } = useGetHistory({ limit: 50 });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const entries = history || [];

  return (
    <div className="flex flex-col h-full overflow-auto">
      <div className="px-6 py-5 border-b border-border">
        <h1 className="text-lg font-bold">Research History</h1>
        <p className="text-xs text-muted-foreground mt-0.5">{entries.length} research sessions</p>
      </div>

      <div className="flex-1 p-6 max-w-3xl mx-auto w-full">
        {entries.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64">
            <Search className="w-10 h-10 text-muted-foreground mb-3 opacity-50" />
            <h3 className="font-semibold mb-1">No research history yet</h3>
            <p className="text-sm text-muted-foreground mb-4">Start your first research session to see it here</p>
            <Button onClick={() => navigate("/dashboard")}>Start Researching</Button>
          </div>
        ) : (
          <div className="space-y-2">
            {entries.map((entry, i) => {
              const StatusIcon = STATUS_ICONS[entry.status] || Clock;
              return (
                <motion.div
                  key={entry.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className="flex items-center gap-4 p-4 rounded-xl border border-border bg-card hover:border-primary/30 transition-all cursor-pointer group"
                  onClick={() => {
                    if (entry.reportId) navigate(`/reports/${entry.reportId}`);
                    else if (entry.status === "running" || entry.status === "pending") navigate(`/research/${entry.id}`);
                  }}
                >
                  <div className={cn("w-9 h-9 rounded-lg flex items-center justify-center shrink-0", STATUS_COLORS[entry.status])}>
                    <StatusIcon className={cn("w-4 h-4", entry.status === "running" && "animate-spin")} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium leading-tight truncate">{entry.topic}</p>
                    <p className="text-xs text-muted-foreground mt-0.5 capitalize">
                      {entry.mode} · {new Date(entry.createdAt).toLocaleDateString()} · {entry.status}
                    </p>
                  </div>
                  {entry.reportId && (
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="hidden sm:inline text-xs text-muted-foreground flex items-center gap-1">
                        <FileText className="w-3 h-3" />
                        Report Ready
                      </span>
                      <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
