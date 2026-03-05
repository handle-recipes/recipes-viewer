import { useLocation, useNavigate } from 'react-router-dom';
import { useFilteredData } from '../hooks/useFilteredData';
import { useGroupFilter } from '../hooks/useGroupFilter';
import { useEffect, useState } from 'react';
import styles from './AppHeader.module.css';

type HeaderProps = {
  showBackButton?: boolean;
  backLabel?: string;
  onBack?: () => void;
};

type TabType = 'recipes' | 'ingredients' | 'suggestions';

function AppHeader({ showBackButton = false, backLabel = "Back to Recipes", onBack }: HeaderProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { groupId, setGroupId } = useGroupFilter();
  const { recipes, ingredients, suggestions, allGroupIds } = useFilteredData();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setIsScrolled(prev => {
        // Shrink immediately when scrolling down
        if (scrollY > 0 && !prev) return true;
        // Only expand when fully at top
        if (scrollY === 0 && prev) return false;
        return prev;
      });
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Determine active tab from URL
  const getActiveTab = (): TabType => {
    if (location.pathname === '/ingredients') return 'ingredients';
    if (location.pathname === '/suggestions') return 'suggestions';
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

  const headerClasses = [
    styles['app-header'],
    isScrolled ? styles.scrolled : '',
    showBackButton ? styles['has-back-button'] : ''
  ].filter(Boolean).join(' ');

  return (
    <nav className={headerClasses}>
      <div className={styles['header-content']}>
        <div className={styles['header-left']}>
          {showBackButton && (
            <button onClick={handleBackClick} className={styles['back-button']}>
              ← {backLabel}
            </button>
          )}
        </div>

        <div className={styles['header-center']}>
          {!showBackButton && (
            <div className={styles['tab-navigation']}>
              <button
                className={`${styles['tab-button']} ${activeTab === 'recipes' ? styles.active : ''}`}
                onClick={() => handleTabChange('recipes')}
              >
                Recipes ({recipes.length})
              </button>
              <button
                className={`${styles['tab-button']} ${activeTab === 'ingredients' ? styles.active : ''}`}
                onClick={() => handleTabChange('ingredients')}
              >
                Ingredients ({ingredients.length})
              </button>
              <button
                className={`${styles['tab-button']} ${activeTab === 'suggestions' ? styles.active : ''}`}
                onClick={() => handleTabChange('suggestions')}
              >
                Suggestions ({suggestions.length})
              </button>
            </div>
          )}
        </div>

        <div className={styles['header-right']}>
          {!showBackButton && (
            <div className={styles['group-filter']}>
              <label htmlFor="groupIdFilter" className={styles['filter-label']}>
                Filter by Group:
              </label>
              <div className={styles['filter-dropdown-group']}>
                <select
                  id="groupIdFilter"
                  value={groupId}
                  onChange={(e) => setGroupId(e.target.value)}
                  className={styles['filter-dropdown']}
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
