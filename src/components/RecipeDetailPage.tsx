import { useParams, useNavigate } from 'react-router-dom';
import { useRecipes } from '../hooks/useFirestore';
import AppHeader from './AppHeader';
import RecipeDetail from './RecipeDetail';

function RecipeDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { recipes, loading, error } = useRecipes();

  const handleBack = () => {
    navigate('/recipes');
  };

  if (loading) {
    return (
      <>
        <AppHeader showBackButton onBack={handleBack} />
        <div className="loading">Loading recipe...</div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <AppHeader showBackButton onBack={handleBack} />
        <div className="error">Error loading recipe: {error}</div>
      </>
    );
  }

  // Find recipe by slug or id
  const recipe = recipes.find(r => r.slug === slug || r.id === slug);

  if (!recipe) {
    return (
      <>
        <AppHeader showBackButton onBack={handleBack} />
        <div className="error">Recipe not found</div>
      </>
    );
  }

  return (
    <>
      <AppHeader showBackButton onBack={handleBack} />
      <RecipeDetail recipe={recipe} />
    </>
  );
}

export default RecipeDetailPage;