import React, { useState, useMemo } from 'react';
import { Recipe, RecipeIngredient, Ingredient, NutritionalInfo } from '../types';
import { calculateRecipeNutrition } from '../utils/nutritionCalculator';

interface RecipeDetailProps {
  recipe: Recipe;
  ingredients: Ingredient[];
}

const RecipeDetail: React.FC<RecipeDetailProps> = ({ recipe, ingredients }) => {
  const [showPerServing, setShowPerServing] = useState(false);

  // Create a map of ingredients for quick lookup
  const ingredientsMap = useMemo(() => {
    return new Map(ingredients.map(ing => [ing.id, ing]));
  }, [ingredients]);

  // Calculate nutrition summary
  const nutritionSummary = useMemo(() => {
    return calculateRecipeNutrition(recipe, ingredientsMap);
  }, [recipe, ingredientsMap]);

  const renderIngredient = (ingredient: RecipeIngredient, index: number) => {
    let displayText = `${ingredient.ingredientId}`;

    if (ingredient.unit === 'free_text' && ingredient.quantityText) {
      displayText = `${ingredient.quantityText} ${ingredient.ingredientId}`;
    } else if (ingredient.quantity) {
      displayText = `${ingredient.quantity} ${ingredient.unit} ${ingredient.ingredientId}`;
    }

    if (ingredient.note) {
      displayText += ` (${ingredient.note})`;
    }

    return (
      <li key={index} className="ingredient-item">
        {displayText}
      </li>
    );
  };

  const renderNutrition = (totals: NutritionalInfo, perServing: boolean, servings: number) => {
    const divisor = perServing ? servings : 1;
    const label = perServing ? 'per serving' : 'total';

    return (
      <div className="nutrition-values">
        {totals.calories !== undefined && totals.calories > 0 && (
          <div className="nutrition-item">
            <span className="nutrition-label">Calories:</span>
            <span className="nutrition-value">{Math.round(totals.calories / divisor)} kcal</span>
          </div>
        )}
        {totals.protein !== undefined && totals.protein > 0 && (
          <div className="nutrition-item">
            <span className="nutrition-label">Protein:</span>
            <span className="nutrition-value">{(totals.protein / divisor).toFixed(1)} g</span>
          </div>
        )}
        {totals.carbohydrates !== undefined && totals.carbohydrates > 0 && (
          <div className="nutrition-item">
            <span className="nutrition-label">Carbs:</span>
            <span className="nutrition-value">{(totals.carbohydrates / divisor).toFixed(1)} g</span>
          </div>
        )}
        {totals.fat !== undefined && totals.fat > 0 && (
          <div className="nutrition-item">
            <span className="nutrition-label">Fat:</span>
            <span className="nutrition-value">{(totals.fat / divisor).toFixed(1)} g</span>
          </div>
        )}
        {totals.fiber !== undefined && totals.fiber > 0 && (
          <div className="nutrition-item">
            <span className="nutrition-label">Fiber:</span>
            <span className="nutrition-value">{(totals.fiber / divisor).toFixed(1)} g</span>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="recipe-detail">
      <div className="recipe-header">
        <h1>{recipe.name}</h1>
        <p className="recipe-description">{recipe.description}</p>

        <div className="recipe-meta">
          <span className="recipe-servings">Servings: {recipe.servings}</span>
          {recipe.tags && recipe.tags.length > 0 && (
            <div className="recipe-tags">
              {recipe.tags.map((tag) => (
                <span key={tag} className="tag">
                  {tag}
                </span>
              ))}
            </div>
          )}
          {recipe.categories && recipe.categories.length > 0 && (
            <div className="recipe-categories">
              {recipe.categories.map((category) => (
                <span key={category} className="category">
                  {category}
                </span>
              ))}
            </div>
          )}
          {recipe.sourceUrl && (
            <p className="source-url">
              Source: <a href={recipe.sourceUrl} target="_blank" rel="noopener noreferrer">{recipe.sourceUrl}</a>
            </p>
          )}
          {recipe.variantOf && (
            <p className="variant-info">
              <em>Variant of: {recipe.variantOf}</em>
            </p>
          )}
        </div>
      </div>

      <div className="recipe-layout">
        {recipe.ingredients && recipe.ingredients.length > 0 && (
          <div className="recipe-ingredients-sidebar">
            <h2>Ingredients</h2>
            <ul>
              {recipe.ingredients.map(renderIngredient)}
            </ul>

            {nutritionSummary && (
              <div className="nutrition-summary">
                <div className="nutrition-header">
                  <h3>Nutrition</h3>
                  <button
                    className="nutrition-toggle"
                    onClick={() => setShowPerServing(!showPerServing)}
                  >
                    {showPerServing ? 'Total' : 'Per Serving'}
                  </button>
                </div>
                <div className="nutrition-note">
                  (based on {nutritionSummary.compatibleCount} of {nutritionSummary.totalCount} ingredients)
                </div>
                {renderNutrition(nutritionSummary.totals, showPerServing, recipe.servings)}
              </div>
            )}
          </div>
        )}

        {recipe.steps && recipe.steps.length > 0 && (
          <div className="recipe-instructions-main">
            <h2>Instructions</h2>
            <div className="steps-container">
              {recipe.steps.map((step, index) => (
                <div key={index} className="instruction-step-box">
                  <div className="step-number">{index + 1}</div>
                  <div className="step-content">
                    <p className="step-text">{step.text}</p>
                    {step.imageUrl && (
                      <img
                        src={step.imageUrl}
                        alt={`Step ${index + 1}`}
                        className="step-image"
                      />
                    )}
                    {step.equipment && step.equipment.length > 0 && (
                      <p className="equipment">Equipment: {step.equipment.join(', ')}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecipeDetail;