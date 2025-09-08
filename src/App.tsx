import { useState } from 'react';
import { useRecipes, useIngredients } from './hooks/useFirestore';
import RecipeList from './components/RecipeList';
import IngredientList from './components/IngredientList';
import './App.css';

type TabType = 'recipes' | 'ingredients';

function App() {
  const [activeTab, setActiveTab] = useState<TabType>('recipes');
  const { recipes } = useRecipes();
  const { ingredients } = useIngredients();

  return (
    <div className="App">
      <nav className="tab-navigation">
        <button
          className={`tab-button ${activeTab === 'recipes' ? 'active' : ''}`}
          onClick={() => setActiveTab('recipes')}
        >
          Recipes ({recipes.length})
        </button>
        <button
          className={`tab-button ${activeTab === 'ingredients' ? 'active' : ''}`}
          onClick={() => setActiveTab('ingredients')}
        >
          Ingredients ({ingredients.length})
        </button>
      </nav>
      
      <div className="tab-content">
        {activeTab === 'recipes' ? <RecipeList /> : <IngredientList />}
      </div>
    </div>
  );
}

export default App
