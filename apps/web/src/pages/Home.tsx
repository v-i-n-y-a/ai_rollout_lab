import { useEffect, useState } from "react";
import { api } from "../api/client";
import type { Item } from "../api/client";
import { ItemList } from "./ItemList";

export const Home: React.FC = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api
      .getItems()
      .then((r) => {
        setItems(r.items);
        setError(null);
      })
      .catch((e) => setError(e instanceof Error ? e.message : "Failed to load"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="page page__sections">
      <p className="kicker">AI Rollout Lab</p>
      <h1 className="page-title">Browse items</h1>
      <p className="page-subtitle">
        Open an item to see an AI summary when you're in the rollout.
      </p>
      {loading && <p className="loading">Loading…</p>}
      {error && <p className="text-error">{error}</p>}
      {!loading && !error && <ItemList items={items} />}
    </div>
  );
};
