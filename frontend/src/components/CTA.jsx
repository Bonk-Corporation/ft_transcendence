import React from 'react';
import '../style.css'

export function CTA({className = "", children}) {
  return (
    <button className={`${className} px-6 py-1 bg-white rounded-lg text-black font-medium hover:bg-gray-300 transition-all ease-in-out`}>
        {children}
    </button>
  );
}