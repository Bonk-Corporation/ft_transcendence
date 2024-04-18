import React from 'react';

export function Card({children}) {
  return (
    <div class="backdrop-blur-lg w-80 h-80 rounded-md before:rounded-md border-gradient">
      {children}
    </div>
  );
}
