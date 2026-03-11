import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import QuestionCard from '../components/QuestionCard';
import React from 'react';

const mockQuestion = {
  id: 1,
  question: 'What is the JVM?',
  answer: 'Java Virtual Machine',
  topic: 'JVM'
};

describe('QuestionCard Component', () => {
  const toggleBookmark = vi.fn();
  const toggleMastered = vi.fn();

  it('renders correctly', () => {
    render(
      <QuestionCard 
        question={mockQuestion} 
        isBookmarked={false} 
        isMastered={false} 
        toggleBookmark={toggleBookmark}
        toggleMastered={toggleMastered}
      />
    );
    expect(screen.getByText(/What is the JVM\?/i)).toBeInTheDocument();
  });

  it('reveals answer on click', () => {
    render(
      <QuestionCard 
        question={mockQuestion} 
        isBookmarked={false} 
        isMastered={false} 
        toggleBookmark={toggleBookmark}
        toggleMastered={toggleMastered}
      />
    );
    
    // Use the header area which has the click handler
    const title = screen.getByText(/What is the JVM\?/i);
    fireEvent.click(title);
    
    expect(screen.getByText('Java Virtual Machine')).toBeInTheDocument();
  });

  it('calls toggle handlers', () => {
    render(
      <QuestionCard 
        question={mockQuestion} 
        isBookmarked={false} 
        isMastered={false} 
        toggleBookmark={toggleBookmark}
        toggleMastered={toggleMastered}
      />
    );
    
    const bookmarkBtn = screen.getByTitle('Bookmark');
    const masteredBtn = screen.getByTitle('Mark as Mastered');
    
    fireEvent.click(bookmarkBtn);
    expect(toggleBookmark).toHaveBeenCalledWith(1);
    
    fireEvent.click(masteredBtn);
    expect(toggleMastered).toHaveBeenCalledWith(1);
  });
});
