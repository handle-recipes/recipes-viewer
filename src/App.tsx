import { Routes, Route } from 'react-router-dom';
import HomePage from './components/HomePage';
import RecipeDetailPage from './components/RecipeDetailPage';
import './App.css';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/recipes" element={<HomePage />} />
        <Route path="/ingredients" element={<HomePage />} />
        <Route path="/recipe/:slug" element={<RecipeDetailPage />} />
      </Routes>
    </div>
  );
}

export default App
