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

  const formatAnswer = (text) => {
    if (!text) return null;
    const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
    const cleanedSentences = sentences.map(s => s.trim()).filter(s => s.length > 0);
    
    if (cleanedSentences.length > 2) {
      return (
        <ul style={{ paddingLeft: '1.2rem', margin: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {cleanedSentences.map((sentence, idx) => (
            <li key={idx}>{sentence}</li>
          ))}
        </ul>
      );
    }
    return text;
  };

  const formatAnswerWithCode = (text) => {
    if (!text) return null;
    
    // Match common Java code blocks up to the last closing brace
    const codeRegex = /(?:import\s+[\w.]+;|(?:(?:public|private|protected|static|final|abstract)\s+)*(?:class|interface|enum)\s+\w+|public\s+static\s+void\s+main|try\s*\{|for\s*\(|while\s*\()[\s\S]*\}/;
    const match = text.match(codeRegex);
    
    if (match) {
      const codePart = match[0];
      const parts = text.split(codePart);
      const beforeCode = parts[0].trim();
      const afterCode = parts.slice(1).join(codePart).trim();
      
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {beforeCode && <div>{formatAnswer(beforeCode)}</div>}
          <div style={{ background: 'rgba(0,0,0,0.3)', padding: '0.5rem', borderRadius: '8px', overflowX: 'auto' }}>
            <pre style={{ margin: 0, padding: '0.5rem', whiteSpace: 'pre-wrap' }}>
              <code className="language-java" ref={codeRef}>
                {codePart}
              </code>
            </pre>
          </div>
          {afterCode && <div>{formatAnswer(afterCode)}</div>}
        </div>
      );
    }
    
    // Fallback if no matching closing brace was found
    return (
      <div style={{ background: 'rgba(0,0,0,0.3)', padding: '0.5rem', borderRadius: '8px', overflowX: 'auto' }}>
        <pre style={{ margin: 0, padding: '0.5rem', whiteSpace: 'pre-wrap' }}>
          <code className="language-java" ref={codeRef}>
            {text}
          </code>
        </pre>
      </div>
    );
  };

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
              {hasCode ? formatAnswerWithCode(question.answer) : formatAnswer(question.answer)}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default QuestionCard;
