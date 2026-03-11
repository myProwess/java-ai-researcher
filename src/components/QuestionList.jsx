import React, { memo } from 'react';
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

  return (
    <div className="question-grid">
      {questions.slice(0, 50).map((q) => (
        <QuestionCard 
          key={q.id}
          question={q} 
          isBookmarked={bookmarks.includes(q.id)}
          isMastered={masteredIds.includes(q.id)}
          toggleBookmark={toggleBookmark}
          toggleMastered={toggleMastered}
        />
      ))}
      {questions.length > 50 && (
        <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginTop: '2rem' }}>
          Showing first 50 results. Use search to find specific questions.
        </p>
      )}
    </div>
  );
};

export default memo(QuestionList);
