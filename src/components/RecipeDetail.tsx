import React from 'react';
import { Recipe, RecipeIngredient } from '../types';

interface RecipeDetailProps {
  recipe: Recipe;
}

const RecipeDetail: React.FC<RecipeDetailProps> = ({ recipe }) => {
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

  return (
    <div className="recipe-detail">
      {recipe.imageUrl && (
        <div className="recipe-hero-image">
          <img
            src={recipe.imageUrl}
            alt={recipe.name || 'Recipe'}
            style={{ width: '100%', height: '400px', objectFit: 'cover' }}
          />
        </div>
      )}

      <div className="recipe-header">
        <h1>{recipe.name}</h1>
        <p className="recipe-description">{recipe.description}</p>

        <div className="recipe-meta">
          <span className="recipe-servings">Servings: {recipe.servings}</span>
        </div>
      </div>

      <div className="recipe-content">
        {recipe.ingredients && recipe.ingredients.length > 0 && (
          <div className="recipe-ingredients">
            <h2>Ingredients</h2>
            <ul>
              {recipe.ingredients.map(renderIngredient)}
            </ul>
          </div>
        )}

        {recipe.steps && recipe.steps.length > 0 && (
          <div className="recipe-instructions">
            <h2>Instructions</h2>
            <ol>
              {recipe.steps.map((step, index) => (
                <li key={index} className="instruction-step">
                  {step.text}
                  {step.imageUrl && (
                    <img
                      src={step.imageUrl}
                      alt={`Step ${index + 1}`}
                      style={{ maxWidth: '100%', height: 'auto', marginTop: '10px' }}
                    />
                  )}
                  {step.equipment && step.equipment.length > 0 && (
                    <p className="equipment">Equipment: {step.equipment.join(', ')}</p>
                  )}
                </li>
              ))}
            </ol>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecipeDetail;