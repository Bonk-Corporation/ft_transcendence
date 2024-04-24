import React from 'react';


export function LogCard(props) {
  return (
    <a href="/profile" className="flex items-center rounded-full hover:bg-white transition-all group hover:cursor-pointer pr-4">
      <div className={`h-12 aspect-square mr-4 rounded-full border-2 border-white bg-[url(${props.user.avatar})] bg-center bg-cover`}></div>
      <div>
        <h1 className="group-hover:text-black transition-all">{props.user.name}</h1>
        <h1 className="group-hover:text-black font-medium text-sm transition-all">Level {props.user.level}</h1>
      </div>
    </a>
  );
}
