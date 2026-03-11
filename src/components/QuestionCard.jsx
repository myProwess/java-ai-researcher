import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bookmark, ChevronDown, ChevronUp, CheckCircle } from 'lucide-react';
import Prism from 'prismjs';
import 'prismjs/themes/prism-tomorrow.css';
import 'prismjs/components/prism-java';

const QuestionCard = ({ question, isBookmarked, isMastered, toggleBookmark, toggleMastered }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const codeRef = useRef(null);

  useEffect(() => {
    if (isExpanded && codeRef.current) {
      Prism.highlightElement(codeRef.current);
    }
  }, [isExpanded, question.answer]);

  const hasCode = /(?:public\s+class|public\s+static|public\s+interface|class\s+\w+\s*\{|void\s+\w+\(|int\s+\w+\(|return\s+|try\s*\{|catch\s*\(|for\s*\(|while\s*\(|System\.out\.println)/.test(question.answer);

  return (
    <motion.div 
      layout
      className={`question-card ${isMastered ? 'mastered' : ''}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      style={{ opacity: isMastered ? 0.6 : 1 }}
    >
      <div className="card-header" onClick={() => setIsExpanded(!isExpanded)}>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>

            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', background: 'rgba(255,255,255,0.05)', padding: '0.15rem 0.4rem', borderRadius: '4px' }}>
              {question.topic}
            </span>
            {isMastered && (
              <span className="badge" style={{ background: 'rgba(34, 197, 94, 0.2)', color: 'var(--accent)' }}>
                Mastered
              </span>
            )}
          </div>
          <h3 className="card-title" style={{ fontSize: '1rem' }}>Q{question.id}: {question.question}</h3>
        </div>
        
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <button 
            onClick={(e) => { e.stopPropagation(); toggleMastered(question.id); }}
            style={{ color: isMastered ? 'var(--accent)' : 'var(--text-muted)' }}
            title="Mark as Mastered"
          >
            <CheckCircle size={20} fill={isMastered ? 'rgba(34, 197, 94, 0.2)' : 'none'} />
          </button>
          <button 
            onClick={(e) => { e.stopPropagation(); toggleBookmark(question.id); }}
            style={{ color: isBookmarked ? 'var(--accent-alt)' : 'var(--text-muted)' }}
            title="Bookmark"
          >
            <Bookmark size={20} fill={isBookmarked ? 'currentColor' : 'none'} />
          </button>
          {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </div>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="card-content"
          >
            <div className="answer-body" style={{ fontSize: '0.9rem' }}>
              {hasCode ? (
                <pre style={{ whiteSpace: 'pre-wrap', background: 'transparent', margin: 0, padding: 0 }}>
                  <code className="language-java" ref={codeRef}>
                    {question.answer}
                  </code>
                </pre>
              ) : (
                question.answer
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default QuestionCard;
