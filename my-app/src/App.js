import React, { useState, useEffect } from 'react';
import './App.css';
import { generatePassword } from './utils/passwordGenerator';

function App() {
  const [password, setPassword] = useState('');
  const [passwordLength, setPasswordLength] = useState(12);
  const [includeUppercase, setIncludeUppercase] = useState(true);
  const [includeLowercase, setIncludeLowercase] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [showCopiedMessage, setShowCopiedMessage] = useState(false);

  const handleGeneratePassword = () => {
    // Ensure at least one character type is selected
    if (!includeUppercase && !includeLowercase && !includeNumbers && !includeSymbols) {
      alert("Please select at least one character type.");
      return;
    }
    const newPassword = generatePassword(
      passwordLength,
      includeUppercase,
      includeLowercase,
      includeNumbers,
      includeSymbols
    );
    setPassword(newPassword);
  };

  // Generate a password on initial load
  useEffect(() => {
    handleGeneratePassword();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty dependency array means this runs once on mount

  const copyToClipboard = () => {
    if (!password) return;
    navigator.clipboard.writeText(password).then(() => {
      setShowCopiedMessage(true);
      setTimeout(() => setShowCopiedMessage(false), 2000); // Hide message after 2 seconds
    });
  };

  return (
    <div className="App">
      <div className="password-generator">
        <h1>Password Generator</h1>
        
        <div className="password-display">
          <input type="text" value={password} readOnly placeholder="Generated Password" onClick={copyToClipboard} title="Click to copy" />
          {showCopiedMessage && <span className="copied-message">Copied!</span>}
        </div>
        
        <div className="controls">
          <div className="control-group">
            <label htmlFor="length">Password Length: {passwordLength}</label>
            <input 
              type="range" 
              id="length" 
              name="length" 
              min="8" 
              max="32" 
              value={passwordLength}
              onChange={(e) => setPasswordLength(parseInt(e.target.value))}
            />
          </div>
          
          <div className="control-group">
            <label>
              <input 
                type="checkbox" 
                name="uppercase" 
                checked={includeUppercase}
                onChange={(e) => setIncludeUppercase(e.target.checked)}
              /> Uppercase
            </label>
            <label>
              <input 
                type="checkbox" 
                name="lowercase" 
                checked={includeLowercase}
                onChange={(e) => setIncludeLowercase(e.target.checked)}
              /> Lowercase
            </label>
            <label>
              <input 
                type="checkbox" 
                name="numbers" 
                checked={includeNumbers}
                onChange={(e) => setIncludeNumbers(e.target.checked)}
              /> Numbers
            </label>
            <label>
              <input 
                type="checkbox" 
                name="symbols" 
                checked={includeSymbols}
                onChange={(e) => setIncludeSymbols(e.target.checked)}
              /> Symbols
            </label>
          </div>
          
          <button className="generate-button" onClick={handleGeneratePassword}>
            Generate Password
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
