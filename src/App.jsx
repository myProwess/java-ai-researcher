import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import SearchBar from './components/SearchBar';
import Filters from './components/Filters';
import QuestionList from './components/QuestionList';
import './App.css';

// Initialize Worker
const searchWorker = new Worker(new URL('./workers/searchWorker.js', import.meta.url), { type: 'module' });

function App() {
  const [questions, setQuestions] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTopic, setSelectedTopic] = useState('All');

  const [searchResultIds, setSearchResultIds] = useState(null);
  const [isWorkerReady, setWorkerReady] = useState(false);
  
  const [masteredIds, setMasteredIds] = useState(() => {
    const saved = localStorage.getItem('mastered');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [bookmarks, setBookmarks] = useState(() => {
    const saved = localStorage.getItem('bookmarks');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [isSidebarOpen, setSidebarOpen] = useState(window.innerWidth > 768);
  const [lastSearched, setLastSearched] = useState(localStorage.getItem('lastSearched') || '');

  // 1. Data Loading & Worker INIT
  useEffect(() => {
    const dataFiles = ['data/java_questions_1.json', 'data/java_questions_2.json'];
    
    const fetchQuestions = async () => {
      try {
        const fetchPromises = dataFiles.map(file => {
          const url = `${import.meta.env.BASE_URL}${file}`.replace(/\/+/g, '/');
          return fetch(url).then(res => res.json());
        });
        
        const results = await Promise.all(fetchPromises);
        const allQuestions = results.flat();
        
        // Ensure IDs are unique if they weren't before (though they should be)
        setQuestions(allQuestions);
        searchWorker.postMessage({ type: 'INIT', payload: allQuestions });
      } catch (err) {
        console.error('Failed to load questions:', err);
      }
    };

    fetchQuestions();

    searchWorker.onmessage = (e) => {
      const { type, payload } = e.data;
      if (type === 'READY') setWorkerReady(true);
      if (type === 'RESULTS') setSearchResultIds(payload);
    };
  }, []);

  // 2. Sync Hash to State
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      const params = new URLSearchParams(hash);
      
      const q = params.get('q') || '';
      const topic = params.get('topic') || 'All';


      setSearchQuery(q);
      setSelectedTopic(topic);
      
      // We don't call worker here immediately to avoid race conditions with INIT
      // The search effect below will handle it once ready
    };

    window.addEventListener('hashchange', handleHashChange);
    handleHashChange(); 
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // 3. Search Effect (Reactive to state changes)
  useEffect(() => {
    if (isWorkerReady) {
      searchWorker.postMessage({ type: 'SEARCH', payload: { query: searchQuery } });
    }
  }, [isWorkerReady, searchQuery]);

  // 4. Sync State to Hash for sharing
  useEffect(() => {
    const params = new URLSearchParams();
    if (searchQuery) params.set('q', searchQuery);
    if (selectedTopic !== 'All') params.set('topic', selectedTopic);
    
    const newHash = params.toString();
    if (window.location.hash !== `#${newHash}`) {
      window.history.replaceState(null, '', `#${newHash}`);
    }
  }, [searchQuery, selectedTopic]);

  // 4. Persistence
  useEffect(() => {
    localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
    localStorage.setItem('mastered', JSON.stringify(masteredIds));
  }, [bookmarks, masteredIds]);

  const handleSearch = useCallback((query) => {
    setSearchQuery(query);
    if (query) {
      setLastSearched(query);
      localStorage.setItem('lastSearched', query);
    }
  }, []);

  const toggleBookmark = (id) => {
    setBookmarks(prev => prev.includes(id) ? prev.filter(b => b !== id) : [...prev, id]);
  };

  const toggleMastered = (id) => {
    setMasteredIds(prev => prev.includes(id) ? prev.filter(b => b !== id) : [...prev, id]);
  };

  const selectRandom = () => {
    if (questions.length === 0) return;
    const pool = questions.filter(q => !masteredIds.includes(q.id));
    const randomPool = pool.length > 0 ? pool : questions;
    const q = randomPool[Math.floor(Math.random() * randomPool.length)];
    handleSearch(q.question);
  };

  const filteredQuestions = useMemo(() => {
    let results = questions;
    
    // Only apply worker results if we have received some
    if (searchResultIds !== null) {
      // Map based on ID matching
      const idSet = new Set(searchResultIds);
      results = questions.filter(q => idSet.has(q.id));
    }

    return results.filter(q => {
      return selectedTopic === 'All' || q.topic === selectedTopic;
    });
  }, [questions, searchResultIds, selectedTopic]);

  const topics = useMemo(() => {
    const allTopics = questions.map(q => q.topic);
    return ['All', ...new Set(allTopics)].sort();
  }, [questions]);

  return (
    <div className="app-container">
      <Sidebar 
        topics={topics} 
        selectedTopic={selectedTopic} 
        setSelectedTopic={(t) => setSelectedTopic(t)}
        isOpen={isSidebarOpen}
        setOpen={setSidebarOpen}
      />
      
      <main className={`main-content ${!isSidebarOpen ? 'sidebar-closed' : ''}`}>
        <Header 
          toggleSidebar={() => setSidebarOpen(!isSidebarOpen)} 
          bookmarkCount={bookmarks.length}
          masteredCount={masteredIds.length}
          totalCount={questions.length}
          onRandom={selectRandom}
        />
        
        <div className="content-inner">
          <div className="search-section glass">
            <SearchBar 
              value={searchQuery} 
              onChange={handleSearch} 
              lastSearched={lastSearched}
            />
            <Filters 
              totalCount={filteredQuestions.length}
            />
          </div>

          <QuestionList 
            questions={filteredQuestions} 
            bookmarks={bookmarks}
            masteredIds={masteredIds}
            toggleBookmark={toggleBookmark}
            toggleMastered={toggleMastered}
          />
        </div>
      </main>
    </div>
  );
}

export default App;
