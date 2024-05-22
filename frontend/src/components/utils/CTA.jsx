import React from 'react';

export function CTA({className = "", black = false, transparent=false, children, onClick = () => {}}) {
  return (
    <button onClick={onClick} className={`${className} px-6 py-1 ${black ? "bg-black text-white hover:bg-white hover:text-black" : transparent ? "bg-transparent" : "bg-white text-black hover:bg-gray-300"} rounded-lg font-medium  transition-all ease-in-out`}>
        {children}
    </button>
  );
}