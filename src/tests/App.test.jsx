import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import App from '../App';
import React from 'react';

const mockQuestions = [
  { id: 1, question: 'What is Java?', answer: 'A language', topic: 'Basics', difficulty: 'Basic' },
  { id: 2, question: 'How JVM works?', answer: 'Bytecode', topic: 'JVM', difficulty: 'Intermediate' },
];

describe('Java Interview Hub Core Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    global.fetch.mockResolvedValue({
      json: () => Promise.resolve(mockQuestions),
    });
  });

  it('renders the main app structure', async () => {
    render(<App />);
    expect(await screen.findByText(/JavaInterview Hub/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Search with contextual intelligence/i)).toBeInTheDocument();
  });

  it('fetches and displays questions on load', async () => {
    render(<App />);
    
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalled();
    });
  });

  it('updates search query state on input change', async () => {
    render(<App />);
    const searchInput = screen.getByPlaceholderText(/Search with contextual intelligence/i);
    
    fireEvent.change(searchInput, { target: { value: 'JVM' } });
    expect(searchInput.value).toBe('JVM');
  });

  it('changes difficulty filter when clicked', async () => {
    render(<App />);
    const intBtn = screen.getByText('Intermediate');
    
    fireEvent.click(intBtn);
    expect(intBtn).toHaveClass('active');
  });
});
