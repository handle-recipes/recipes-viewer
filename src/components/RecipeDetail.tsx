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