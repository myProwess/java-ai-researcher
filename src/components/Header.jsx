import React from 'react';
import { Menu, Bookmark, Coffee, Github, CheckCircle } from 'lucide-react';

const Header = ({ toggleSidebar, bookmarkCount, masteredCount, totalCount, onRandom }) => {
  const progress = totalCount > 0 ? (masteredCount / totalCount) * 100 : 0;

  return (
    <header className="header">
      <div className="header-left">
        <button onClick={toggleSidebar} className="menu-toggle">
          <Menu size={24} />
        </button>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span style={{ fontWeight: 600, color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            Personal Roadmap
          </span>
          <div className="progress-container">
            <div className="progress-bar" style={{ width: `${progress}%` }}></div>
          </div>
        </div>
      </div>

      <div className="header-right">
        <button className="glass" onClick={onRandom} style={{ padding: '0.4rem 0.8rem', borderRadius: '0.4rem', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Coffee size={16} /> Random Q
        </button>
        
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: 'var(--accent)' }}>
            <CheckCircle size={16} /> {masteredCount}
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: 'var(--accent-alt)' }}>
            <Bookmark size={16} /> {bookmarkCount}
          </span>
        </div>

        <div style={{ width: '1px', height: '20px', background: 'var(--border)' }}></div>
        <a href="https://github.com" target="_blank" rel="noreferrer">
          <Github size={20} color="var(--text-muted)" />
        </a>
      </div>
    </header>
  );
};

export default Header;
