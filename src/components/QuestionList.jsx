import React, { memo } from 'react';
import { List } from 'react-window';
import QuestionCard from './QuestionCard';

const QuestionList = ({ questions, bookmarks, masteredIds, toggleBookmark, toggleMastered }) => {
  
  if (questions.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--text-muted)' }}>
        <h3>No questions found matching your filters.</h3>
        <p>Try adjusting your search or filters.</p>
      </div>
    );
  }

  // Row renderer for the new react-window v2 API
  const Row = ({ index, style, ariaAttributes }) => {
    const q = questions[index];
    return (
      <div style={{ ...style, paddingBottom: '1.5rem' }} {...ariaAttributes}>
        <QuestionCard 
          question={q} 
          isBookmarked={bookmarks.includes(q.id)}
          isMastered={masteredIds.includes(q.id)}
          toggleBookmark={toggleBookmark}
          toggleMastered={toggleMastered}
        />
      </div>
    );
  };

  return (
    <div style={{ height: '70vh', width: '100%' }}>
      <List
        rowCount={questions.length}
        rowHeight={160} // Fixed height for this implementation
        rowComponent={Row}
        style={{ height: '100%', width: '100%' }}
      />
    </div>
  );
};

export default memo(QuestionList);
