import React, { forwardRef } from 'react';

export const Input = forwardRef((props, ref) => {
  return (<input {...props} className={`${props.className} ${props.disabled ? "cursor-not-allowed" : "cursor-text"} bg-transparent border-white border-2 rounded-lg px-2 py-1`}

    ref={ref} />)
});
