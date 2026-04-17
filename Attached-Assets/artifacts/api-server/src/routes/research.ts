import { Router, type IRouter } from "express";
import { db, researchSessionsTable, reportsTable } from "@workspace/db";
import { eq, desc, sql } from "drizzle-orm";
import {
  StartResearchBody,
  GetResearchStatusParams,
} from "@workspace/api-zod";
import { runFullResearchWorkflow } from "../lib/agents";
import { logger } from "../lib/logger";

const router: IRouter = Router();

router.post("/research", async (req, res): Promise<void> => {
  const parsed = StartResearchBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const { topic, mode } = parsed.data;

  const [session] = await db
    .insert(researchSessionsTable)
    .values({
      topic,
      mode,
      status: "pending",
      currentStep: 0,
      totalSteps: 6,
    })
    .returning();

  res.status(201).json({
    id: session.id,
    topic: session.topic,
    mode: session.mode,
    status: session.status,
    currentAgent: session.currentAgent,
    currentStep: session.currentStep,
    totalSteps: session.totalSteps,
    reportId: session.reportId,
    errorMessage: session.errorMessage,
    createdAt: session.createdAt.toISOString(),
    updatedAt: session.updatedAt.toISOString(),
  });

  setImmediate(async () => {
    try {
      await db
        .update(researchSessionsTable)
        .set({ status: "running", currentAgent: "Manager Agent", currentStep: 1 })
        .where(eq(researchSessionsTable.id, session.id));

      const report = await runFullResearchWorkflow(
        topic,
        mode,
        async (step, agentName) => {
          await db
            .update(researchSessionsTable)
            .set({
              status: "running",
              currentAgent: agentName,
              currentStep: step,
            })
            .where(eq(researchSessionsTable.id, session.id));
        }
      );

      const [savedReport] = await db
        .insert(reportsTable)
        .values({
          sessionId: session.id,
          topic,
          mode,
          summary: report.summary,
          executiveBrief: report.executiveBrief,
          trends: report.trends,
          risks: report.risks,
          opportunities: report.opportunities,
          recommendations: report.recommendations,
          sources: report.sources,
          keyInsights: report.keyInsights,
          confidenceScore: report.confidenceScore,
          timeSavedMinutes: report.timeSavedMinutes,
        })
        .returning();

      await db
        .update(researchSessionsTable)
        .set({
          status: "completed",
          currentStep: 6,
          currentAgent: "Report Agent",
          reportId: savedReport.id,
        })
        .where(eq(researchSessionsTable.id, session.id));

      logger.info({ sessionId: session.id, reportId: savedReport.id }, "Research completed");
    } catch (err) {
      logger.error({ err, sessionId: session.id }, "Research workflow failed");
      await db
        .update(researchSessionsTable)
        .set({
          status: "failed",
          errorMessage: err instanceof Error ? err.message : "Unknown error",
        })
        .where(eq(researchSessionsTable.id, session.id));
    }
  });
});

router.get("/research/:id/status", async (req, res): Promise<void> => {
  const params = GetResearchStatusParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [session] = await db
    .select()
    .from(researchSessionsTable)
    .where(eq(researchSessionsTable.id, params.data.id));

  if (!session) {
    res.status(404).json({ error: "Research session not found" });
    return;
  }

  res.json({
    id: session.id,
    topic: session.topic,
    mode: session.mode,
    status: session.status,
    currentAgent: session.currentAgent,
    currentStep: session.currentStep,
    totalSteps: session.totalSteps,
    reportId: session.reportId,
    errorMessage: session.errorMessage,
    createdAt: session.createdAt.toISOString(),
    updatedAt: session.updatedAt.toISOString(),
  });
});

router.get("/reports", async (req, res): Promise<void> => {
  const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 20;
  const mode = req.query.mode as string | undefined;

  let query = db
    .select()
    .from(reportsTable)
    .orderBy(desc(reportsTable.createdAt))
    .limit(limit);

  const reports = await query;

  const filtered = mode ? reports.filter((r) => r.mode === mode) : reports;

  res.json(
    filtered.map((r) => ({
      id: r.id,
      sessionId: r.sessionId,
      topic: r.topic,
      mode: r.mode,
      summary: r.summary,
      executiveBrief: r.executiveBrief,
      trends: r.trends,
      risks: r.risks,
      opportunities: r.opportunities,
      recommendations: r.recommendations,
      sources: r.sources,
      keyInsights: r.keyInsights,
      confidenceScore: r.confidenceScore,
      timeSavedMinutes: r.timeSavedMinutes,
      createdAt: r.createdAt.toISOString(),
    }))
  );
});

