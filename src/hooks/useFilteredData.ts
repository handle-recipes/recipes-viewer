import { useRecipes, useIngredients } from "./useFirestore";
import { useGroupFilter } from "./useGroupFilter";

// Custom hook that combines recipes and ingredients data with client-side filtering
export function useFilteredData() {
  const {
    recipes,
    loading: recipesLoading,
    error: recipesError,
    groupIds: recipeGroupIds,
  } = useRecipes();
  const {
    ingredients,
    loading: ingredientsLoading,
    error: ingredientsError,
    groupIds: ingredientGroupIds,
  } = useIngredients();
  const { groupId } = useGroupFilter();

  // Combine and deduplicate group IDs from both sources
  const allGroupIds = Array.from(
    new Set([...recipeGroupIds, ...ingredientGroupIds])
  ).sort();

  // Filter data based on selected group ID
  const filteredRecipes = groupId
    ? recipes.filter((recipe) => recipe.createdByGroupId === groupId)
    : recipes;

  const filteredIngredients = groupId
    ? ingredients.filter(
        (ingredient) => ingredient.createdByGroupId === groupId
      )
    : ingredients;

  return {
    recipes: filteredRecipes,
    ingredients: filteredIngredients,
    allGroupIds,
    loading: recipesLoading || ingredientsLoading,
    error: recipesError || ingredientsError,
  };
}
