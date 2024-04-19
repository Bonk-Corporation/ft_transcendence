import React from 'react';
import { Card } from './Card';

export function ShopItem(props) {
  return (
    <Card className='flex flex-col p-4 justify-center items-center hover:cursor-pointer border-gradient-hover hover:from-white/40 hover:to-white/10 hover:mx-[-5px] hover:my-[-5px]'>
        <div className="flex border-2 border-white p-4 rounded">
            <div className={`lg:w-16 w-8 aspect-square rounded-full bg-red-500 bg-[url(${props.item.images[0]})] bg-center bg-cover`}/>
            <div className={`lg:w-16 w-8 aspect-square rounded-full bg-red-500 bg-[url(${props.item.images[1]})] bg-center bg-cover`}/>
            <div className={`lg:w-16 w-8 aspect-square rounded-full bg-red-500 bg-[url(${props.item.images[2]})] bg-center bg-cover`}/>
        </div>
        <h1 className="text-xl font-medium">{props.item.name}</h1>
        <div className="flex bg-white px-1.5 py-0.5 rounded">
            <h1 className="text-black font-medium mr-1">{props.item.price}</h1>
            <h1 className="bg-black rounded-full aspect-square w-6 flex justify-center items-center font-medium text-sm">B</h1>
        </div>
    </Card>
  );
}
