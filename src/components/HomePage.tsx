import { useLocation, useNavigate } from 'react-router-dom';
import AppHeader from './AppHeader';
import RecipeList from './RecipeList';
import IngredientList from './IngredientList';
import SuggestionList from './SuggestionList';
import styles from './HomePage.module.css';

type TabType = 'recipes' | 'ingredients' | 'suggestions';

function HomePage() {
  const location = useLocation();
  const navigate = useNavigate();

  // Determine active tab from URL
  const getActiveTab = (): TabType => {
    if (location.pathname === '/ingredients') return 'ingredients';
    if (location.pathname === '/suggestions') return 'suggestions';
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

      <div style={{
        background: 'linear-gradient(90deg, #FF0000, #FF8800, #FFFF00, #00FF00, #0000FF, #8800FF)',
        padding: '2px 0',
        overflow: 'hidden',
        borderBottom: '2px groove #c0c0c0'
      }}>
        <div style={{
          background: '#000',
          padding: '4px 0',
          overflow: 'hidden',
          whiteSpace: 'nowrap'
        }}>
          <span style={{
            display: 'inline-block',
            animation: 'marquee 15s linear infinite',
            color: '#00FF00',
            fontFamily: "'Comic Neue', 'Comic Sans MS', cursive",
            fontWeight: 700,
            fontSize: '0.9rem'
          }}>
            ~*~ Welcome to the ULTIMATE Recipe Database!!! ~*~ Updated Daily ~*~ Sign my Guestbook! ~*~ You are visitor #
            {Math.floor(Math.random() * 99999).toString().padStart(5, '0')} ~*~ Best viewed in Netscape Navigator 4.0+ ~*~
          </span>
        </div>
      </div>

      <div className={styles['tab-content']}>
        <div style={{
          textAlign: 'center',
          margin: '0 0 15px 0',
          padding: '8px',
          background: '#FFCCCC',
          border: '2px dashed #FF0000',
          fontSize: '0.8rem',
          color: '#FF0000',
          fontWeight: 700
        }}>
          {String.fromCodePoint(0x1F6A7)} UNDER CONSTRUCTION {String.fromCodePoint(0x1F6A7)} - This page is always being improved! Come back soon for more recipes!
        </div>

        {activeTab === 'recipes' ? (
          <RecipeList onRecipeSelect={handleRecipeSelect} />
        ) : activeTab === 'ingredients' ? (
          <IngredientList />
        ) : (
          <SuggestionList />
        )}

        <div style={{
          textAlign: 'center',
          margin: '20px 0 10px 0',
          padding: '10px',
          borderTop: '3px double #000080',
          fontSize: '0.75rem',
          color: '#666'
        }}>
          <hr style={{
            border: 'none',
            height: '3px',
            background: 'linear-gradient(90deg, #FF0000, #FF8800, #FFFF00, #00FF00, #0000FF, #8800FF)',
            marginBottom: '10px'
          }} />
          <p style={{ margin: '4px 0' }}>
            Made with {String.fromCodePoint(0x2764)} by <span style={{ color: '#0000FF', fontWeight: 700 }}>WebMaster2000</span>
          </p>
          <p style={{ margin: '4px 0' }}>
            <span style={{ fontWeight: 700 }}>Visitors:</span>{' '}
            <span style={{
              fontFamily: 'monospace',
              background: '#000',
              color: '#00FF00',
              padding: '2px 6px',
              border: '1px inset #c0c0c0'
            }}>
              {String(Math.floor(Math.random() * 999999)).padStart(6, '0')}
            </span>
          </p>
          <p style={{ margin: '4px 0', fontSize: '0.7rem' }}>
            This site is best viewed at <span style={{ fontWeight: 700 }}>800x600</span> resolution with <span style={{ fontWeight: 700 }}>Internet Explorer 6.0</span>
          </p>
          <p style={{ margin: '8px 0 0 0', fontSize: '0.7rem' }}>
            <a href="#" style={{ color: '#0000FF' }}>Sign my Guestbook!</a> | <a href="#" style={{ color: '#0000FF' }}>View Guestbook</a> | <a href="#" style={{ color: '#0000FF' }}>Cool Links</a> | <a href="#" style={{ color: '#0000FF' }}>Webrings</a>
          </p>
        </div>
      </div>
    </>
  );
}

export default HomePage;
