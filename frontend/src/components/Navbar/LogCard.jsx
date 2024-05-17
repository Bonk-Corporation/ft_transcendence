import React from 'react';


export function LogCard(props) {
  return (
      <a href="/profile" className="hidden md:flex items-center rounded-full hover:bg-white transition-all group hover:cursor-pointer pr-4">
        <div className={`h-12 aspect-square mr-4 rounded-full border-2 border-white bg-[url(${props.user ? props.user.avatar : null})] bg-center bg-cover`}></div>
        <div>
          <h1 className="group-hover:text-black transition-all">{props.user ? props.user.name : null}</h1>
          <h1 className="group-hover:text-black font-medium text-sm transition-all">{props.user ? `Level ${props.user.level}` : null}</h1>
        </div>
      </a>
  );
}
