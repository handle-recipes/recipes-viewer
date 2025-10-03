import React from 'react';
import { useFilteredData } from '../hooks/useFilteredData';
import type { Suggestion, SuggestionCategory, SuggestionPriority, SuggestionStatus } from '../types';

const SuggestionCard: React.FC<{ suggestion: Suggestion }> = ({ suggestion }) => {
  const getCategoryColor = (category: SuggestionCategory) => {
    const colors: Record<SuggestionCategory, string> = {
      feature: '#4CAF50',
      bug: '#F44336',
      improvement: '#2196F3',
      other: '#9E9E9E',
    };
    return colors[category];
  };

  const getPriorityColor = (priority: SuggestionPriority) => {
    const colors: Record<SuggestionPriority, string> = {
      high: '#F44336',
      medium: '#FF9800',
      low: '#4CAF50',
    };
    return colors[priority];
  };

  const getStatusColor = (status: SuggestionStatus) => {
    const colors: Record<SuggestionStatus, string> = {
      submitted: '#9E9E9E',
      'under-review': '#2196F3',
      accepted: '#4CAF50',
      rejected: '#F44336',
      implemented: '#00BCD4',
    };
    return colors[status];
  };

  return (
    <div className="suggestion-card">
      <div className="suggestion-header">
        <h3>{suggestion.title}</h3>
        <div className="suggestion-badges">
          <span
            className="suggestion-badge"
            style={{ backgroundColor: getCategoryColor(suggestion.category) }}
          >
            {suggestion.category}
          </span>
          <span
            className="suggestion-badge"
            style={{ backgroundColor: getPriorityColor(suggestion.priority) }}
          >
            {suggestion.priority}
          </span>
          <span
            className="suggestion-badge"
            style={{ backgroundColor: getStatusColor(suggestion.status) }}
          >
            {suggestion.status}
          </span>
        </div>
      </div>
      <p className="suggestion-description">{suggestion.description}</p>
      <div className="suggestion-footer">
        <span className="suggestion-votes">👍 {suggestion.votes}</span>
        {suggestion.relatedRecipeId && (
          <span className="suggestion-related">
            Related Recipe: {suggestion.relatedRecipeId}
          </span>
        )}
      </div>
    </div>
  );
};

const SuggestionList: React.FC = () => {
  const { suggestions, loading, error } = useFilteredData();

  if (loading) {
    return <div className="loading">Loading suggestions...</div>;
  }

  if (error) {
    return <div className="error">Error loading suggestions: {error}</div>;
  }

  if (suggestions.length === 0) {
    return <div className="empty">No suggestions found</div>;
  }

  return (
    <div className="suggestion-list">
      <h1>Suggestions</h1>
      <div className="suggestion-grid">
        {suggestions.map((suggestion) => (
          <SuggestionCard key={suggestion.id} suggestion={suggestion} />
        ))}
      </div>
    </div>
  );
};

export default SuggestionList;
