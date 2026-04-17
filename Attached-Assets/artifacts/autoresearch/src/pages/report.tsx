import { useState } from "react";
import { useParams, useLocation } from "wouter";
import { motion } from "framer-motion";
import {
  TrendingUp,
  Shield,
  Target,
  Globe,
  FileText,
  Download,
  Copy,
  ArrowLeft,
  CheckCircle,
  AlertTriangle,
  Zap,
  Clock,
  Star,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useGetReport } from "@workspace/api-client-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
} from "recharts";
import { cn } from "@/lib/utils";

const TABS = ["Summary", "Trends", "Sources", "Risks", "Opportunities", "Recommendations"] as const;
type Tab = typeof TABS[number];

const SEVERITY_COLORS: Record<string, string> = {
  critical: "text-red-500 bg-red-500/10 border-red-500/20",
  high: "text-orange-500 bg-orange-500/10 border-orange-500/20",
  medium: "text-yellow-500 bg-yellow-500/10 border-yellow-500/20",
  low: "text-green-500 bg-green-500/10 border-green-500/20",
};

const POTENTIAL_COLORS: Record<string, string> = {
  high: "text-green-500 bg-green-500/10 border-green-500/20",
  medium: "text-blue-500 bg-blue-500/10 border-blue-500/20",
  low: "text-muted-foreground bg-muted/10 border-border",
};

const PIE_COLORS = ["#3b82f6", "#8b5cf6", "#10b981", "#f59e0b", "#ef4444", "#06b6d4"];

