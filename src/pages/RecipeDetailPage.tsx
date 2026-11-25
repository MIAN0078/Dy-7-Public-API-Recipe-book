import { useCallback, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  deleteRecipe,
  fetchRecipe,
  patchRecipe,
  updateRecipe,
} from "../api/recipes";
import { useFetch } from "../hooks/useFetch";
import RecipeForm from "../components/RecipeForm";
import { ErrorView, LoadingView } from "../components/StatusViews";
import type { Difficulty, RecipeInput } from "../types";

export default function RecipeDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const recipeId = Number(id);

  const fetcher = useCallback(
    (signal: AbortSignal) => fetchRecipe(recipeId, signal),
    [recipeId]
  );
  const { data: recipe, setData, status, error, retry } = useFetch(fetcher);

  const [formOpen, setFormOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [busy, setBusy] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  if (status === "loading") return <LoadingView />;

  if (status === "error" || !recipe) {
    return (
      <>
        <Link to="/" className="back">← Back to recipes</Link>
        <ErrorView message={error ?? "Recipe not found"} onRetry={retry} />
      </>
    );
  }

  // PUT
  async function handleEdit(input: RecipeInput) {
    setSaving(true);
    setActionError(null);
    try {
      await updateRecipe(recipeId, input);
      setData((prev) => (prev ? { ...prev, ...input } : prev));
      setFormOpen(false);
    } catch (err) {
      setActionError(err instanceof Error ? err.message : "Update failed");
    } finally {
      setSaving(false);
    }
  }

  // PATCH
  async function handleDifficulty(difficulty: Difficulty) {
    setBusy(true);
    setActionError(null);
    try {
      await patchRecipe(recipeId, { difficulty });
      setData((prev) => (prev ? { ...prev, difficulty } : prev));
    } catch (err) {
      setActionError(err instanceof Error ? err.message : "Update failed");
    } finally {
      setBusy(false);
    }
  }

  // DELETE
  async function handleDelete() {
    if (!recipe) return;
    if (!window.confirm(`"${recipe.name}" delete karni hai?`)) return;
    setBusy(true);
    setActionError(null);
    try {
      await deleteRecipe(recipeId);
      navigate("/");
    } catch (err) {
      setActionError(err instanceof Error ? err.message : "Delete failed");
      setBusy(false);
    }
  }

  return (
    <div>
      <Link to="/" className="back">← Back to recipes</Link>

      {actionError && (
        <div className="banner error">
          {actionError}
          <button onClick={() => setActionError(null)}>✕</button>
        </div>
      )}

      <div className="detail">
        <img src={recipe.image} alt={recipe.name} className="detail-img" />

        <div className="detail-body">
          <h2>{recipe.name}</h2>
          <p className="muted">
            {recipe.cuisine} · ⭐ {recipe.rating} ({recipe.reviewCount} reviews)
          </p>

          <div className="chips">
            {recipe.tags.map((t) => (
              <span key={t} className="chip">{t}</span>
            ))}
          </div>

          <dl>
            <dt>Prep time</dt>
            <dd>{recipe.prepTimeMinutes} min</dd>
            <dt>Cook time</dt>
            <dd>{recipe.cookTimeMinutes} min</dd>
            <dt>Servings</dt>
            <dd>{recipe.servings}</dd>
            <dt>Calories</dt>
            <dd>{recipe.caloriesPerServing} kcal / serving</dd>
            <dt>Meal type</dt>
            <dd>{recipe.mealType.join(", ") || "—"}</dd>
            <dt>Difficulty</dt>
            <dd>
              <select
                value={recipe.difficulty}
                disabled={busy}
                onChange={(e) => handleDifficulty(e.target.value as Difficulty)}
              >
                <option>Easy</option>
                <option>Medium</option>
                <option>Hard</option>
              </select>{" "}
              <span className="muted">(PATCH)</span>
            </dd>
          </dl>

          <div className="actions left">
            <button className="btn primary" disabled={busy} onClick={() => setFormOpen(true)}>
              Edit (PUT)
            </button>
            <button className="btn danger" disabled={busy} onClick={handleDelete}>
              Delete
            </button>
          </div>
        </div>
      </div>

      <div className="lists">
        <section>
          <h3>Ingredients</h3>
          <ul>
            {recipe.ingredients.map((ing, i) => (
              <li key={i}>{ing}</li>
            ))}
          </ul>
        </section>
        <section>
          <h3>Instructions</h3>
          <ol>
            {recipe.instructions.map((step, i) => (
              <li key={i}>{step}</li>
            ))}
          </ol>
        </section>
      </div>

      {formOpen && (
        <RecipeForm
          initial={recipe}
          saving={saving}
          onSubmit={handleEdit}
          onCancel={() => setFormOpen(false)}
        />
      )}
    </div>
  );
}