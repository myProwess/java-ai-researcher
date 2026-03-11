import React from 'react';
import { BookOpen, ChevronLeft, ChevronRight, Hash } from 'lucide-react';

const Sidebar = ({ topics, selectedTopic, setSelectedTopic, isOpen, setOpen }) => {
  return (
    <aside className={`sidebar ${!isOpen ? 'closed' : ''}`}>
      <div className="sidebar-header">
        <div className="logo">
          <BookOpen size={24} />
          <span>JavaInterview Hub</span>
        </div>
      </div>
      
      <div className="topic-list">
        <h3 style={{ padding: '0 1rem 1rem', fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
          Explore Topics
        </h3>
        {topics.map(topic => (
          <button
            key={topic}
            className={`topic-item ${selectedTopic === topic ? 'active' : ''}`}
            onClick={() => setSelectedTopic(topic)}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Hash size={16} opacity={selectedTopic === topic ? 1 : 0.5} />
              {topic}
            </div>
          </button>
        ))}
      </div>

      <div style={{ padding: '1rem', borderTop: '1px solid var(--border)' }}>
        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'center' }}>
          v1.0.0 Static Build
        </p>
      </div>
    </aside>
  );
};

export default Sidebar;
