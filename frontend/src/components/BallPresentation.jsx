import React from 'react';
import '../style.css'

export function BallPresentation(props) {
  return (
    <div className="flex border-2 border-white p-4 rounded">
        <div className={`lg:w-16 w-8 aspect-square rounded-full bg-red-500 bg-[url(${props.images[0]})] bg-center bg-cover`}/>
        <div className={`lg:w-16 w-8 aspect-square rounded-full bg-red-500 bg-[url(${props.images[1]})] bg-center bg-cover`}/>
        <div className={`lg:w-16 w-8 aspect-square rounded-full bg-red-500 bg-[url(${props.images[2]})] bg-center bg-cover`}/>
    </div>
  );
}
