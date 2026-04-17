import { useEffect } from "react";
import { useParams, useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  Brain,
  Search,
  FileText,
  TrendingUp,
  Shield,
  Target,
  CheckCircle,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  useGetResearchStatus,
  useStartResearch,
} from "@workspace/api-client-react";
import { cn } from "@/lib/utils";

const agentSteps = [
  { step: 1, name: "Manager Agent", desc: "Breaking down the research task and delegating to specialist agents", icon: Brain },
  { step: 2, name: "Research Agent", desc: "Searching multiple sources and extracting key facts and data points", icon: Search },
  { step: 3, name: "Summarizer Agent", desc: "Distilling complex information into clear, actionable summaries", icon: FileText },
  { step: 4, name: "Insight Agent", desc: "Identifying trends, risks, and opportunities from the research data", icon: TrendingUp },
  { step: 5, name: "Fact Check Agent", desc: "Validating findings and assigning confidence scores", icon: Shield },
  { step: 6, name: "Report Agent", desc: "Generating the polished executive intelligence report", icon: Target },
];

export default function Research() {
  const { id } = useParams<{ id: string }>();
  const [, navigate] = useLocation();
  const sessionId = parseInt(id || "0", 10);

  const { data: session, error } = useGetResearchStatus(sessionId, {
    query: {
      enabled: !!sessionId,
      refetchInterval: (query) => {
        const status = query.state.data?.status;
        if (status === "running" || status === "pending") return 1500;
        return false;
      },
    },
  });

  useEffect(() => {
    if (session?.status === "completed" && session.reportId) {
      setTimeout(() => navigate(`/reports/${session.reportId}`), 800);
    }
  }, [session, navigate]);

  const currentStep = session?.currentStep || 0;
  const isCompleted = session?.status === "completed";
  const isFailed = session?.status === "failed";
  const isRunning = session?.status === "running" || session?.status === "pending";

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <AlertCircle className="w-10 h-10 text-destructive mx-auto mb-3" />
          <h2 className="font-semibold mb-2">Research not found</h2>
          <p className="text-sm text-muted-foreground mb-4">This research session could not be found.</p>
          <Button onClick={() => navigate("/dashboard")} variant="outline">Back to Dashboard</Button>
        </div>
      </div>
    );
  }

  if (isFailed) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center max-w-md">
          <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Research Failed</h2>
          <p className="text-sm text-muted-foreground mb-2">{session?.errorMessage || "An unexpected error occurred."}</p>
          <Button onClick={() => navigate("/dashboard")} className="mt-4">Try Again</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-full py-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-2xl"
      >
        <div className="text-center mb-10">
          <motion.div
            animate={{ rotate: isRunning ? 360 : 0 }}
            transition={{ duration: 3, repeat: isRunning ? Infinity : 0, ease: "linear" }}
            className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/30 flex items-center justify-center mx-auto mb-4"
          >
            <Brain className="w-7 h-7 text-primary" />
          </motion.div>
          <h1 className="text-2xl font-bold mb-2">
            {isCompleted ? "Research Complete!" : "Agents Working..."}
          </h1>
          <p className="text-muted-foreground text-sm max-w-md mx-auto">
            {session?.topic ? (
              <>Researching: <span className="font-medium text-foreground">"{session.topic}"</span></>
            ) : (
              "Initializing your research workflow..."
            )}
          </p>
          {isCompleted && (
            <p className="text-xs text-primary mt-2 animate-pulse">Redirecting to your report...</p>
          )}
        </div>

        <div className="space-y-3">
          {agentSteps.map((agentStep, i) => {
            const Icon = agentStep.icon;
            const isDone = currentStep > agentStep.step || isCompleted;
            const isActive = currentStep === agentStep.step && isRunning;
            const isPending = currentStep < agentStep.step && !isCompleted;

            return (
              <motion.div
                key={agentStep.step}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.07 }}
                className={cn(
                  "flex items-center gap-4 p-4 rounded-xl border transition-all duration-500",
                  isDone && "border-green-500/30 bg-green-500/5",
                  isActive && "border-primary/50 bg-primary/5 glow-blue",
                  isPending && "border-border bg-card/30 opacity-50"
                )}
              >
                <div className={cn(
                  "w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-all",
                  isDone && "bg-green-500/15",
                  isActive && "bg-primary/15",
                  isPending && "bg-muted"
                )}>
                  {isDone ? (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  ) : isActive ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                    >
                      <Loader2 className="w-5 h-5 text-primary" />
                    </motion.div>
                  ) : (
                    <Icon className="w-5 h-5 text-muted-foreground" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-sm font-semibold">{agentStep.name}</span>
                    {isActive && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-primary/15 text-primary font-medium agent-pulse">
                        Active
                      </span>
                    )}
                    {isDone && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-green-500/15 text-green-500 font-medium">
                        Done
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">{agentStep.desc}</p>
                </div>

                <div className="shrink-0">
                  <span className={cn(
                    "text-xs font-mono",
                    isDone ? "text-green-500" : isActive ? "text-primary" : "text-muted-foreground/40"
                  )}>
                    {String(agentStep.step).padStart(2, "0")}/{String(agentSteps.length).padStart(2, "0")}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>

        {(isRunning || !session) && (
          <div className="mt-6">
            <div className="flex justify-between text-xs text-muted-foreground mb-1.5">
              <span>Overall Progress</span>
              <span>{Math.round(((currentStep || 0) / 6) * 100)}%</span>
            </div>
            <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-primary rounded-full"
                animate={{ width: `${((currentStep || 0) / 6) * 100}%` }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              />
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
