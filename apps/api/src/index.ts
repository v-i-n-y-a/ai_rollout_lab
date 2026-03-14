import cors from "cors";
import express, { type Request, type Response } from "express";
import { z } from "zod";
import { compose } from "./composition.js";

const app = express();
app.use(cors());
app.use(express.json());

const healthResponseSchema = z.object({
  status: z.literal("ok"),
  service: z.literal("api"),
  version: z.string()
});

type HealthResponse = z.infer<typeof healthResponseSchema>;

app.get("/health", (_req: Request, res: Response<HealthResponse>) => {
  res.json({
    status: "ok",
    service: "api",
    version: "0.1.0"
  });
});

const {
  itemsRoutes,
  summaryRoutes,
  feedbackRoutes,
  eventsRoutes,
  flagsRoutes
} = compose();

// Items
app.get("/items", itemsRoutes.list);
app.get("/items/:id", itemsRoutes.getById);

// AI summary (respects rollout flag)
app.get("/items/:id/summary", summaryRoutes.get);

// Feedback
app.post("/feedback", feedbackRoutes.submit);

// Events & metrics
app.post("/events", eventsRoutes.log);
app.get("/metrics", eventsRoutes.metrics);
app.get("/events", eventsRoutes.list);

// Admin: flags
app.get("/admin/flags", flagsRoutes.getAll);
app.patch("/admin/flags", flagsRoutes.update);

const port = Number(process.env.PORT) || 4000;

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`API listening on http://localhost:${port}`);
});
