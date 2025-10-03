import { useRecipes, useIngredients, useSuggestions } from "./useFirestore";
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
  const {
    suggestions,
    loading: suggestionsLoading,
    error: suggestionsError,
    groupIds: suggestionGroupIds,
  } = useSuggestions();
  const { groupId } = useGroupFilter();

  // Combine and deduplicate group IDs from all sources
  const allGroupIds = Array.from(
    new Set([...recipeGroupIds, ...ingredientGroupIds, ...suggestionGroupIds])
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

  const filteredSuggestions = groupId
    ? suggestions.filter(
        (suggestion) => suggestion.submittedByGroupId === groupId
      )
    : suggestions;

  return {
    recipes: filteredRecipes,
    ingredients: filteredIngredients,
    suggestions: filteredSuggestions,
    allGroupIds,
    loading: recipesLoading || ingredientsLoading || suggestionsLoading,
    error: recipesError || ingredientsError || suggestionsError,
  };
}
