import { useLocation, useNavigate } from 'react-router-dom';
import AppHeader from './AppHeader';
import RecipeList from './RecipeList';
import IngredientList from './IngredientList';

type TabType = 'recipes' | 'ingredients';

function HomePage() {
  const location = useLocation();
  const navigate = useNavigate();

  // Determine active tab from URL
  const getActiveTab = (): TabType => {
    if (location.pathname === '/ingredients') return 'ingredients';
    return 'recipes'; // default to recipes for '/' and '/recipes'
  };

  const activeTab = getActiveTab();

  const handleRecipeSelect = (recipe: any) => {
    const slug = recipe.slug || recipe.id;
    navigate(`/recipe/${slug}`);
  };

  return (
    <>
      <AppHeader />

      <div className="tab-content">
        {activeTab === 'recipes' ? (
          <RecipeList onRecipeSelect={handleRecipeSelect} />
        ) : (
          <IngredientList />
        )}
      </div>
    </>
  );
}

export default HomePage;