import React, { memo } from 'react';
import { FixedSizeList as List } from 'react-window';
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

  // Row renderer for react-window
  const Row = ({ index, style }) => {
    const q = questions[index];
    return (
      <div style={{ ...style, paddingBottom: '1.5rem' }}>
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
        height={700}
        itemCount={questions.length}
        itemSize={160} // approximate height of card
        width={'100%'}
      >
        {Row}
      </List>
    </div>
  );
};

export default memo(QuestionList);
