import React from 'react';
import slugify from 'slugify';
import { Recipe } from '../types';

interface RecipeCardProps {
  recipe: Recipe;
  onRecipeSelect: (recipe: Recipe) => void;
}

const RecipeCard: React.FC<RecipeCardProps> = ({ recipe, onRecipeSelect }) => {
  const slug = recipe.slug || slugify(recipe.name, { lower: true, strict: true });

  return (
    <div className="recipe-card" onClick={() => onRecipeSelect(recipe)}>
      {recipe.imageUrl && (
        <div className="recipe-image">
          <img 
            src={recipe.imageUrl} 
            alt={recipe.name} 
            style={{ width: '100%', height: '200px', objectFit: 'cover' }}
          />
        </div>
      )}
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