import type { Item } from "../api/client";
import { ViewTransitionLink } from "../components/ViewTransitionLink";

export const ItemList: React.FC<{ items: Item[] }> = ({ items }) => {
  return (
    <ul className="card-list">
      {items.map((item) => (
        <li key={item.id}>
          <ViewTransitionLink to={`/item/${item.id}`} className="card">
            <strong className="card__title">{item.title}</strong>
            <p className="card__desc">{item.description}</p>
          </ViewTransitionLink>
        </li>
      ))}
    </ul>
  );
};
