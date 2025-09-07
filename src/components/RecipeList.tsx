import React from 'react';
import { useRecipes } from '../hooks/useFirestore';
import RecipeCard from './RecipeCard';

const RecipeList: React.FC = () => {
  const { recipes, loading, error } = useRecipes();

  if (loading) {
    return <div className="loading">Loading recipes...</div>;
  }

  if (error) {
    return <div className="error">Error loading recipes: {error}</div>;
  }

  if (recipes.length === 0) {
    return <div className="empty">No recipes found</div>;
  }

  return (
    <div className="recipe-list">
      <h1>Recipes</h1>
      <div className="recipe-grid">
        {recipes.map((recipe) => (
          <RecipeCard key={recipe.id} recipe={recipe} />
        ))}
      </div>
    </div>
  );
};

export default RecipeList;