export default function Report() {
  const { id } = useParams<{ id: string }>();
  const [, navigate] = useLocation();
  const [activeTab, setActiveTab] = useState<Tab>("Summary");
  const [copied, setCopied] = useState(false);

  const reportId = parseInt(id || "0", 10);
  const { data: report, isLoading, error } = useGetReport(reportId, {
    query: { enabled: !!reportId },
  });

  const handleCopy = () => {
    if (!report) return;
    const text = `RESEARCH REPORT: ${report.topic}\n\n${report.executiveBrief}\n\nSUMMARY:\n${report.summary}\n\nKEY INSIGHTS:\n${(report.keyInsights as string[]).map((k, i) => `${i + 1}. ${k}`).join("\n")}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!report) return;
    const data = JSON.stringify(report, null, 2);
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `autoresearch-${report.topic.slice(0, 30).replace(/\s+/g, "-")}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">Loading report...</p>
        </div>
      </div>
    );
  }

  if (error || !report) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <AlertTriangle className="w-10 h-10 text-destructive mx-auto mb-3" />
          <h2 className="font-semibold mb-2">Report not found</h2>
          <Button onClick={() => navigate("/dashboard")} variant="outline">Back to Dashboard</Button>
        </div>
      </div>
    );
  }

  const trends = (report.trends as any[]) || [];
  const risks = (report.risks as any[]) || [];
  const opportunities = (report.opportunities as any[]) || [];
  const recommendations = (report.recommendations as any[]) || [];
  const sources = (report.sources as any[]) || [];
  const keyInsights = (report.keyInsights as string[]) || [];

  const trendChartData = trends.map((t: any) => ({ name: t.title?.slice(0, 20), score: t.score }));
  const sourceChartData = sources.map((s: any, i: number) => ({
    name: s.title?.slice(0, 15) + "...",
    value: Math.round(s.reliability * 100),
  }));

  return (
    <div className="flex flex-col h-full overflow-auto">
      <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b border-border px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/dashboard")}
              className="gap-1.5 text-muted-foreground"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Dashboard</span>
            </Button>
            <div className="w-px h-5 bg-border" />
            <div>
              <h1 className="text-sm font-semibold leading-tight line-clamp-1">{report.topic}</h1>
              <p className="text-xs text-muted-foreground capitalize">{report.mode} research</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-green-500/10 border border-green-500/20">
              <Star className="w-3.5 h-3.5 text-green-500" />
              <span className="text-xs font-medium text-green-500">{Math.round(report.confidenceScore)}% confidence</span>
            </div>
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-500/10 border border-blue-500/20">
              <Clock className="w-3.5 h-3.5 text-blue-500" />
              <span className="text-xs font-medium text-blue-500">{report.timeSavedMinutes}m saved</span>
            </div>
            <Button variant="outline" size="sm" onClick={handleCopy} className="gap-1.5">
              {copied ? <CheckCircle className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline">{copied ? "Copied!" : "Copy"}</span>
            </Button>
            <Button variant="outline" size="sm" onClick={handleDownload} className="gap-1.5">
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Export</span>
            </Button>
          </div>
        </div>
      </div>

      <div className="sticky top-[73px] z-10 bg-background/80 backdrop-blur-md border-b border-border px-6">
        <div className="flex gap-1 overflow-x-auto">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "px-4 py-2.5 text-sm font-medium whitespace-nowrap border-b-2 transition-colors",
                activeTab === tab
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              )}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 p-6 max-w-5xl mx-auto w-full">
        {activeTab === "Summary" && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div className="p-6 rounded-2xl border border-primary/20 bg-primary/5">
              <div className="flex items-center gap-2 mb-3">
                <Zap className="w-4 h-4 text-primary" />
                <h2 className="text-sm font-semibold text-primary">Executive Brief</h2>
              </div>
              <p className="text-base leading-relaxed text-foreground font-medium">{report.executiveBrief}</p>
            </div>

            <div>
              <h3 className="text-sm font-semibold mb-3 text-muted-foreground uppercase tracking-wide">Key Insights</h3>
              <div className="space-y-2">
                {keyInsights.map((insight: string, i: number) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.06 }}
                    className="flex items-start gap-3 p-3.5 rounded-xl border border-border bg-card"
                  >
                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                    <p className="text-sm leading-relaxed">{insight}</p>
                  </motion.div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold mb-3 text-muted-foreground uppercase tracking-wide">Full Summary</h3>
              <div className="p-5 rounded-xl border border-border bg-card">
                <p className="text-sm leading-relaxed text-muted-foreground whitespace-pre-line">{report.summary}</p>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === "Trends" && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            {trendChartData.length > 0 && (
              <div className="p-5 rounded-2xl border border-border bg-card">
                <h3 className="text-sm font-semibold mb-4">Trend Strength Scores</h3>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={trendChartData} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                    <XAxis dataKey="name" tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} />
                    <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} />
                    <Tooltip
                      contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }}
                      labelStyle={{ color: "hsl(var(--foreground))" }}
                    />
                    <Bar dataKey="score" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {trends.map((trend: any, i: number) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.07 }}
                  className="p-4 rounded-xl border border-border bg-card"
                >
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="text-sm font-semibold leading-tight flex-1 pr-2">{trend.title}</h4>
                    <div className="flex flex-col items-end gap-1 shrink-0">
                      <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary font-mono">{trend.score}/100</span>
                      <span className="text-xs text-muted-foreground">{trend.category}</span>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">{trend.description}</p>
                  <div className="mt-3 w-full h-1.5 bg-muted rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-primary rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${trend.score}%` }}
                      transition={{ delay: i * 0.07 + 0.3, duration: 0.6 }}
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {activeTab === "Sources" && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            {sourceChartData.length > 0 && (
              <div className="p-5 rounded-2xl border border-border bg-card">
                <h3 className="text-sm font-semibold mb-4">Source Reliability Distribution</h3>
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie
                      data={sourceChartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={90}
                      dataKey="value"
                      nameKey="name"
                      label={({ name, value }) => `${name}: ${value}%`}
                      labelLine={false}
                    >
                      {sourceChartData.map((_, idx) => (
                        <Cell key={idx} fill={PIE_COLORS[idx % PIE_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}
            <div className="space-y-3">
              {sources.map((source: any, i: number) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.06 }}
                  className="p-4 rounded-xl border border-border bg-card"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1 pr-3">
                      <h4 className="text-sm font-semibold leading-tight">{source.title}</h4>
                      <a
                        href={source.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-primary hover:underline flex items-center gap-1 mt-0.5"
                      >
                        <Globe className="w-3 h-3" />
                        {source.url}
                        <ExternalLink className="w-2.5 h-2.5" />
                      </a>
                    </div>
                    <div className="shrink-0">
                      <div className="text-right">
                        <span className="text-sm font-bold text-primary">{Math.round(source.reliability * 100)}%</span>
                        <p className="text-xs text-muted-foreground">reliability</p>
                      </div>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">{source.summary}</p>
                  <div className="mt-2 w-full h-1 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full"
                      style={{ width: `${source.reliability * 100}%` }}
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {activeTab === "Risks" && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
            <p className="text-sm text-muted-foreground mb-4">
              {risks.length} risk factors identified across {new Set(risks.map((r: any) => r.severity)).size} severity levels.
            </p>
            {risks.map((risk: any, i: number) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07 }}
                className="p-4 rounded-xl border bg-card flex items-start gap-4"
              >
                <AlertTriangle className="w-5 h-5 mt-0.5 shrink-0 text-muted-foreground" />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1.5">
                    <h4 className="text-sm font-semibold">{risk.title}</h4>
                    <span className={cn(
                      "text-xs px-2 py-0.5 rounded-full border font-medium capitalize",
                      SEVERITY_COLORS[risk.severity] || SEVERITY_COLORS.low
                    )}>
                      {risk.severity}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">{risk.description}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {activeTab === "Opportunities" && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
            <p className="text-sm text-muted-foreground mb-4">
              {opportunities.length} strategic opportunities identified from the research.
            </p>
            {opportunities.map((opp: any, i: number) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07 }}
                className="p-4 rounded-xl border bg-card flex items-start gap-4"
              >
                <Target className="w-5 h-5 mt-0.5 shrink-0 text-muted-foreground" />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1.5">
                    <h4 className="text-sm font-semibold">{opp.title}</h4>
                    <span className={cn(
                      "text-xs px-2 py-0.5 rounded-full border font-medium capitalize",
                      POTENTIAL_COLORS[opp.potential] || POTENTIAL_COLORS.low
                    )}>
                      {opp.potential} potential
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">{opp.description}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {activeTab === "Recommendations" && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
            <p className="text-sm text-muted-foreground mb-4">
              {recommendations.length} actionable recommendations ordered by priority.
            </p>
            {[...recommendations]
              .sort((a: any, b: any) => {
                const order = { high: 0, medium: 1, low: 2 };
                return (order[a.priority as keyof typeof order] ?? 2) - (order[b.priority as keyof typeof order] ?? 2);
              })
              .map((rec: any, i: number) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.07 }}
                  className="p-4 rounded-xl border bg-card"
                >
                  <div className="flex items-start gap-3">
                    <div className={cn(
                      "w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold",
                      rec.priority === "high" ? "bg-orange-500/20 text-orange-500" :
                      rec.priority === "medium" ? "bg-blue-500/20 text-blue-500" :
                      "bg-muted text-muted-foreground"
                    )}>
                      {i + 1}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1.5">
                        <h4 className="text-sm font-semibold">{rec.action}</h4>
                        <span className={cn(
                          "text-xs px-2 py-0.5 rounded-full border font-medium capitalize",
                          POTENTIAL_COLORS[rec.priority] || POTENTIAL_COLORS.low
                        )}>
                          {rec.priority}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed">{rec.rationale}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}
