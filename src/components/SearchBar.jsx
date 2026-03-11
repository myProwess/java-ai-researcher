import React, { useState } from 'react';
import { Search, Mic, MicOff } from 'lucide-react';

const SearchBar = ({ value, onChange, lastSearched }) => {
  const [isListening, setIsListening] = useState(false);

  const startSpeech = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech recognition is not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      onChange(transcript);
    };
    recognition.start();
  };

  return (
    <div className="search-container">
      <Search className="search-icon" size={20} />
      <input
        type="text"
        className="search-input"
        placeholder="Search with contextual intelligence (e.g., 'JVM memory', 'interface vs abstract')..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      <button 
        className={`speech-btn ${isListening ? 'listening' : ''}`}
        onClick={startSpeech}
        title="Speech to Search"
      >
        {isListening ? <MicOff size={18} color="var(--danger)" /> : <Mic size={18} />}
      </button>
      
      {lastSearched && (
        <p className="last-searched">
          Last search: <span onClick={() => onChange(lastSearched)}>{lastSearched}</span>
        </p>
      )}
    </div>
  );
};

export default SearchBar;
