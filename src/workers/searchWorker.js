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
  }

  if (type === 'SEARCH') {
    const { query } = payload;
    if (!query || !index) {
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
