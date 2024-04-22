import React from 'react';
import { BallPresentation } from './BallPresentation';
import { Price } from './Price';
import { Input } from './Input';
import { CTA } from './CTA';

export function Payment(props) {
  return (
    <div className="flex flex-col justify-center items-center">
        <div className="flex items-center">
            <BallPresentation images={props.item.images}/>
            <div className=" mx-4 flex flex-col">
                <h1 className="font-semibold text-xl">'{props.item.name}' skin pack</h1>
                <div className="flex items-center">
                    <Price price={props.item.price} />
                    <p className="mx-2 font-medium text-gray-300">
                        {props.item.price * 2}€
                    </p>
                </div>
            </div>
      </div>
      <div className="mt-8 flex flex-col justify-center items-center">
        <h1 className="text-xl font-semibold">Billing informations</h1>
        <form action="" method="POST" className="flex flex-col justify-center items-center">
            <input className="bg-transparent border-white border-2 rounded-lg my-1 w-full px-2 py-1" placeholder="Card code" type="text" />
            <div className="flex">
                <Input placeholder="Expiration date" className="my-1 w-full"/>
                <Input placeholder="CCV" className="my-1 w-16 ml-2"/>
            </div>
            <CTA className="mt-2">Buy</CTA>
        </form>
      </div>
    </div>
  );
}
