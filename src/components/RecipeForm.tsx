import { useState } from "react";
import type { Difficulty, Recipe, RecipeInput } from "../types";

interface Props {
  initial: Recipe | null; // null = Add mode, object = Edit mode
  saving: boolean;
  onSubmit: (data: RecipeInput) => void;
  onCancel: () => void;
}

const toLines = (text: string) =>
  text
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

export default function RecipeForm({ initial, saving, onSubmit, onCancel }: Props) {
  const [name, setName] = useState(initial?.name ?? "");
  const [cuisine, setCuisine] = useState(initial?.cuisine ?? "");
  const [difficulty, setDifficulty] = useState<Difficulty>(
    initial?.difficulty ?? "Easy"
  );
  const [prep, setPrep] = useState(initial?.prepTimeMinutes ?? 10);
  const [cook, setCook] = useState(initial?.cookTimeMinutes ?? 20);
  const [servings, setServings] = useState(initial?.servings ?? 2);
  const [calories, setCalories] = useState(initial?.caloriesPerServing ?? 300);
  const [ingredients, setIngredients] = useState(
    initial?.ingredients.join("\n") ?? ""
  );
  const [instructions, setInstructions] = useState(
    initial?.instructions.join("\n") ?? ""
  );
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const ing = toLines(ingredients);
    const ins = toLines(instructions);

    if (!name.trim()) return setError("Recipe ka naam zaroori hai");
    if (!cuisine.trim()) return setError("Cuisine zaroori hai");
    if (prep < 0 || cook < 0) return setError("Time negative nahi ho sakta");
    if (servings < 1) return setError("Servings kam az kam 1 honi chahiye");
    if (ing.length === 0) return setError("Kam az kam ek ingredient likho");
    if (ins.length === 0) return setError("Kam az kam ek instruction likho");

    setError(null);
    onSubmit({
      name: name.trim(),
      cuisine: cuisine.trim(),
      difficulty,
      prepTimeMinutes: prep,
      cookTimeMinutes: cook,
      servings,
      caloriesPerServing: calories,
      ingredients: ing,
      instructions: ins,
    });
  }

  return (
    <div className="overlay" onClick={onCancel}>
      <form
        className="modal"
        onClick={(e) => e.stopPropagation()}
        onSubmit={handleSubmit}
      >
        <h2>{initial ? "Edit Recipe" : "Add Recipe"}</h2>

        <label>
          Name
          <input value={name} onChange={(e) => setName(e.target.value)} />
        </label>

        <div className="row">
          <label>
            Cuisine
            <input value={cuisine} onChange={(e) => setCuisine(e.target.value)} />
          </label>
          <label>
            Difficulty
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value as Difficulty)}
            >
              <option>Easy</option>
              <option>Medium</option>
              <option>Hard</option>
            </select>
          </label>
        </div>

        <div className="row">
          <label>
            Prep (min)
            <input
              type="number"
              value={prep}
              onChange={(e) => setPrep(Number(e.target.value))}
            />
          </label>
          <label>
            Cook (min)
            <input
              type="number"
              value={cook}
              onChange={(e) => setCook(Number(e.target.value))}
            />
          </label>
        </div>

        <div className="row">
          <label>
            Servings
            <input
              type="number"
              value={servings}
              onChange={(e) => setServings(Number(e.target.value))}
            />
          </label>
          <label>
            Calories / serving
            <input
              type="number"
              value={calories}
              onChange={(e) => setCalories(Number(e.target.value))}
            />
          </label>
        </div>

        <label>
          Ingredients (ek line = ek item)
          <textarea
            rows={4}
            value={ingredients}
            onChange={(e) => setIngredients(e.target.value)}
          />
        </label>

        <label>
          Instructions (ek line = ek step)
          <textarea
            rows={4}
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
          />
        </label>

        {error && <p className="form-error">{error}</p>}

        <div className="actions">
          <button type="button" className="btn" onClick={onCancel}>
            Cancel
          </button>
          <button type="submit" className="btn primary" disabled={saving}>
            {saving ? "Saving..." : "Save"}
          </button>
        </div>
      </form>
    </div>
  );
}