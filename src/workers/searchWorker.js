import { Document } from 'flexsearch';

let index = null;
let questions = [];

self.onmessage = async (e) => {
  const { type, payload } = e.data;

  if (type === 'INIT') {
    questions = payload;
    index = new Document({
      document: {
        id: 'id',
        index: ['question', 'answer'],
      },
      tokenize: 'forward',
      context: true
    });

    questions.forEach(q => index.add(q));
    self.postMessage({ type: 'READY' });
    
    // Immediately send results for any pending search or just to populate initial state
    self.postMessage({ type: 'RESULTS', payload: questions.map(q => q.id) });
  }

  if (type === 'SEARCH') {
    const { query } = payload;
    
    // If we haven't even finished INIT yet, and we got a search request, 
    // we can't do anything, but once INIT finishes, it will broadcast all results.
    if (!index) {
      if (questions.length > 0) {
        self.postMessage({ type: 'RESULTS', payload: questions.map(q => q.id) });
      }
      return;
    }

    if (!query) {
      self.postMessage({ type: 'RESULTS', payload: questions.map(q => q.id) });
      return;
    }

    const searchResults = index.search(query, {
      enrich: true,
      suggest: true
    });

    const ids = new Set();
    searchResults.forEach(fieldResult => {
      fieldResult.result.forEach(id => ids.add(id));
    });

    self.postMessage({ type: 'RESULTS', payload: Array.from(ids) });
  }
};