router.get("/reports/:id", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(raw, 10);
  if (isNaN(id)) {
    res.status(400).json({ error: "Invalid report ID" });
    return;
  }

  const [report] = await db
    .select()
    .from(reportsTable)
    .where(eq(reportsTable.id, id));

  if (!report) {
    res.status(404).json({ error: "Report not found" });
    return;
  }

  res.json({
    id: report.id,
    sessionId: report.sessionId,
    topic: report.topic,
    mode: report.mode,
    summary: report.summary,
    executiveBrief: report.executiveBrief,
    trends: report.trends,
    risks: report.risks,
    opportunities: report.opportunities,
    recommendations: report.recommendations,
    sources: report.sources,
    keyInsights: report.keyInsights,
    confidenceScore: report.confidenceScore,
    timeSavedMinutes: report.timeSavedMinutes,
    createdAt: report.createdAt.toISOString(),
  });
});

router.delete("/reports/:id", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(raw, 10);
  if (isNaN(id)) {
    res.status(400).json({ error: "Invalid report ID" });
    return;
  }

  const [deleted] = await db
    .delete(reportsTable)
    .where(eq(reportsTable.id, id))
    .returning();

  if (!deleted) {
    res.status(404).json({ error: "Report not found" });
    return;
  }

  res.sendStatus(204);
});

router.get("/history", async (req, res): Promise<void> => {
  const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 20;

  const sessions = await db
    .select()
    .from(researchSessionsTable)
    .orderBy(desc(researchSessionsTable.createdAt))
    .limit(limit);

  res.json(
    sessions.map((s) => ({
      id: s.id,
      topic: s.topic,
      mode: s.mode,
      status: s.status,
      reportId: s.reportId,
      createdAt: s.createdAt.toISOString(),
    }))
  );
});

router.get("/stats", async (req, res): Promise<void> => {
  const sessions = await db.select().from(researchSessionsTable);
  const reports = await db.select().from(reportsTable);

  const totalResearches = sessions.length;
  const completedResearches = sessions.filter((s) => s.status === "completed").length;
  const totalTimeSaved = reports.reduce((acc, r) => acc + (r.timeSavedMinutes || 0), 0);
  const avgConfidenceScore =
    reports.length > 0
      ? reports.reduce((acc, r) => acc + (r.confidenceScore || 0), 0) / reports.length
      : 0;

  const researchesByMode: Record<string, number> = {};
  sessions.forEach((s) => {
    researchesByMode[s.mode] = (researchesByMode[s.mode] || 0) + 1;
  });

  res.json({
    totalResearches,
    completedResearches,
    totalTimeSaved,
    avgConfidenceScore: Math.round(avgConfidenceScore),
    researchesByMode,
  });
});

router.get("/topics/suggestions", async (_req, res): Promise<void> => {
  const suggestions = [
    { topic: "AI Agents in Enterprise 2026", mode: "researcher", category: "Technology" },
    { topic: "EV Battery Innovation & Solid State", mode: "investor", category: "Energy" },
    { topic: "Startup Funding Landscape India Q2 2026", mode: "startup", category: "Finance" },
    { topic: "Cybersecurity Threats & Zero Trust", mode: "researcher", category: "Security" },
    { topic: "Top Tech Skills for Software Engineers 2026", mode: "student", category: "Careers" },
    { topic: "Cloud Computing Jobs & Market Demand", mode: "student", category: "Careers" },
    { topic: "Competitor Analysis: OpenAI vs Anthropic vs Google", mode: "startup", category: "AI" },
    { topic: "Social Media Marketing Trends 2026", mode: "marketing", category: "Marketing" },
    { topic: "Quantum Computing Industry Overview", mode: "investor", category: "Technology" },
    { topic: "Remote Work & Future of Employment", mode: "general", category: "Workplace" },
    { topic: "Biotech Breakthroughs & Drug Discovery AI", mode: "researcher", category: "Healthcare" },
    { topic: "DeFi & Web3 Market Analysis", mode: "investor", category: "Finance" },
  ];
  res.json(suggestions);
});

export default router;
