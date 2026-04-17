import {
  pgTable,
  text,
  serial,
  timestamp,
  integer,
  real,
  jsonb,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const researchSessionsTable = pgTable("research_sessions", {
  id: serial("id").primaryKey(),
  topic: text("topic").notNull(),
  mode: text("mode").notNull().default("general"),
  status: text("status").notNull().default("pending"),
  currentAgent: text("current_agent"),
  currentStep: integer("current_step").default(0),
  totalSteps: integer("total_steps").default(6),
  reportId: integer("report_id"),
  errorMessage: text("error_message"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const insertResearchSessionSchema = createInsertSchema(
  researchSessionsTable,
).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertResearchSession = z.infer<
  typeof insertResearchSessionSchema
>;
export type ResearchSession = typeof researchSessionsTable.$inferSelect;

export const reportsTable = pgTable("reports", {
  id: serial("id").primaryKey(),
  sessionId: integer("session_id").notNull(),
  topic: text("topic").notNull(),
  mode: text("mode").notNull().default("general"),
  summary: text("summary").notNull().default(""),
  executiveBrief: text("executive_brief").notNull().default(""),
  trends: jsonb("trends").notNull().default([]),
  risks: jsonb("risks").notNull().default([]),
  opportunities: jsonb("opportunities").notNull().default([]),
  recommendations: jsonb("recommendations").notNull().default([]),
  sources: jsonb("sources").notNull().default([]),
  keyInsights: jsonb("key_insights").notNull().default([]),
  confidenceScore: real("confidence_score").notNull().default(0),
  timeSavedMinutes: integer("time_saved_minutes").notNull().default(45),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const insertReportSchema = createInsertSchema(reportsTable).omit({
  id: true,
  createdAt: true,
});
export type InsertReport = z.infer<typeof insertReportSchema>;
export type Report = typeof reportsTable.$inferSelect;
