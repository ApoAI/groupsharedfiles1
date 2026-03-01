import React from 'react';
import './index.css';

function App() {
  return (
    <div className="app-container">
      <div className="decorative-circle circle-1"></div>
      <div className="decorative-circle circle-2"></div>
      
      <div className="glass-card">
        <h1 className="title">Ready for Vercel</h1>
        <p className="subtitle">
          Your new dynamic web application is scaffolded and styled with modern 
          glassmorphism. Just commit to GitHub and connect to Vercel to launch.
        </p>
        <button className="deploy-btn" onClick={() => window.open('https://vercel.com/new', '_blank')}>
          Deploy Now
        </button>
      </div>
    </div>
  );
}

export default App;
