import React from 'react';


export function Input(props) {
  return (
    <input {...(props.disabled ? {disabled:true} : null )} className={`${props.className} ${props.disabled ? "cursor-not-allowed" : "cursor-text"} bg-transparent border-white border-2 rounded-lg px-2 py-1`} placeholder={props.placeholder} type={props.type} />
  );
}
