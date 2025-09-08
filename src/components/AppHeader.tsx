import { useLocation, useNavigate } from 'react-router-dom';
import { useRecipes, useIngredients } from '../hooks/useFirestore';

type HeaderProps = {
  showBackButton?: boolean;
  backLabel?: string;
  onBack?: () => void;
};

type TabType = 'recipes' | 'ingredients';

function AppHeader({ showBackButton = false, backLabel = "Back to Recipes", onBack }: HeaderProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { recipes } = useRecipes();
  const { ingredients } = useIngredients();

  // Determine active tab from URL
  const getActiveTab = (): TabType => {
    if (location.pathname === '/ingredients') return 'ingredients';
    return 'recipes'; // default to recipes for '/' and '/recipes'
  };

  const activeTab = getActiveTab();

  const handleTabChange = (tab: TabType) => {
    navigate(`/${tab}`);
  };

  const handleBackClick = () => {
    if (onBack) {
      onBack();
    } else {
      navigate('/recipes');
    }
  };

  if (showBackButton) {
    return (
      <nav className="app-header">
        <div className="back-button-container">
          <button onClick={handleBackClick} className="back-button">
            ← {backLabel}
          </button>
        </div>
      </nav>
    );
  }

  return (
    <nav className="app-header">
      <div className="tab-navigation">
        <button
          className={`tab-button ${activeTab === 'recipes' ? 'active' : ''}`}
          onClick={() => handleTabChange('recipes')}
        >
          Recipes ({recipes.length})
        </button>
        <button
          className={`tab-button ${activeTab === 'ingredients' ? 'active' : ''}`}
          onClick={() => handleTabChange('ingredients')}
        >
          Ingredients ({ingredients.length})
        </button>
      </div>
    </nav>
  );
}

export default AppHeader;