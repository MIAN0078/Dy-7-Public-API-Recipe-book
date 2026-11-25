import type { SortField, SortOrder } from "../types";

interface Props {
  search: string;
  tag: string;
  tags: string[];
  sortBy: SortField;
  order: SortOrder;
  onSearch: (v: string) => void;
  onTag: (v: string) => void;
  onSort: (field: SortField, order: SortOrder) => void;
  onAdd: () => void;
}

export default function Toolbar(p: Props) {
  return (
    <div className="toolbar">
      <input
        type="search"
        placeholder="Search recipes..."
        value={p.search}
        onChange={(e) => p.onSearch(e.target.value)}
      />

      <select
        value={p.tag}
        onChange={(e) => p.onTag(e.target.value)}
        disabled={p.search.trim() !== ""}
        title={p.search ? "Search ke dauran tag filter band hai" : ""}
      >
        <option value="">All tags</option>
        {p.tags.map((t) => (
          <option key={t} value={t}>
            {t}
          </option>
        ))}
      </select>

      <select
        value={p.sortBy}
        onChange={(e) => p.onSort(e.target.value as SortField, p.order)}
      >
        <option value="name">Sort: Name</option>
        <option value="rating">Sort: Rating</option>
        <option value="prepTimeMinutes">Sort: Prep time</option>
        <option value="caloriesPerServing">Sort: Calories</option>
      </select>

      <select
        value={p.order}
        onChange={(e) => p.onSort(p.sortBy, e.target.value as SortOrder)}
      >
        <option value="asc">Ascending</option>
        <option value="desc">Descending</option>
      </select>

      <button className="btn primary" onClick={p.onAdd}>
        + Add Recipe
      </button>
    </div>
  );
}