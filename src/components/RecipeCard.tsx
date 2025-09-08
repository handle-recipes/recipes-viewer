import React from 'react';
import { Recipe } from '../types';

interface RecipeCardProps {
  recipe: Recipe;
  onRecipeSelect: (recipe: Recipe) => void;
}

const RecipeCard: React.FC<RecipeCardProps> = ({ recipe, onRecipeSelect }) => {

  return (
    <div className="recipe-card" onClick={() => onRecipeSelect(recipe)}>
      <div className="recipe-content">
        <h3>{recipe.name}</h3>
        {recipe.description && (
          <p className="recipe-description">{recipe.description}</p>
        )}
        <p className="recipe-servings">Servings: {recipe.servings}</p>
      </div>
    </div>
  );
};

export default RecipeCard;