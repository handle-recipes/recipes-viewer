import React, { useState, useMemo } from 'react';
import { Recipe, RecipeIngredient, Ingredient, NutritionalInfo } from '../types';
import { calculateRecipeNutrition } from '../utils/nutritionCalculator';
import styles from './RecipeDetail.module.css';

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
    // Get the ingredient name from the ingredients map, fallback to ID
    const ingredientDoc = ingredientsMap.get(ingredient.ingredientId);
    const ingredientName = ingredientDoc?.name || ingredient.ingredientId;

    return (
      <li key={index} className={styles['ingredient-item']}>
        {ingredient.unit === 'free_text' && ingredient.quantityText ? (
          <>
            <span className={styles['ingredient-quantity']}>{ingredient.quantityText}</span>{' '}
            <span className={styles['ingredient-name']}>{ingredientName}</span>
          </>
        ) : ingredient.quantity ? (
          <>
            <span className={styles['ingredient-quantity']}>{ingredient.quantity} {ingredient.unit}</span>{' '}
            <span className={styles['ingredient-name']}>{ingredientName}</span>
          </>
        ) : (
          <span className={styles['ingredient-name']}>{ingredientName}</span>
        )}
        {ingredient.note && <span className={styles['ingredient-note']}> ({ingredient.note})</span>}
      </li>
    );
  };

  const renderNutrition = (totals: NutritionalInfo, perServing: boolean, servings: number) => {
    const divisor = perServing ? servings : 1;

    return (
      <div className={styles['nutrition-values']}>
        {totals.calories !== undefined && totals.calories > 0 && (
          <div className={styles['nutrition-item']}>
            <span className={styles['nutrition-label']}>Calories:</span>
            <span className={styles['nutrition-value']}>{Math.round(totals.calories / divisor)} kcal</span>
          </div>
        )}
        {totals.protein !== undefined && totals.protein > 0 && (
          <div className={styles['nutrition-item']}>
            <span className={styles['nutrition-label']}>Protein:</span>
            <span className={styles['nutrition-value']}>{(totals.protein / divisor).toFixed(1)} g</span>
          </div>
        )}
        {totals.carbohydrates !== undefined && totals.carbohydrates > 0 && (
          <div className={styles['nutrition-item']}>
            <span className={styles['nutrition-label']}>Carbs:</span>
            <span className={styles['nutrition-value']}>{(totals.carbohydrates / divisor).toFixed(1)} g</span>
          </div>
        )}
        {totals.fat !== undefined && totals.fat > 0 && (
          <div className={styles['nutrition-item']}>
            <span className={styles['nutrition-label']}>Fat:</span>
            <span className={styles['nutrition-value']}>{(totals.fat / divisor).toFixed(1)} g</span>
          </div>
        )}
        {totals.fiber !== undefined && totals.fiber > 0 && (
          <div className={styles['nutrition-item']}>
            <span className={styles['nutrition-label']}>Fiber:</span>
            <span className={styles['nutrition-value']}>{(totals.fiber / divisor).toFixed(1)} g</span>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={styles['recipe-detail']}>
      <div className={styles['recipe-header']}>
        <h1>{recipe.name}</h1>
        <p className={styles['recipe-description']}>{recipe.description}</p>

        <div className={styles['recipe-meta']}>
          <span className={styles['recipe-servings']}>Servings: {recipe.servings}</span>
          {recipe.tags && recipe.tags.length > 0 && (
            <div className={styles['recipe-tags']}>
              {recipe.tags.map((tag) => (
                <span key={tag} className={styles.tag}>
                  {tag}
                </span>
              ))}
            </div>
          )}
          {recipe.categories && recipe.categories.length > 0 && (
            <div className={styles['recipe-categories']}>
              {recipe.categories.map((category) => (
                <span key={category} className={styles.category}>
                  {category}
                </span>
              ))}
            </div>
          )}
          {recipe.sourceUrl && (
            <p className={styles['source-url']}>
              Source: <a href={recipe.sourceUrl} target="_blank" rel="noopener noreferrer">{recipe.sourceUrl}</a>
            </p>
          )}
          {recipe.variantOf && (
            <p className={styles['variant-info']}>
              <em>Variant of: {recipe.variantOf}</em>
            </p>
          )}
        </div>
      </div>

      <div className={styles['recipe-layout']}>
        {recipe.ingredients && recipe.ingredients.length > 0 && (
          <div className={styles['recipe-ingredients-sidebar']}>
            <h2>Ingredients</h2>
            <ul>
              {recipe.ingredients.map(renderIngredient)}
            </ul>

            {nutritionSummary && (
              <div className={styles['nutrition-summary']}>
                <div className={styles['nutrition-header']}>
                  <h3>{showPerServing ? 'Nutrition per serving' : 'Total nutrition'}</h3>
                  <button
                    className={styles['nutrition-toggle']}
                    onClick={() => setShowPerServing(!showPerServing)}
                  >
                    {showPerServing ? 'Show total' : 'Show per serving'}
                  </button>
                </div>
                <div className={styles['nutrition-note']}>
                  (based on {nutritionSummary.compatibleCount} of {nutritionSummary.totalCount} ingredients)
                </div>
                {renderNutrition(nutritionSummary.totals, showPerServing, recipe.servings)}
              </div>
            )}
          </div>
        )}

        {recipe.steps && recipe.steps.length > 0 && (
          <div className={styles['recipe-instructions-main']}>
            <h2>Instructions</h2>
            <div className={styles['steps-container']}>
              {recipe.steps.map((step, index) => (
                <div key={index} className={styles['instruction-step-box']}>
                  <div className={styles['step-number']}>{index + 1}</div>
                  <div className={styles['step-content']}>
                    <p className={styles['step-text']}>{step.text}</p>
                    {step.imageUrl && (
                      <img
                        src={step.imageUrl}
                        alt={`Step ${index + 1}`}
                        className={styles['step-image']}
                      />
                    )}
                    {step.equipment && step.equipment.length > 0 && (
                      <p className={styles.equipment}>Equipment: {step.equipment.join(', ')}</p>
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
