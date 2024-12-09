import React from 'react';

function Button({ text, onClick, link, style }) {
  return (
    <button
      onClick={() => (link ? window.location.href = link : onClick && onClick())}
      style={{
        backgroundColor: '#007bff',
        color: 'white',
        padding: '14px 40px',
        fontSize: '20px',
        fontWeight: 'bold',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        ...style, // Allow custom inline styles to override defaults
      }}
    >
      {text}
    </button>
  );
}

export default Button;
