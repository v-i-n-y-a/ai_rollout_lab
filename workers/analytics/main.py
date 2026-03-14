from __future__ import annotations

from dataclasses import dataclass
from typing import Any, Dict

import os
import json

import redis  # type: ignore[import-untyped]
import psycopg  # type: ignore[import-untyped]


@dataclass(frozen=True)
class Settings:
  redis_url: str = os.getenv("REDIS_URL", "redis://localhost:6379/0")
  postgres_dsn: str = os.getenv(
    "POSTGRES_DSN",
    "postgresql://postgres:postgres@localhost:5433/analytics",
  )
  queue_key: str = os.getenv("ANALYTICS_QUEUE_KEY", "analytics_events")


settings = Settings()


def ensure_table(conn: psycopg.Connection[Any]) -> None:
  with conn.cursor() as cur:
    cur.execute(
      """
      CREATE TABLE IF NOT EXISTS analytics_events (
        id BIGSERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        payload JSONB NOT NULL,
        received_at TIMESTAMPTZ DEFAULT NOW()
      );
      """
    )
    conn.commit()


def process_event(conn: psycopg.Connection[Any], payload: Dict[str, Any]) -> None:
  with conn.cursor() as cur:
    cur.execute(
      "INSERT INTO analytics_events (name, payload) VALUES (%s, %s)",
      (str(payload.get("name", "unknown")), json.dumps(payload)),
    )
    conn.commit()


def run() -> None:
  r = redis.Redis.from_url(settings.redis_url)
  with psycopg.connect(settings.postgres_dsn, autocommit=False) as conn:
    ensure_table(conn)
    while True:
      _queue, raw = r.blpop(settings.queue_key)
      try:
        decoded = json.loads(raw)
        if not isinstance(decoded, dict):
          raise ValueError("Expected object payload")
      except Exception:
        # Intentionally minimal: skip malformed messages
        conn.rollback()
        continue

      try:
        process_event(conn, decoded)
      except Exception:
        conn.rollback()


if __name__ == "__main__":
  run()

