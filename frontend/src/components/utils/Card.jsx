import React from "react";

export function Card({ className = "", children, ...rest }) {
  return (
    <div
      className={`${className} backdrop-blur-lg rounded-md before:rounded-md bg-gradient-to-br from-white/20 to-white/5  transition-all ease-in-out`}
      {...rest}
    >
      {children}
    </div>
  );
}
