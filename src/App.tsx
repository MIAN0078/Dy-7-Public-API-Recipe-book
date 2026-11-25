import { Link, Route, Routes } from "react-router-dom";
import RecipesPage from "./pages/RecipesPage";
import RecipeDetailPage from "./pages/RecipeDetailPage";

export default function App() {
  return (
    <div className="container">
      <h1>
        <Link to="/" className="title-link">🍳 Recipe Book</Link>
      </h1>

      <Routes>
        <Route path="/" element={<RecipesPage />} />
        <Route path="/recipes/:id" element={<RecipeDetailPage />} />
        <Route
          path="*"
          element={
            <div className="state">
              <p>Page not found.</p>
              <Link to="/" className="btn">Go home</Link>
            </div>
          }
        />
      </Routes>
    </div>
  );
}