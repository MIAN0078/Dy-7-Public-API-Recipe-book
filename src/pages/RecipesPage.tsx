import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { createRecipe, fetchRecipes, fetchTags } from "../api/recipes";
import { useDebounce } from "../hooks/useDebounce";
import { useFetch } from "../hooks/useFetch";
import Toolbar from "../components/Toolbar";
import RecipeCard from "../components/RecipeCard";
import RecipeForm from "../components/RecipeForm";
import Pagination from "../components/Pagination";
import { EmptyView, ErrorView, LoadingView } from "../components/StatusViews";
import type { Recipe, RecipeInput, SortField, SortOrder } from "../types";

const PAGE_SIZE = 12;

export default function RecipesPage() {
  const [sp, setSp] = useSearchParams();

  // URL se state padho
  const q = sp.get("q") ?? "";
  const tag = sp.get("tag") ?? "";
  const sortBy = (sp.get("sortBy") ?? "name") as SortField;
  const order = (sp.get("order") ?? "asc") as SortOrder;
  const page = Number(sp.get("page")) || 1;

  // URL update helper: page ke ilawa kuch bhi badle to page 1 pe wapas
  function updateParams(changes: Record<string, string>) {
    const next = new URLSearchParams(sp);
    Object.entries(changes).forEach(([k, v]) => {
      if (v) next.set(k, v);
      else next.delete(k);
    });
    if (!("page" in changes)) next.set("page", "1");
    setSp(next);
  }

  // Search input: typing fauran dikhe, lekin URL/API 400ms baad update ho
  const [searchInput, setSearchInput] = useState(q);
  const debounced = useDebounce(searchInput, 400);

  useEffect(() => {
    if (debounced !== q) updateParams({ q: debounced });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debounced]);

  // Tags ek baar load
  const [tags, setTags] = useState<string[]>([]);
  useEffect(() => {
    const controller = new AbortController();
    fetchTags(controller.signal)
      .then(setTags)
      .catch(() => {
        /* tags fail hon to app phir bhi chalti hai */
      });
    return () => controller.abort();
  }, []);

  // Recipes fetch (useCallback zaroori hai)
  const fetcher = useCallback(
    (signal: AbortSignal) =>
      fetchRecipes(
        { search: q, tag, sortBy, order, page, limit: PAGE_SIZE },
        signal
      ),
    [q, tag, sortBy, order, page]
  );
  const { data, setData, status, error, retry } = useFetch(fetcher);

  // Form state
  const [formOpen, setFormOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const recipes = data?.recipes ?? [];
  const total = data?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  function clearFilters() {
    setSearchInput("");
    setSp({});
  }

  // CREATE (POST)
  async function handleCreate(input: RecipeInput) {
    setSaving(true);
    setActionError(null);
    try {
      await createRecipe(input); // server simulate karega
      const newRecipe: Recipe = {
        ...input,
        id: Date.now(), // bohat badi id = local recipe
        tags: [],
        image: "https://placehold.co/300x200?text=New+Recipe",
        rating: 0,
        reviewCount: 0,
        mealType: [],
      };
      setData((prev) =>
        prev
          ? {
              ...prev,
              recipes: [newRecipe, ...prev.recipes],
              total: prev.total + 1,
            }
          : prev
      );
      setNotice("Recipe add ho gayi (simulated, server pe save nahi hoti).");
      setFormOpen(false);
    } catch (err) {
      setActionError(err instanceof Error ? err.message : "Create failed");
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <Toolbar
        search={searchInput}
        tag={tag}
        tags={tags}
        sortBy={sortBy}
        order={order}
        onSearch={setSearchInput}
        onTag={(v) => updateParams({ tag: v })}
        onSort={(field, ord) => updateParams({ sortBy: field, order: ord })}
        onAdd={() => setFormOpen(true)}
      />

      {actionError && (
        <div className="banner error">
          {actionError}
          <button onClick={() => setActionError(null)}>✕</button>
        </div>
      )}
      {notice && (
        <div className="banner info">
          {notice}
          <button onClick={() => setNotice(null)}>✕</button>
        </div>
      )}

      {status === "loading" && <LoadingView />}
      {status === "error" && <ErrorView message={error ?? "Error"} onRetry={retry} />}
      {status === "success" && recipes.length === 0 && (
        <EmptyView onClear={clearFilters} />
      )}
      {status === "success" && recipes.length > 0 && (
        <>
          <p className="count">{total} recipes</p>
          <div className="grid">
            {recipes.map((r) => (
              <RecipeCard key={r.id} recipe={r} />
            ))}
          </div>
          <Pagination
            page={page}
            totalPages={totalPages}
            onChange={(p) => updateParams({ page: String(p) })}
          />
        </>
      )}

      {formOpen && (
        <RecipeForm
          initial={null}
          saving={saving}
          onSubmit={handleCreate}
          onCancel={() => setFormOpen(false)}
        />
      )}
    </>
  );
}