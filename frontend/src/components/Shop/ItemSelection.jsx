import React from 'react';
import { BallPresentation } from './BallPresentation';
import { Price } from './Price';
import { Input } from '../utils/Input';
import { CTA } from '../utils/CTA';


export function ItemSelection(props) {
  return (
    <div className="flex flex-col justify-center items-center">
        <div className="flex flex-col items-center">
            <BallPresentation images={props.item.images}/>
            <div className=" mx-4 flex flex-col items-center">
                <h1 className="font-semibold text-xl">'{props.item.name}' skin pack</h1>
                <div className="flex items-center">
                    <Price price={props.item.price} />
                    <p className="mx-2 font-medium text-gray-300">
                        {props.item.price * 2}€
                    </p>
                </div>
            </div>
      </div>
      <a href="https://buy.stripe.com/test_8wMdT15fvcvEcUweUU" className="mt-4 flex flex-col justify-center items-center">
          <CTA>Buy</CTA>
      </a>
    </div>
  );
}
