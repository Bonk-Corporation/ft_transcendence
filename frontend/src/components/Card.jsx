import React from 'react';
import '../style.css'

export function Card({className = "", color = "white", children}) {
  return (
    <div className={`backdrop-blur-lg rounded-md before:rounded-md ${className} bg-gradient-to-br from-${color}/20 to-${color}/5  transition-all ease-in-out`}>
      {children}
    </div>
  );
}
