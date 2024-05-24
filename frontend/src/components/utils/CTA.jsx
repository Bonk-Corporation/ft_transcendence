import React from 'react';

// Bordel Julian, quand on fait un component, on herite des props
export function CTA({className = "", black = false, transparent=false, children, ...props}) {
  return (
    <button className={`${className} px-6 py-1 ${black ? "bg-black text-white hover:bg-white hover:text-black" : transparent ? "bg-transparent" : "bg-white text-black hover:bg-gray-300"} rounded-lg font-medium  transition-all ease-in-out`} {...props}>
        {children}
    </button>
  );
}
