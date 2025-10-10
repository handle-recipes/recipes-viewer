import { Recipe, Ingredient, RecipeIngredient, NutritionalInfo, Unit } from '../types';

// Standard weight conversions to grams
const WEIGHT_TO_GRAMS: Record<string, number> = {
  g: 1,
  kg: 1000,
  oz: 28.3495,
  lb: 453.592,
};

interface NutritionSummary {
  totals: NutritionalInfo;
  compatibleCount: number;
  totalCount: number;
}

/**
 * Attempts to convert a quantity in a given unit to grams.
 * Returns null if conversion is not possible.
 */
function convertToGrams(
  quantity: number,
  unit: Unit,
  ingredient: Ingredient
): number | null {
  // Direct weight conversions
  if (unit in WEIGHT_TO_GRAMS) {
    return quantity * WEIGHT_TO_GRAMS[unit];
  }

  // Check for explicit unit conversions in ingredient data
  if (ingredient.unitConversions) {
    // Try to find a direct conversion to grams
    const directConversion = ingredient.unitConversions.find(
      (conv) => conv.from === unit && conv.to === 'g'
    );
    if (directConversion) {
      return quantity * directConversion.factor;
    }

    // Try to find a conversion path: unit → intermediate → g
    // For example: piece → kg → g
    for (const conv of ingredient.unitConversions) {
      if (conv.from === unit && conv.to in WEIGHT_TO_GRAMS) {
        const intermediateQuantity = quantity * conv.factor;
        return intermediateQuantity * WEIGHT_TO_GRAMS[conv.to];
      }
    }
  }

  // Cannot convert
  return null;
}

/**
 * Calculates nutritional totals for a recipe based on its ingredients.
 * Only includes ingredients that have nutrition data and convertible units.
 */
export function calculateRecipeNutrition(
  recipe: Recipe,
  ingredientsMap: Map<string, Ingredient>
): NutritionSummary | null {
  const totals: NutritionalInfo = {
    calories: 0,
    protein: 0,
    carbohydrates: 0,
    fat: 0,
    fiber: 0,
  };

  let compatibleCount = 0;
  const totalCount = recipe.ingredients.length;

  for (const recipeIngredient of recipe.ingredients) {
    // Skip if no numeric quantity (e.g., free_text)
    if (recipeIngredient.quantity === undefined || recipeIngredient.quantity === null) {
      continue;
    }

    // Get the ingredient document
    const ingredient = ingredientsMap.get(recipeIngredient.ingredientId);
    if (!ingredient || !ingredient.nutrition) {
      continue;
    }

    // Try to convert to grams
    const grams = convertToGrams(
      recipeIngredient.quantity,
      recipeIngredient.unit,
      ingredient
    );
    if (grams === null) {
      continue;
    }

    // Calculate nutrition based on per 100g values
    const multiplier = grams / 100;

    if (ingredient.nutrition.calories !== undefined) {
      totals.calories = (totals.calories || 0) + ingredient.nutrition.calories * multiplier;
    }
    if (ingredient.nutrition.protein !== undefined) {
      totals.protein = (totals.protein || 0) + ingredient.nutrition.protein * multiplier;
    }
    if (ingredient.nutrition.carbohydrates !== undefined) {
      totals.carbohydrates = (totals.carbohydrates || 0) + ingredient.nutrition.carbohydrates * multiplier;
    }
    if (ingredient.nutrition.fat !== undefined) {
      totals.fat = (totals.fat || 0) + ingredient.nutrition.fat * multiplier;
    }
    if (ingredient.nutrition.fiber !== undefined) {
      totals.fiber = (totals.fiber || 0) + ingredient.nutrition.fiber * multiplier;
    }

    compatibleCount++;
  }

  // Only return summary if at least one ingredient was compatible
  if (compatibleCount === 0) {
    return null;
  }

  return {
    totals,
    compatibleCount,
    totalCount,
  };
}
