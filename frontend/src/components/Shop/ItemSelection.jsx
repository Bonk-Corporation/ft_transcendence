import React from 'react';
import { BallPresentation } from './BallPresentation';
import { Price } from './Price';
import { Input } from '../utils/Input';
import { CTA } from '../utils/CTA';


export function ItemSelection(props) {
  function handleClick() {
    if (!props.possessed)
      console.log("Buying");
    else if (!props.selected)
      console.log("Selecting");
    else
      console.log("Deselecting");
    
    fetch("/api/me").then(res => res.json().then(data => {
      props.setProfile(data);
    }));
  }

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
      <a  onClick={handleClick}
          target="_blank" className="mt-4 flex flex-col justify-center items-center">
          {
            props.possessed ?
            <CTA className='w-72 h-11 font-normal' black={props.selected}>{props.selected ? "Deselect" : "Select"}</CTA> :
            // @ts-ignore
            <stripe-buy-button
              buy-button-id="buy_btn_1PIBt8KG666poqhFwKbTAzAp"
              publishable-key={import.meta.env.VITE_STRIPE_API_KEY}
              client-reference-id={props.profile.name + "/" + props.item.name}
            />
          }
      </a>
    </div>
  );
}
