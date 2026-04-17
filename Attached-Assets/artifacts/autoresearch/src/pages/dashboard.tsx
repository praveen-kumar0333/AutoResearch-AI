import { useState } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import {
  Search,
  Zap,
  FileText,
  Clock,
  TrendingUp,
  Users,
  Brain,
  BarChart3,
  ChevronRight,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  useStartResearch,
  useListReports,
  useGetStats,
  useGetTopicSuggestions,
} from "@workspace/api-client-react";
import { cn } from "@/lib/utils";
import { useQueryClient } from "@tanstack/react-query";
import { getListReportsQueryKey, getGetHistoryQueryKey } from "@workspace/api-client-react";

const modes = [
  { id: "general", label: "General", icon: Search },
  { id: "student", label: "Student", icon: Users },
  { id: "startup", label: "Startup", icon: Zap },
  { id: "investor", label: "Investor", icon: TrendingUp },
  { id: "researcher", label: "Researcher", icon: Brain },
  { id: "marketing", label: "Marketing", icon: BarChart3 },
] as const;

type Mode = "general" | "student" | "startup" | "investor" | "researcher" | "marketing";

export default function Dashboard() {
  const [topic, setTopic] = useState("");
  const [mode, setMode] = useState<Mode>("general");
  const [, navigate] = useLocation();
  const queryClient = useQueryClient();

  const startResearch = useStartResearch();
  const { data: reports } = useListReports({ limit: 5 });
  const { data: stats } = useGetStats();
  const { data: suggestions } = useGetTopicSuggestions();

  const handleSubmit = async (topicOverride?: string) => {
    const finalTopic = topicOverride || topic;
    if (!finalTopic.trim()) return;

    try {
      const session = await startResearch.mutateAsync({ data: { topic: finalTopic, mode } });
      queryClient.invalidateQueries({ queryKey: getListReportsQueryKey() });
      queryClient.invalidateQueries({ queryKey: getGetHistoryQueryKey() });
      navigate(`/research/${session.id}`);
    } catch (err) {
      console.error("Failed to start research:", err);
    }
  };

  const recentReports = reports?.slice(0, 5) || [];
  const topicSuggestions = suggestions?.slice(0, 8) || [];

  return (
    <div className="flex flex-col h-full overflow-auto">
      <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b border-border px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold">Research Dashboard</h1>
            <p className="text-xs text-muted-foreground">Launch your autonomous multi-agent research workflow</p>
          </div>
          {stats && (
            <div className="hidden sm:flex items-center gap-6">
              <div className="text-center">
                <p className="text-xl font-bold text-primary">{stats.totalResearches}</p>
                <p className="text-xs text-muted-foreground">Researches</p>
              </div>
              <div className="text-center">
                <p className="text-xl font-bold text-green-500">{stats.totalTimeSaved}m</p>
                <p className="text-xs text-muted-foreground">Time Saved</p>
              </div>
              <div className="text-center">
                <p className="text-xl font-bold text-amber-500">{Math.round(stats.avgConfidenceScore)}%</p>
                <p className="text-xs text-muted-foreground">Avg Confidence</p>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="flex-1 p-6 max-w-4xl mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-8"
        >
          <div className="p-6 rounded-2xl border border-border bg-card shadow-sm">
            <h2 className="text-base font-semibold mb-4">What would you like to research?</h2>
            <div className="relative mb-4">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                placeholder="e.g. AI Trends 2026, EV Battery Innovation, Startup Funding India..."
                className="w-full pl-10 pr-4 py-3 text-sm bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 placeholder:text-muted-foreground/60"
              />
            </div>

            <div className="mb-4">
              <p className="text-xs text-muted-foreground mb-2 font-medium">Research Mode</p>
              <div className="flex flex-wrap gap-2">
                {modes.map(({ id, label, icon: Icon }) => (
                  <button
                    key={id}
                    onClick={() => setMode(id)}
                    className={cn(
                      "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all",
                      mode === id
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                    )}
                  >
                    <Icon className="w-3 h-3" />
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <Button
              onClick={() => handleSubmit()}
              disabled={!topic.trim() || startResearch.isPending}
              className="w-full gap-2"
              size="lg"
            >
              {startResearch.isPending ? (
                <>
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  Starting Research...
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4" />
                  Launch Research Workflow
                </>
              )}
            </Button>
          </div>
        </motion.div>

        {topicSuggestions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="mb-8"
          >
            <p className="text-sm font-semibold mb-3 text-muted-foreground">Quick Start Examples</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {topicSuggestions.map((s, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setTopic(s.topic);
                    setMode(s.mode as Mode);
                  }}
                  className="flex items-center justify-between p-3 rounded-xl border border-border bg-card/50 hover:bg-card hover:border-primary/30 transition-all text-left group"
                >
                  <div>
                    <p className="text-sm font-medium leading-tight">{s.topic}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{s.category} — {s.mode}</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0 ml-2" />
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {recentReports.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            <p className="text-sm font-semibold mb-3 text-muted-foreground">Recent Reports</p>
            <div className="space-y-2">
              {recentReports.map((report, i) => (
                <motion.a
                  key={report.id}
                  href={`/reports/${report.id}`}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="flex items-center justify-between p-3.5 rounded-xl border border-border bg-card hover:border-primary/30 transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <FileText className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium leading-tight">{report.topic}</p>
                      <p className="text-xs text-muted-foreground">
                        {report.mode} · {Math.round(report.confidenceScore)}% confidence
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="hidden sm:flex items-center gap-1 text-xs text-green-500">
                      <Clock className="w-3 h-3" />
                      {report.timeSavedMinutes}m saved
                    </span>
                    <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                </motion.a>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
