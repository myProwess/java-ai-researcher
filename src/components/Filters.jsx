import React from 'react';

const Filters = ({ totalCount }) => {

  return (
    <div className="filters-bar">

      
      <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
        Found <strong>{totalCount}</strong> questions
      </div>
    </div>
  );
};

export default Filters;
