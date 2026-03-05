import React from 'react';
import { Recipe } from '../types';
import styles from './RecipeCard.module.css';

interface RecipeCardProps {
  recipe: Recipe;
  onRecipeSelect: (recipe: Recipe) => void;
}

const RecipeCard: React.FC<RecipeCardProps> = ({ recipe, onRecipeSelect }) => {

  return (
    <div className={styles['recipe-card']} onClick={() => onRecipeSelect(recipe)}>
      <div className={styles['recipe-content']}>
        <h3>{recipe.name}</h3>
        {recipe.description && (
          <p className={styles['recipe-description']}>{recipe.description}</p>
        )}
        <p className={styles['recipe-servings']}>Servings: {recipe.servings}</p>
      </div>
    </div>
  );
};

export default RecipeCard;
