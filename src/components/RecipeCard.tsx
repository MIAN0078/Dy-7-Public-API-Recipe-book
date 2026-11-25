import { Link } from "react-router-dom";
import { isLocalId } from "../api/recipes";
import type { Recipe } from "../types";

export default function RecipeCard({ recipe }: { recipe: Recipe }) {
  const content = (
    <>
      <img src={recipe.image} alt={recipe.name} className="card-img" />
      <div className="card-body">
        <h3>{recipe.name}</h3>
        <p className="muted">
          {recipe.cuisine} · {recipe.difficulty}
        </p>
        <p className="muted">
          ⏱ {recipe.prepTimeMinutes + recipe.cookTimeMinutes} min · 🔥{" "}
          {recipe.caloriesPerServing} kcal
        </p>
        <p className="muted">⭐ {recipe.rating}</p>
      </div>
    </>
  );

  if (isLocalId(recipe.id)) {
    return (
      <div className="card">
        {content}
        <span className="badge">Local only</span>
      </div>
    );
  }

  return (
    <Link to={`/recipes/${recipe.id}`} className="card link">
      {content}
    </Link>
  );
}