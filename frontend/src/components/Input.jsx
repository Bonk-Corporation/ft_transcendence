import React from 'react';

export function Input(props) {
  return (
    <input className={`${props.className} bg-transparent border-white border-2 rounded-lg px-2 py-1`} placeholder={props.placeholder} type="text" />
  );
}
