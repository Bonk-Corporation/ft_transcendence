import React from 'react';

export function Card({className = "", children}) {
  return (
    <div className={`backdrop-blur-lg rounded-md before:rounded-md ${className} bg-gradient-to-br from-white/20 to-white/5  transition-all ease-in-out`}>
      {children}
    </div>
  );
}
