export type Difficulty = "Easy" | "Medium" | "Hard";

export interface Recipe {
  id: number;
  name: string;
  ingredients: string[];
  instructions: string[];
  prepTimeMinutes: number;
  cookTimeMinutes: number;
  servings: number;
  difficulty: Difficulty;
  cuisine: string;
  caloriesPerServing: number;
  tags: string[];
  image: string;
  rating: number;
  reviewCount: number;
  mealType: string[];
}

export interface RecipesResponse {
  recipes: Recipe[];
  total: number;
  skip: number;
  limit: number;
}

// Form se jo fields aayengi
export type RecipeInput = Pick<
  Recipe,
  | "name"
  | "cuisine"
  | "difficulty"
  | "prepTimeMinutes"
  | "cookTimeMinutes"
  | "servings"
  | "caloriesPerServing"
  | "ingredients"
  | "instructions"
>;

export type SortField = "name" | "rating" | "prepTimeMinutes" | "caloriesPerServing";
export type SortOrder = "asc" | "desc";

export interface ListParams {
  search: string;
  tag: string;
  sortBy: SortField;
  order: SortOrder;
  page: number;
  limit: number;
}

export type Status = "loading" | "success" | "error";