const API_BASE = import.meta.env.VITE_API_URL ?? "http://localhost:4000";

export interface Item {
  id: string;
  title: string;
  description: string;
  createdAt: string;
}

export interface SummaryResult {
  summary: { itemId: string; summary: string; generatedAt: string } | null;
  inRollout: boolean;
}

export interface Metrics {
  byKind: Record<string, number>;
  total: number;
}

export interface RolloutFlag {
  key: string;
  rolloutPercent: number;
  updatedAt: string;
}

async function get<T>(path: string, params?: Record<string, string>): Promise<T> {
  const url = new URL(path, API_BASE);
  if (params) Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
  const res = await fetch(url.toString());
  if (!res.ok) throw new Error(await res.text().catch(() => res.statusText));
  return res.json() as Promise<T>;
}

async function post<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });
  if (!res.ok) throw new Error(await res.text().catch(() => res.statusText));
  return res.json() as Promise<T>;
}

async function patch<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });
  if (!res.ok) throw new Error(await res.text().catch(() => res.statusText));
  return res.json() as Promise<T>;
}

export const api = {
  getItems: (limit = 20, offset = 0) =>
    get<{ items: Item[] }>(`/items?limit=${limit}&offset=${offset}`),

  getItem: (id: string) => get<Item>(`/items/${id}`),

  getSummary: (itemId: string, sessionId: string, userId?: string) => {
    const params: Record<string, string> = { sessionId };
    if (userId) params.userId = userId;
    return get<SummaryResult>(
      `/items/${itemId}/summary`,
      params
    );
  },

  submitFeedback: (data: {
    subjectType: "summary" | "item";
    subjectId: string;
    rating: number;
    comment?: string;
    userId?: string;
  }) => post<{ id: string }>("/feedback", data),

  logEvent: (data: {
    kind: "view" | "click" | "feedback" | "summary_view";
    subjectId: string;
    userId?: string;
    sessionId?: string;
    payload?: Record<string, unknown>;
  }) => post<{ id: string }>("/events", data),

  getMetrics: () => get<Metrics>("/metrics"),

  getFlags: () => get<{ flags: RolloutFlag[] }>("/admin/flags"),

  updateFlag: (key: string, rolloutPercent: number) =>
    patch<RolloutFlag>("/admin/flags", { key, rolloutPercent })
};
