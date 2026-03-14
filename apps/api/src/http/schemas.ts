import { z } from "zod";

export const listItemsQuerySchema = z.object({
  limit: z.coerce.number().int().min(1).max(100).default(20),
  offset: z.coerce.number().int().min(0).default(0)
});

export const itemIdParamSchema = z.object({ id: z.string().min(1) });

export const getSummaryQuerySchema = z.object({
  sessionId: z.string().min(1),
  userId: z.string().optional()
});

export const submitFeedbackBodySchema = z.object({
  subjectType: z.enum(["summary", "item"]),
  subjectId: z.string().min(1),
  rating: z.number().int().min(1).max(5),
  comment: z.string().max(2000).optional(),
  userId: z.string().optional()
});

export const logEventBodySchema = z.object({
  kind: z.enum(["view", "click", "feedback", "summary_view"]),
  subjectId: z.string().min(1),
  userId: z.string().optional(),
  sessionId: z.string().optional(),
  payload: z.record(z.unknown()).optional()
});

export const listEventsQuerySchema = z.object({
  kind: z.string().optional(),
  limit: z.coerce.number().int().min(1).max(500).default(50)
});

export const updateFlagBodySchema = z.object({
  key: z.string().min(1),
  rolloutPercent: z.number().int().min(0).max(100)
});
