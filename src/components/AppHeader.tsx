import { useLocation, useNavigate } from 'react-router-dom';
import { useFilteredData } from '../hooks/useFilteredData';
import { useGroupFilter } from '../hooks/useGroupFilter';

type HeaderProps = {
  showBackButton?: boolean;
  backLabel?: string;
  onBack?: () => void;
};

type TabType = 'recipes' | 'ingredients';

function AppHeader({ showBackButton = false, backLabel = "Back to Recipes", onBack }: HeaderProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { groupId, setGroupId } = useGroupFilter();
  const { recipes, ingredients, allGroupIds } = useFilteredData();

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

  return (
    <nav className="app-header">
      <div className="header-content">
        <div className="header-left">
          {showBackButton && (
            <button onClick={handleBackClick} className="back-button">
              ← {backLabel}
            </button>
          )}
        </div>

        <div className="header-center">
          {!showBackButton && (
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
          )}
        </div>

        <div className="header-right">
          {!showBackButton && (
            <div className="group-filter">
              <label htmlFor="groupIdFilter" className="filter-label">
                Filter by Group:
              </label>
              <div className="filter-dropdown-group">
                <select
                  id="groupIdFilter"
                  value={groupId}
                  onChange={(e) => setGroupId(e.target.value)}
                  className="filter-dropdown"
                >
                  <option value="">All Groups</option>
                  {allGroupIds.map((id) => (
                    <option key={id} value={id}>
                      {id}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default AppHeader;