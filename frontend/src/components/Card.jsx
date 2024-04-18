import React from 'react';

export function Card({className, children}) {
  return (
    <div className={`backdrop-blur-lg rounded-md before:rounded-md border-gradient ${className}`}>
      {children}
    </div>
  );
}
