import React from 'react';

const LoadingIndicator = () => (
  <div style={{
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    fontSize: '1.2rem',
    color: '#555'
  }}>
    <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
      {[0, 1, 2].map(i => (
        <span key={i} style={{
          width: 12,
          height: 12,
          backgroundColor: '#95c941',
          borderRadius: '50%',
          display: 'inline-block',
          animation: 'bounce 1.4s infinite ease-in-out both',
          animationDelay: `${i * 0.2}s`,
        }} />
      ))}
    </div>
    Loading jobs...
    <style>{`
      @keyframes bounce {
        0%, 80%, 100% { transform: scale(0); }
        40% { transform: scale(1); }
      }
    `}</style>
  </div>
);

export default LoadingIndicator;
