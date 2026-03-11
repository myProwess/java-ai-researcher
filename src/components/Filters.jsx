import React from 'react';

const Filters = ({ selectedDifficulty, setSelectedDifficulty, totalCount }) => {
  const levels = ['All', 'Basic', 'Intermediate', 'Advanced'];

  return (
    <div className="filters-bar">
      <div className="difficulty-tabs">
        {levels.map(level => (
          <button
            key={level}
            className={`tab ${selectedDifficulty === level ? 'active' : ''}`}
            onClick={() => setSelectedDifficulty(level)}
          >
            {level}
          </button>
        ))}
      </div>
      
      <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
        Found <strong>{totalCount}</strong> questions
      </div>
    </div>
  );
};

export default Filters;
