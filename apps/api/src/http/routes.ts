import { randomUUID } from "node:crypto";
import type { Request, Response } from "express";
import type { ItemsUseCase } from "../use-cases/items.use-case.js";
import type { SummaryUseCase } from "../use-cases/summary.use-case.js";
import type { FeedbackUseCase } from "../use-cases/feedback.use-case.js";
import type { EventsUseCase } from "../use-cases/events.use-case.js";
import type { FlagsUseCase } from "../use-cases/flags.use-case.js";
import {
  listItemsQuerySchema,
  itemIdParamSchema,
  getSummaryQuerySchema,
  submitFeedbackBodySchema,
  logEventBodySchema,
  listEventsQuerySchema,
  updateFlagBodySchema
} from "./schemas.js";

function uuid(): string {
  return randomUUID();
}

export function createItemsRoutes(useCase: ItemsUseCase) {
  return {
    list: async (req: Request, res: Response): Promise<void> => {
      const parsed = listItemsQuerySchema.safeParse(req.query);
      if (!parsed.success) {
        res.status(400).json({ error: "Invalid query", details: parsed.error.flatten() });
        return;
      }
      const { items } = await useCase.list(parsed.data.limit, parsed.data.offset);
      res.json({ items });
    },
    getById: async (req: Request, res: Response): Promise<void> => {
      const parsed = itemIdParamSchema.safeParse(req.params);
      if (!parsed.success) {
        res.status(400).json({ error: "Invalid id" });
        return;
      }
      const item = await useCase.getById(parsed.data.id);
      if (!item) {
        res.status(404).json({ error: "Item not found" });
        return;
      }
      res.json(item);
    }
  };
}

export function createSummaryRoutes(useCase: SummaryUseCase) {
  return {
    get: async (req: Request, res: Response): Promise<void> => {
      const paramParsed = itemIdParamSchema.safeParse(req.params);
      const queryParsed = getSummaryQuerySchema.safeParse(req.query);
      if (!paramParsed.success || !queryParsed.success) {
        res.status(400).json({ error: "Invalid params or query" });
        return;
      }
      const { id } = paramParsed.data;
      const { sessionId, userId } = queryParsed.data;
      const result = await useCase.getSummary({ itemId: id, sessionId, userId });
      res.json(result);
    }
  };
}

export function createFeedbackRoutes(useCase: FeedbackUseCase) {
  return {
    submit: async (req: Request, res: Response): Promise<void> => {
      const parsed = submitFeedbackBodySchema.safeParse(req.body);
      if (!parsed.success) {
        res.status(400).json({ error: "Invalid body", details: parsed.error.flatten() });
        return;
      }
      const feedback = await useCase.submit(parsed.data, uuid);
      res.status(201).json(feedback);
    }
  };
}

export function createEventsRoutes(useCase: EventsUseCase) {
  return {
    log: async (req: Request, res: Response): Promise<void> => {
      const parsed = logEventBodySchema.safeParse(req.body);
      if (!parsed.success) {
        res.status(400).json({ error: "Invalid body", details: parsed.error.flatten() });
        return;
      }
      const event = await useCase.log(parsed.data, uuid);
      res.status(201).json(event);
    },
    metrics: async (_req: Request, res: Response): Promise<void> => {
      const metrics = await useCase.getMetrics();
      res.json(metrics);
    },
    list: async (req: Request, res: Response): Promise<void> => {
      const parsed = listEventsQuerySchema.safeParse(req.query);
      if (!parsed.success) {
        res.status(400).json({ error: "Invalid query" });
        return;
      }
      const events = await useCase.list(parsed.data.kind, parsed.data.limit);
      res.json({ events });
    }
  };
}

export function createFlagsRoutes(useCase: FlagsUseCase) {
  return {
    getAll: async (_req: Request, res: Response): Promise<void> => {
      const flags = await useCase.getAll();
      res.json({ flags });
    },
    update: async (req: Request, res: Response): Promise<void> => {
      const parsed = updateFlagBodySchema.safeParse(req.body);
      if (!parsed.success) {
        res.status(400).json({ error: "Invalid body", details: parsed.error.flatten() });
        return;
      }
      const flag = await useCase.update(parsed.data);
      res.json(flag);
    }
  };
}
