import { request } from "./client";
import type {
  ListParams,
  Recipe,
  RecipeInput,
  RecipesResponse,
} from "../types";

// Local (fake) recipes ki id bohat badi hoti hai, unpe server call nahi hogi
export const LOCAL_ID_START = 100000;
export const isLocalId = (id: number) => id >= LOCAL_ID_START;

// GET list (search / tag filter / sort / pagination)
export function fetchRecipes(params: ListParams, signal?: AbortSignal) {
  const { search, tag, sortBy, order, page, limit } = params;

  const query = new URLSearchParams({
    limit: String(limit),
    skip: String((page - 1) * limit),
    sortBy,
    order,
  });

  let path = "/recipes";
  if (search.trim()) {
    path = "/recipes/search";
    query.set("q", search.trim());
  } else if (tag) {
    path = `/recipes/tag/${encodeURIComponent(tag)}`;
  }

  return request<RecipesResponse>(`${path}?${query}`, { signal });
}

// GET tags list (filter dropdown ke liye)
export function fetchTags(signal?: AbortSignal) {
  return request<string[]>("/recipes/tags", { signal });
}

// GET single
export function fetchRecipe(id: number, signal?: AbortSignal) {
  return request<Recipe>(`/recipes/${id}`, { signal });
}

// POST
export function createRecipe(data: RecipeInput) {
  return request<Recipe>("/recipes/add", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

// PUT (poora update)
export function updateRecipe(id: number, data: RecipeInput) {
  return request<Recipe>(`/recipes/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

// PATCH (sirf kuch fields)
export function patchRecipe(id: number, data: Partial<RecipeInput>) {
  return request<Recipe>(`/recipes/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

// DELETE
export function deleteRecipe(id: number) {
  return request<Recipe>(`/recipes/${id}`, { method: "DELETE" });
}