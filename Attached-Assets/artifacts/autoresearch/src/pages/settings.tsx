import { motion } from "framer-motion";
import { Sun, Moon, Monitor, Brain, Zap } from "lucide-react";
import { useTheme } from "@/components/theme-provider";
import { cn } from "@/lib/utils";
import { useGetStats } from "@workspace/api-client-react";

const themeOptions = [
  { value: "light", label: "Light", icon: Sun },
  { value: "dark", label: "Dark", icon: Moon },
  { value: "system", label: "System", icon: Monitor },
] as const;

export default function Settings() {
  const { theme, setTheme } = useTheme();
  const { data: stats } = useGetStats();

  return (
    <div className="flex flex-col h-full overflow-auto">
      <div className="px-6 py-5 border-b border-border">
        <h1 className="text-lg font-bold">Settings</h1>
        <p className="text-xs text-muted-foreground mt-0.5">Customize your AutoResearch AI experience</p>
      </div>

      <div className="flex-1 p-6 max-w-2xl mx-auto w-full space-y-8">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
          <h2 className="text-sm font-semibold mb-1">Appearance</h2>
          <p className="text-xs text-muted-foreground mb-4">Choose your preferred display theme</p>
          <div className="grid grid-cols-3 gap-3">
            {themeOptions.map(({ value, label, icon: Icon }) => (
              <button
                key={value}
                onClick={() => setTheme(value)}
                className={cn(
                  "flex flex-col items-center gap-2 p-4 rounded-xl border transition-all",
                  theme === value
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border bg-card text-muted-foreground hover:border-primary/30"
                )}
              >
                <Icon className="w-5 h-5" />
                <span className="text-xs font-medium">{label}</span>
              </button>
            ))}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <h2 className="text-sm font-semibold mb-1">AI Model</h2>
          <p className="text-xs text-muted-foreground mb-4">The AI engine powering your research agents</p>
          <div className="p-4 rounded-xl border border-border bg-card">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                <Brain className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium">GPT-5.2</p>
                <p className="text-xs text-muted-foreground">via Replit AI Integrations — no API key required</p>
              </div>
              <span className="ml-auto text-xs px-2.5 py-1 rounded-full bg-green-500/10 text-green-500 border border-green-500/20 font-medium">
                Active
              </span>
            </div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <h2 className="text-sm font-semibold mb-1">Agentic Architecture</h2>
          <p className="text-xs text-muted-foreground mb-4">The 6 specialized agents in your research team</p>
          <div className="space-y-2">
            {[
              "Manager Agent — plans workflow, delegates tasks",
              "Research Agent — searches and extracts information",
              "Summarizer Agent — distills findings to key points",
              "Insight Agent — identifies trends, risks, opportunities",
              "Fact Check Agent — validates data and scores confidence",
              "Report Agent — generates polished intelligence brief",
            ].map((agent, i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-lg border border-border bg-card">
                <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-xs font-bold text-primary">{i + 1}</span>
                </div>
                <span className="text-sm">{agent}</span>
                <Zap className="w-3 h-3 text-primary ml-auto" />
              </div>
            ))}
          </div>
        </motion.div>

        {stats && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <h2 className="text-sm font-semibold mb-1">Your Usage</h2>
            <p className="text-xs text-muted-foreground mb-4">Research statistics for this session</p>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "Total Researches", value: stats.totalResearches },
                { label: "Completed", value: stats.completedResearches },
                { label: "Minutes Saved", value: `${stats.totalTimeSaved}m` },
                { label: "Avg Confidence", value: `${Math.round(stats.avgConfidenceScore)}%` },
              ].map(({ label, value }) => (
                <div key={label} className="p-4 rounded-xl border border-border bg-card text-center">
                  <p className="text-2xl font-bold text-primary">{value}</p>
                  <p className="text-xs text-muted-foreground mt-1">{label}</p>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
