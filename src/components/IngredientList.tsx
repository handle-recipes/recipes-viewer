import React from 'react';
import { useIngredients } from '../hooks/useFirestore';
import type { Ingredient } from '../types';

const IngredientCard: React.FC<{ ingredient: Ingredient }> = ({ ingredient }) => {
  return (
    <div className="ingredient-card">
      <h3>{ingredient.name}</h3>
      {ingredient.aliases && ingredient.aliases.length > 0 && (
        <p className="aliases">
          <strong>Aliases:</strong> {ingredient.aliases.join(', ')}
        </p>
      )}
      {ingredient.categories && ingredient.categories.length > 0 && (
        <div className="categories">
          {ingredient.categories.map((category) => (
            <span key={category} className="category-tag">
              {category}
            </span>
          ))}
        </div>
      )}
      {ingredient.allergens && ingredient.allergens.length > 0 && (
        <div className="allergens">
          <strong>Allergens:</strong> {ingredient.allergens.join(', ')}
        </div>
      )}
    </div>
  );
};

const IngredientList: React.FC = () => {
  const { ingredients, loading, error } = useIngredients();

  if (loading) {
    return <div className="loading">Loading ingredients...</div>;
  }

  if (error) {
    return <div className="error">Error loading ingredients: {error}</div>;
  }

  if (ingredients.length === 0) {
    return <div className="empty">No ingredients found</div>;
  }

  return (
    <div className="ingredient-list">
      <h1>Ingredients</h1>
      <div className="ingredient-grid">
        {ingredients.map((ingredient) => (
          <IngredientCard key={ingredient.id} ingredient={ingredient} />
        ))}
      </div>
    </div>
  );
};

export default IngredientList;